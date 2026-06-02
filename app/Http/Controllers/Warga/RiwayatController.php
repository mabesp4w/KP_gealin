<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use App\Models\PengajuanSurat;
use Illuminate\Http\Request;
use Inertia\Response;

class RiwayatController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $pengajuan = PengajuanSurat::with(['jenisSurat', 'lampiran.persyaratanSurat', 'surat'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $pengajuan->getCollection()->transform(function ($item) {
            $surat = $item->surat->first();
            return [
                'id' => $item->id,
                'jenis_surat' => $item->jenisSurat?->nama ?? '-',
                'keperluan' => $item->keperluan,
                'keterangan' => $item->keterangan,
                'status' => $item->status,
                'catatan_staf' => $item->catatan_staf,
                'created_at' => $item->created_at?->toIso8601String(),
                'tanggal_diproses' => $item->tanggal_diproses?->toIso8601String(),
                'lampiran' => $item->lampiran->map(function ($lamp) {
                    return [
                        'id' => $lamp->id,
                        'nama_file' => $lamp->nama_file,
                        'path_file' => $lamp->path_file,
                        'tipe_file' => $lamp->tipe_file,
                        'persyaratan_nama' => $lamp->persyaratanSurat?->nama ?? 'Dokumen',
                    ];
                })->toArray(),
                'surat' => $surat ? [
                    'id' => $surat->id,
                    'nomor_surat' => $surat->nomor_surat,
                    'tanggal_surat' => $surat->tanggal_surat?->toIso8601String(),
                ] : null,
            ];
        });

        return inertia('warga/riwayat/index', [
            'pengajuan' => $pengajuan,
        ]);
    }
}
