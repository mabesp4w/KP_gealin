<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Models\KartuKeluarga;
use App\Models\Kelurahan;
use PDF;

class KartuKeluargaCetakController extends Controller
{
    public function cetak(KartuKeluarga $kartuKeluarga)
    {
        $kartuKeluarga->load(['anggota']);

        $kepalaKeluarga = $kartuKeluarga->anggota
            ->where('status_hubungan_keluarga', 'Kepala Keluarga')
            ->first()
            ?->nama_lengkap ?? '-';

        $kelurahan = Kelurahan::first() ?? new Kelurahan();
        $logoPath = $kelurahan->logo && file_exists(public_path('storage/' . $kelurahan->logo))
            ? public_path('storage/' . $kelurahan->logo)
            : public_path('logo.png');

        $pdf = PDF::loadView('pdf.kartu-keluarga', [
            'kk' => $kartuKeluarga,
            'kepalaKeluarga' => $kepalaKeluarga,
            'kelurahan' => $kelurahan,
            'logoPath' => $logoPath,
        ]);

        $filename = "kartu-keluarga-{$kartuKeluarga->nomor_kk}.pdf";

        return $pdf->stream($filename);
    }

    public function preview(KartuKeluarga $kartuKeluarga)
    {
        $kartuKeluarga->load(['anggota']);

        $kepalaKeluarga = $kartuKeluarga->anggota
            ->where('status_hubungan_keluarga', 'Kepala Keluarga')
            ->first()
            ?->nama_lengkap ?? '-';

        $kelurahan = Kelurahan::first() ?? new Kelurahan();
        $logoPath = $kelurahan->logo && file_exists(public_path('storage/' . $kelurahan->logo))
            ? public_path('storage/' . $kelurahan->logo)
            : public_path('logo.png');

        return view('pdf.kartu-keluarga', [
            'kk' => $kartuKeluarga,
            'kepalaKeluarga' => $kepalaKeluarga,
            'kelurahan' => $kelurahan,
            'logoPath' => $logoPath,
        ]);
    }
}
