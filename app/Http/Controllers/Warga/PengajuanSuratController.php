<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use App\Models\JenisSurat;
use App\Models\LampiranPengajuan;
use App\Models\PengajuanSurat;
use App\Models\Penduduk;
use App\Models\PersyaratanSurat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;
use Inertia\Inertia;

class PengajuanSuratController extends Controller
{
    public function create(Request $request): Response
    {
        $user = $request->user();

        // Get penduduk data linked to user
        $penduduk = Penduduk::where('user_id', $user->id)->first(['id', 'nama_lengkap']);

        // Get jenis surat that can be submitted by warga with their persyaratan
        $jenisSurat = JenisSurat::where('is_active', true)
            ->where('bisa_diajukan_warga', true)
            ->with('persyaratan')
            ->orderBy('urutan')
            ->get();

        return inertia('warga/pengajuan/index', [
            'jenisSurat' => $jenisSurat,
            'penduduk' => $penduduk,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $user = $request->user();

        // Get penduduk linked to user
        $penduduk = Penduduk::where('user_id', $user->id)->first();

        if (!$penduduk) {
            return back()->with('error', 'Data penduduk belum terhubung dengan akun Anda.');
        }

        $validated['user_id'] = $user->id;
        $validated['penduduk_id'] = $penduduk->id;
        $validated['status'] = 'menunggu';

        // Create pengajuan
        $pengajuan = PengajuanSurat::create($validated);

        // Handle lampiran uploads
        if ($request->hasFile('lampiran')) {
            foreach ($request->file('lampiran') as $persyaratanId => $file) {
                if ($file && $file->isValid()) {
                    // Get persyaratan info
                    $persyaratan = PersyaratanSurat::find($persyaratanId);

                    // Store file
                    $path = $file->store('lampiran-pengajuan', 'public');

                    // Create lampiran record
                    LampiranPengajuan::create([
                        'pengajuan_surat_id' => $pengajuan->id,
                        'persyaratan_surat_id' => $persyaratanId,
                        'nama_file' => $file->getClientOriginalName(),
                        'path_file' => $path,
                        'tipe_file' => $persyaratan?->tipe_file ?? 'dokumen',
                        'ukuran_file' => $file->getSize(),
                    ]);
                }
            }
        }

        return to_route('warga.dashboard')->with('success', 'Pengajuan surat berhasil dikirim. Silakan tunggu proses verifikasi.');
    }

    private function rules(): array
    {
        return [
            'jenis_surat_id' => ['required', 'exists:jenis_surat,id'],
            'keperluan' => ['required', 'string', 'max:500'],
            'keterangan' => ['nullable', 'string'],
            'lampiran' => ['nullable', 'array'],
            'lampiran.*' => ['nullable', 'file', 'max:5120'], // Max 5MB per file
        ];
    }

    public function destroy(Request $request, string $id): RedirectResponse
    {
        $user = $request->user();

        $pengajuan = PengajuanSurat::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        // Only allow deletion if status is 'menunggu' or 'ditolak'
        if (!in_array($pengajuan->status, ['menunggu', 'ditolak'])) {
            return back()->with('error', 'Pengajuan tidak dapat dihapus karena sedang diproses atau sudah selesai.');
        }

        // Delete lampiran files from storage
        foreach ($pengajuan->lampiran as $lampiran) {
            if (Storage::disk('public')->exists($lampiran->path_file)) {
                Storage::disk('public')->delete($lampiran->path_file);
            }
        }

        // Delete pengajuan (lampiran records will be cascade deleted via database)
        $pengajuan->delete();

        return back()->with('success', 'Pengajuan berhasil dihapus.');
    }
}
