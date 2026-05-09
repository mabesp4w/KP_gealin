<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Models\JenisSurat;
use App\Models\KartuKeluarga;
use App\Models\MutasiPenduduk;
use App\Models\Penduduk;
use App\Models\PengajuanSurat;
use App\Models\Surat;
use Illuminate\Http\Request;
use Inertia\Response;

class LaporanController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $filterBulan = $request->input('bulan', now()->month);
        $filterTahun = $request->input('tahun', now()->year);

        // ── Laporan Penduduk ────────────────────────────────────────
        $totalPenduduk = Penduduk::count();
        $pendudukPerJenisKelamin = [
            'L' => Penduduk::where('jenis_kelamin', 'L')->count(),
            'P' => Penduduk::where('jenis_kelamin', 'P')->count(),
        ];
        $pendudukPerStatus = [
            'Tetap' => Penduduk::where('status_penduduk', 'Tetap')->count(),
            'Sementara' => Penduduk::where('status_penduduk', 'Sementara')->count(),
            'Pindah' => Penduduk::where('status_penduduk', 'Pindah')->count(),
            'Meninggal' => Penduduk::where('status_penduduk', 'Meninggal')->count(),
        ];

        // Distribusi usia (hitung dari tanggal_lahir)
        $pendudukDenganUsia = Penduduk::whereNotNull('tanggal_lahir')
            ->get()
            ->map(function ($p) {
                $usia = $p->tanggal_lahir->age;
                if ($usia < 5) return '0-5';
                if ($usia < 12) return '6-12';
                if ($usia < 18) return '13-18';
                if ($usia < 25) return '19-25';
                if ($usia < 40) return '26-40';
                if ($usia < 60) return '41-60';
                return '60+';
            })
            ->countBy();

        // Pendidikan terakhir
        $pendudukPerPendidikan = Penduduk::selectRaw('pendidikan_terakhir, COUNT(*) as count')
            ->groupBy('pendidikan_terakhir')
            ->pluck('count', 'pendidikan_terakhir')
            ->toArray();

        // Pekerjaan
        $pendudukPerPekerjaan = Penduduk::selectRaw('pekerjaan, COUNT(*) as count')
            ->groupBy('pekerjaan')
            ->orderByDesc('count')
            ->limit(10)
            ->pluck('count', 'pekerjaan')
            ->toArray();

        // ── Laporan Kartu Keluarga ───────────────────────────────────
        $totalKK = KartuKeluarga::count();
        $rataRataAnggotaPerKK = $totalKK > 0
            ? Penduduk::whereNotNull('kartu_keluarga_id')->count() / $totalKK
            : 0;

        // ── Laporan Surat ────────────────────────────────────────────
        $suratPerJenis = JenisSurat::withCount('surat')
            ->get()
            ->pluck('surat_count', 'nama')
            ->toArray();

        $suratPerBulan = Surat::selectRaw('MONTH(tanggal_surat) as bulan, COUNT(*) as count')
            ->whereYear('tanggal_surat', $filterTahun)
            ->groupBy('bulan')
            ->pluck('count', 'bulan')
            ->toArray();

        // Fill missing months with 0
        for ($i = 1; $i <= 12; $i++) {
            $suratPerBulan[$i] = $suratPerBulan[$i] ?? 0;
        }
        ksort($suratPerBulan);

        // ── Laporan Pengajuan ────────────────────────────────────────
        $pengajuanPerStatus = PengajuanSurat::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $pengajuanPerJenis = JenisSurat::withCount('pengajuanSurat')
            ->get()
            ->pluck('pengajuan_surat_count', 'nama')
            ->toArray();

        // Pengajuan per bulan (filtered)
        $pengajuanPerBulan = PengajuanSurat::selectRaw('MONTH(created_at) as bulan, COUNT(*) as count')
            ->whereYear('created_at', $filterTahun)
            ->groupBy('bulan')
            ->pluck('count', 'bulan')
            ->toArray();

        for ($i = 1; $i <= 12; $i++) {
            $pengajuanPerBulan[$i] = $pengajuanPerBulan[$i] ?? 0;
        }
        ksort($pengajuanPerBulan);

        // ── Laporan Mutasi ───────────────────────────────────────────
        $mutasiPerJenis = MutasiPenduduk::selectRaw('jenis_mutasi, COUNT(*) as count')
            ->groupBy('jenis_mutasi')
            ->pluck('count', 'jenis_mutasi')
            ->toArray();

        $mutasiPerBulan = MutasiPenduduk::selectRaw('MONTH(tanggal_mutasi) as bulan, jenis_mutasi, COUNT(*) as count')
            ->whereYear('tanggal_mutasi', $filterTahun)
            ->groupBy('bulan', 'jenis_mutasi')
            ->get()
            ->groupBy('bulan')
            ->map(fn ($group) => $group->pluck('count', 'jenis_mutasi')->toArray())
            ->toArray();

        return inertia('staf/laporan/index', [
            'laporan' => [
                'filters' => [
                    'bulan' => $filterBulan,
                    'tahun' => $filterTahun,
                    'tahunTersedia' => range(now()->year - 5, now()->year),
                ],

                // Laporan Penduduk
                'penduduk' => [
                    'total' => $totalPenduduk,
                    'perJenisKelamin' => $pendudukPerJenisKelamin,
                    'perStatus' => $pendudukPerStatus,
                    'distribusiUsia' => $pendudukDenganUsia,
                    'perPendidikan' => $pendudukPerPendidikan,
                    'perPekerjaan' => $pendudukPerPekerjaan,
                ],

                // Laporan KK
                'kartuKeluarga' => [
                    'total' => $totalKK,
                    'rataRataAnggota' => round($rataRataAnggotaPerKK, 1),
                ],

                // Laporan Surat
                'surat' => [
                    'perJenis' => $suratPerJenis,
                    'perBulan' => $suratPerBulan,
                    'totalTahunIni' => array_sum($suratPerBulan),
                ],

                // Laporan Pengajuan
                'pengajuan' => [
                    'perStatus' => $pengajuanPerStatus,
                    'perJenis' => $pengajuanPerJenis,
                    'perBulan' => $pengajuanPerBulan,
                    'totalTahunIni' => array_sum($pengajuanPerBulan),
                ],

                // Laporan Mutasi
                'mutasi' => [
                    'perJenis' => $mutasiPerJenis,
                    'perBulan' => $mutasiPerBulan,
                ],
            ],
        ]);
    }
}
