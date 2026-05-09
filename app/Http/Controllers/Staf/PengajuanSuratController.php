<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Models\JenisSurat;
use App\Models\PengajuanSurat;
use App\Models\Penduduk;
use App\Models\Surat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanSuratController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $status = trim((string) $request->input('status', 'menunggu'));
        $jenis = trim((string) $request->input('jenis', ''));

        $paginator = PengajuanSurat::with(['penduduk', 'jenisSurat', 'user', 'lampiran.persyaratanSurat'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('keperluan', 'like', "%{$search}%")
                        ->orWhereHas('penduduk', function ($subQ) use ($search) {
                            $subQ->where('nama_lengkap', 'like', "%{$search}%")
                                ->orWhere('nik', 'like', "%{$search}%");
                        })
                        ->orWhereHas('user', function ($subQ) use ($search) {
                            $subQ->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status !== '', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($jenis !== '', function ($query) use ($jenis) {
                $query->where('jenis_surat_id', $jenis);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Transform collection to ensure relationships are included
        $collection = $paginator->getCollection()->map(function ($item) {
            return [
                'id' => $item->id,
                'penduduk_id' => $item->penduduk_id,
                'jenis_surat_id' => $item->jenis_surat_id,
                'user_id' => $item->user_id,
                'keperluan' => $item->keperluan,
                'keterangan' => $item->keterangan,
                'status' => $item->status,
                'catatan_staf' => $item->catatan_staf,
                'tanggal_diproses' => $item->tanggal_diproses?->toIso8601String(),
                'created_at' => $item->created_at->toIso8601String(),
                'penduduk' => $item->penduduk ? [
                    'id' => $item->penduduk->id,
                    'nik' => $item->penduduk->nik,
                    'nama_lengkap' => $item->penduduk->nama_lengkap,
                ] : null,
                'jenisSurat' => $item->jenisSurat ? [
                    'id' => $item->jenisSurat->id,
                    'kode' => $item->jenisSurat->kode,
                    'nama' => $item->jenisSurat->nama,
                ] : null,
                'user' => $item->user ? [
                    'id' => $item->user->id,
                    'name' => $item->user->name,
                    'email' => $item->user->email,
                ] : null,
                'lampiran' => $item->lampiran->map(function ($lamp) {
                    return [
                        'id' => $lamp->id,
                        'nama_file' => $lamp->nama_file,
                        'path_file' => $lamp->path_file,
                        'tipe_file' => $lamp->tipe_file,
                        'persyaratan_nama' => $lamp->persyaratanSurat?->nama ?? 'Dokumen',
                    ];
                })->toArray(),
            ];
        });

        $paginator->setCollection($collection);

        return Inertia::render('staf/pengajuan/index', [
            'pengajuan' => $paginator,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'jenis' => $jenis,
            ],
            'jenisSurat' => JenisSurat::active()->orderBy('urutan')->get(['id', 'kode', 'nama']),
            'penduduk' => Penduduk::orderBy('nama_lengkap')->get(['id', 'nik', 'nama_lengkap']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $validated['user_id'] = auth()->id();
        $validated['status'] = 'menunggu';

        PengajuanSurat::create($validated);

        return to_route('staf.pengajuan.index')->with('success', 'Pengajuan surat berhasil dibuat.');
    }

    public function update(Request $request, PengajuanSurat $pengajuan): RedirectResponse
    {
        $validated = $request->validate($this->rules(true));

        // Update status jika berubah
        if ($request->has('status') && $request->input('status') !== 'menunggu') {
            $validated['tanggal_diproses'] = now();
        }

        $pengajuan->update($validated);

        return to_route('staf.pengajuan.index')->with('success', 'Pengajuan surat berhasil diperbarui.');
    }

    public function destroy(PengajuanSurat $pengajuan): RedirectResponse
    {
        $pengajuan->delete();

        return to_route('staf.pengajuan.index')->with('success', 'Pengajuan surat berhasil dihapus.');
    }

    public function updateStatus(Request $request, PengajuanSurat $pengajuan): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:menunggu,diproses,selesai,ditolak'],
            'catatan_staf' => ['nullable', 'string'],
        ]);

        $oldStatus = $pengajuan->status;
        $newStatus = $validated['status'];

        if ($newStatus !== 'menunggu' && $newStatus !== $oldStatus) {
            $validated['tanggal_diproses'] = now();
        }

        $pengajuan->update($validated);

        // Handle automatic surat creation/deletion based on status change
        $this->handleSuratStatusChange($pengajuan, $oldStatus, $newStatus);

        $statusMessages = [
            'diproses' => 'sedang diproses',
            'selesai' => 'selesai',
            'ditolak' => 'ditolak',
        ];

        $message = $statusMessages[$newStatus] ?? 'diperbarui';

        return to_route('staf.pengajuan.index')->with('success', "Pengajuan berhasil {$message}.");
    }

    /**
     * Handle surat creation/deletion based on status change
     */
    private function handleSuratStatusChange(PengajuanSurat $pengajuan, string $oldStatus, string $newStatus): void
    {
        $existingSurat = Surat::where('pengajuan_surat_id', $pengajuan->id)->first();

        // If status changed to 'ditolak', delete any existing surat
        if ($newStatus === 'ditolak' && $existingSurat) {
            // Delete the surat
            $existingSurat->delete();
            return;
        }

        // If status changed to 'diproses' or 'selesai' from 'menunggu' or 'ditolak'
        if (in_array($newStatus, ['diproses', 'selesai']) && in_array($oldStatus, ['menunggu', 'ditolak'])) {
            // Create surat if it doesn't exist
            if (!$existingSurat) {
                $nomorSurat = $this->generateNomorSurat($pengajuan->jenis_surat_id);

                Surat::create([
                    'pengajuan_surat_id' => $pengajuan->id,
                    'jenis_surat_id' => $pengajuan->jenis_surat_id,
                    'penduduk_id' => $pengajuan->penduduk_id,
                    'nomor_surat' => $nomorSurat,
                    'perihal' => $pengajuan->keperluan,
                    'keterangan' => $pengajuan->keterangan,
                    'data_tambahan' => $pengajuan->data_tambahan,
                    'status' => $newStatus === 'selesai' ? 'diterbitkan' : 'draft',
                    'tanggal_surat' => now(),
                    'ditandatangani_oleh' => $this->getSignatoryName(),
                    'jabatan_penandatangan' => $this->getSignatoryTitle(),
                ]);
            } elseif ($newStatus === 'selesai' && $existingSurat->status === 'draft') {
                // Update surat status to diterbitkan if pengajuan is selesai
                $existingSurat->update(['status' => 'diterbitkan']);
            }
        }
    }

    /**
     * Generate nomor surat dengan format: 001/SK-DOM/KA/V/2026
     */
    private function generateNomorSurat(int $jenisSuratId): string
    {
        $jenisSurat = JenisSurat::find($jenisSuratId);
        if (!$jenisSurat) {
            $jenisKode = 'SURAT';
        } else {
            $jenisKode = $jenisSurat->kode;
        }

        $bulanRomawi = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        $bulan = $bulanRomawi[now()->month];
        $tahun = now()->year;

        // Get urutan surat bulan ini untuk jenis yang sama
        $count = Surat::where('jenis_surat_id', $jenisSuratId)
            ->whereMonth('tanggal_surat', now()->month)
            ->whereYear('tanggal_surat', $tahun)
            ->whereNotNull('nomor_surat')
            ->count() + 1;

        $urutan = str_pad($count, 3, '0', STR_PAD_LEFT);

        return "{$urutan}/{$jenisKode}/KA/{$bulan}/{$tahun}";
    }

    /**
     * Get the name of the signatory for Kelurahan Ardipura
     */
    private function getSignatoryName(): string
    {
        // TODO: Ambil dari database settings atau config
        // Untuk sementara hardcode, bisa diganti dengan nama Lurah yang sebenarnya
        return 'Lurah Kelurahan Ardipura';
    }

    /**
     * Get the title/position of the signatory
     */
    private function getSignatoryTitle(): string
    {
        return 'Lurah';
    }

    private function rules(bool $isUpdate = false): array
    {
        return [
            'penduduk_id' => ['required', 'exists:penduduk,id'],
            'jenis_surat_id' => ['required', 'exists:jenis_surat,id'],
            'keperluan' => ['required', 'string', 'max:500'],
            'keterangan' => ['nullable', 'string'],
            'data_tambahan' => ['nullable', 'array'],
            'status' => $isUpdate ? ['sometimes', 'in:menunggu,diproses,selesai,ditolak'] : ['sometimes', 'in:menunggu'],
        ];
    }
}
