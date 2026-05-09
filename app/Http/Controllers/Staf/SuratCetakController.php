<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Models\Surat;
use Illuminate\Http\Request;
use PDF;

class SuratCetakController extends Controller
{
    public function cetak(Surat $surat)
    {
        $surat->load(['penduduk', 'jenisSurat', 'pengajuan']);

        // Generate nomor surat jika belum ada
        if (!$surat->nomor_surat) {
            $surat->nomor_surat = $this->generateNomorSurat($surat);
            $surat->save();
        }

        $pdf = PDF::loadView('pdf.surat', compact('surat'));

        $filename = "surat-{$surat->jenisSurat->kode}-{$surat->penduduk->nama_lengkap}.pdf";

        return $pdf->stream($filename);
    }

    public function preview(Surat $surat)
    {
        $surat->load(['penduduk', 'jenisSurat', 'pengajuan']);

        return view('pdf.surat', compact('surat'));
    }

    private function generateNomorSurat(Surat $surat): string
    {
        // Format: 001/SK-DOM/KA/V/2026
        $jenisKode = $surat->jenisSurat->kode;
        $bulanRomawi = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        $bulan = $bulanRomawi[$surat->tanggal_surat->month] ?? $bulanRomawi[now()->month];
        $tahun = $surat->tanggal_surat->year ?? now()->year;

        // Get urutan surat bulan ini untuk jenis yang sama
        $count = Surat::where('jenis_surat_id', $surat->jenis_surat_id)
            ->whereMonth('tanggal_surat', $surat->tanggal_surat->month ?? now()->month)
            ->whereYear('tanggal_surat', $tahun)
            ->whereNotNull('nomor_surat')
            ->count() + 1;

        $urutan = str_pad($count, 3, '0', STR_PAD_LEFT);

        return "{$urutan}/{$jenisKode}/KA/{$bulan}/{$tahun}";
    }
}
