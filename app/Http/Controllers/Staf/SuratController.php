<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Models\JenisSurat;
use App\Models\Penduduk;
use App\Models\Surat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\PengajuanSurat;

class SuratController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $status = trim((string) $request->input('status', ''));
        $jenisId = $request->input('jenis', '');

        return Inertia::render('staf/surat/index', [
            'surat' => Surat::with(['jenisSurat:id,kode,nama', 'penduduk:id,nik,nama_lengkap'])
                ->when($search !== '', function ($query) use ($search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('nomor_surat', 'like', "%{$search}%")
                            ->orWhere('perihal', 'like', "%{$search}%")
                            ->orWhereHas('penduduk', function ($sub) use ($search) {
                                $sub->where('nama_lengkap', 'like', "%{$search}%")
                                    ->orWhere('nik', 'like', "%{$search}%");
                            });
                    });
                })
                ->when($status !== '', function ($query) use ($status) {
                    $query->where('status', $status);
                })
                ->when($jenisId !== '', function ($query) use ($jenisId) {
                    $query->where('jenis_surat_id', $jenisId);
                })
                ->orderByDesc('created_at')
                ->paginate(10)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'jenis' => $jenisId,
            ],
            'jenisSurat' => JenisSurat::active()
                ->orderBy('urutan')
                ->get(['id', 'kode', 'nama', 'template_fields']),
            'pendudukList' => Penduduk::where('status_penduduk', 'Tetap')
                ->orWhere('status_penduduk', 'Sementara')
                ->orderBy('nama_lengkap')
                ->get(['id', 'nik', 'nama_lengkap']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        // Auto-generate nomor surat
        $jenis = JenisSurat::findOrFail($validated['jenis_surat_id']);
        $validated['nomor_surat'] = $this->generateNomorSurat($jenis->kode);

        Surat::create($validated);

        return to_route('staf.surat.index')->with('success', 'Surat berhasil dibuat.');
    }

    public function update(Request $request, Surat $surat): RedirectResponse
    {
        $validated = $request->validate($this->rules($surat->id));

        // Jika jenis_surat berubah dan nomor surat masih auto-generated, regenerate
        if (
            $surat->jenis_surat_id !== (int) $validated['jenis_surat_id']
            && $surat->status === 'draft'
        ) {
            $jenis = JenisSurat::findOrFail($validated['jenis_surat_id']);
            $validated['nomor_surat'] = $this->generateNomorSurat($jenis->kode);
        }

        $surat->update($validated);

        return to_route('staf.surat.index')->with('success', 'Surat berhasil diperbarui.');
    }

    public function destroy(Surat $surat): RedirectResponse
    {
        if ($surat->status === 'diterbitkan') {
            return to_route('staf.surat.index')
                ->with('error', 'Surat yang sudah diterbitkan tidak dapat dihapus.');
        }

        $surat->delete();

        return to_route('staf.surat.index')->with('success', "Surat {$surat->nomor_surat} berhasil dihapus.");
    }

    /**
     * Terbitkan surat (ubah status draft → diterbitkan).
     */
    public function terbitkan(Surat $surat): RedirectResponse
    {
        if ($surat->status !== 'draft') {
            return to_route('staf.surat.index')
                ->with('error', 'Hanya surat berstatus draft yang dapat diterbitkan.');
        }

        $surat->update(['status' => 'diterbitkan']);

        // Update pengajuan status jika surat berasal dari pengajuan
        if ($surat->pengajuan_surat_id) {
            $pengajuan = PengajuanSurat::find($surat->pengajuan_surat_id);
            if ($pengajuan) {
                $pengajuan->update([
                    'status' => 'selesai',
                    'tanggal_diproses' => now(),
                ]);
            }
        }

        return to_route('staf.surat.index')
            ->with('success', "Surat {$surat->nomor_surat} berhasil diterbitkan.");
    }

    /**
     * Batalkan surat (ubah status → dibatalkan).
     */
    public function batalkan(Surat $surat): RedirectResponse
    {
        if ($surat->status === 'dibatalkan') {
            return to_route('staf.surat.index')
                ->with('error', 'Surat sudah dalam status dibatalkan.');
        }

        $surat->update(['status' => 'dibatalkan']);

        // Update pengajuan status jika surat berasal dari pengajuan
        if ($surat->pengajuan_surat_id) {
            $pengajuan = PengajuanSurat::find($surat->pengajuan_surat_id);
            if ($pengajuan) {
                $pengajuan->update(['status' => 'ditolak']);
            }
        }

        return to_route('staf.surat.index')
            ->with('success', "Surat {$surat->nomor_surat} dibatalkan.");
    }

    // ── Helpers ─────────────────────────────────────────────

    /**
     * Generate nomor surat: 001/SK-DOM/KA/V/2026
     * Format: {urut}/{kode_jenis}/KA/{bulan_romawi}/{tahun}
     */
    private function generateNomorSurat(string $kodeJenis): string
    {
        $bulanRomawi = [
            1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV',
            5 => 'V', 6 => 'VI', 7 => 'VII', 8 => 'VIII',
            9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII',
        ];

        $now = now();
        $bulan = $bulanRomawi[$now->month];
        $tahun = $now->year;

        // Hitung nomor urut bulan ini untuk jenis surat ini
        $lastSurat = Surat::whereHas('jenisSurat', fn ($q) => $q->where('kode', $kodeJenis))
            ->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->count();

        $urut = str_pad($lastSurat + 1, 3, '0', STR_PAD_LEFT);

        return "{$urut}/{$kodeJenis}/KA/{$bulan}/{$tahun}";
    }

    private function rules(?int $ignoreId = null): array
    {
        return [
            'jenis_surat_id' => ['required', 'exists:jenis_surat,id'],
            'penduduk_id' => ['required', 'exists:penduduk,id'],
            'perihal' => ['required', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string'],
            'data_tambahan' => ['nullable', 'array'],
            'data_tambahan.*' => ['nullable'],
            'status' => ['sometimes', 'string', 'in:draft,diterbitkan,dibatalkan'],
            'tanggal_surat' => ['required', 'date'],
            'ditandatangani_oleh' => ['nullable', 'string', 'max:255'],
            'jabatan_penandatangan' => ['nullable', 'string', 'max:255'],
            'pengajuan_surat_id' => ['nullable', 'exists:pengajuan_surat,id'],
        ];
    }
}
