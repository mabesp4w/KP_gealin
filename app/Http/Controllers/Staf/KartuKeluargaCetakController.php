<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Models\KartuKeluarga;
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

        $logoPath = public_path('logo.png');

        $pdf = PDF::loadView('pdf.kartu-keluarga', [
            'kk' => $kartuKeluarga,
            'kepalaKeluarga' => $kepalaKeluarga,
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

        $logoPath = public_path('logo.png');

        return view('pdf.kartu-keluarga', [
            'kk' => $kartuKeluarga,
            'kepalaKeluarga' => $kepalaKeluarga,
            'logoPath' => $logoPath,
        ]);
    }
}
