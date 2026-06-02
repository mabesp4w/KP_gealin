<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Models\KartuKeluarga;
use App\Models\MutasiPenduduk;
use App\Models\PengajuanSurat;
use App\Models\Penduduk;
use App\Models\Surat;
use Illuminate\Http\Request;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $stats = [
            // Statistik Utama
            'totalPenduduk' => Penduduk::count(),
            'totalKK' => KartuKeluarga::count(),
            'suratBulanIni' => Surat::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'pengajuanMenunggu' => PengajuanSurat::where('status', 'menunggu')->count(),

            // Statistik Penduduk per Jenis Kelamin
            'pendudukPerJenisKelamin' => [
                'L' => Penduduk::where('jenis_kelamin', 'L')->count(),
                'P' => Penduduk::where('jenis_kelamin', 'P')->count(),
            ],

            // Statistik Penduduk per Status
            'pendudukPerStatus' => [
                'Tetap' => Penduduk::where('status_penduduk', 'Tetap')->count(),
                'Sementara' => Penduduk::where('status_penduduk', 'Sementara')->count(),
                'Pindah' => Penduduk::where('status_penduduk', 'Pindah')->count(),
                'Meninggal' => Penduduk::where('status_penduduk', 'Meninggal')->count(),
            ],

            // Statistik Mutasi Bulan Ini
            'mutasiBulanIni' => [
                'masuk' => MutasiPenduduk::where('jenis_mutasi', 'masuk')
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
                'keluar' => MutasiPenduduk::where('jenis_mutasi', 'keluar')
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
                'lahir' => MutasiPenduduk::where('jenis_mutasi', 'lahir')
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
                'meninggal' => MutasiPenduduk::where('jenis_mutasi', 'meninggal')
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
            ],

            // Statistik Pengajuan per Status
            'pengajuanPerStatus' => [
                'menunggu' => PengajuanSurat::where('status', 'menunggu')->count(),
                'diproses' => PengajuanSurat::where('status', 'diproses')->count(),
                'selesai' => PengajuanSurat::where('status', 'selesai')->count(),
                'ditolak' => PengajuanSurat::where('status', 'ditolak')->count(),
            ],

            // Statistik Surat per Status
            'suratPerStatus' => [
                'draft' => Surat::where('status', 'draft')->count(),
                'diterbitkan' => Surat::where('status', 'diterbitkan')->count(),
                'dibatalkan' => Surat::where('status', 'dibatalkan')->count(),
            ],
        ];

        // Pengajuan terbaru (5 terakhir)
        $pengajuanTerbaru = PengajuanSurat::with(['penduduk', 'jenisSurat'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_penduduk' => $item->penduduk?->nama_lengkap ?? '-',
                    'jenis_surat' => $item->jenisSurat?->nama ?? '-',
                    'keperluan' => $item->keperluan,
                    'status' => $item->status,
                    'created_at' => $item->created_at?->format('d M Y H:i') ?? '-',
                ];
            });

        // Mutasi terbaru (5 terakhir)
        $mutasiTerbaru = MutasiPenduduk::with(['penduduk'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_penduduk' => $item->penduduk?->nama_lengkap ?? '-',
                    'jenis_mutasi' => $item->jenis_mutasi,
                    'tanggal_mutasi' => $item->tanggal_mutasi?->format('d M Y') ?? '-',
                    'alasan' => $item->alasan ?? '-',
                    'created_at' => $item->created_at?->format('d M Y H:i') ?? '-',
                ];
            });

        return inertia('staf/dashboard', [
            'stats' => $stats,
            'pengajuanTerbaru' => $pengajuanTerbaru,
            'mutasiTerbaru' => $mutasiTerbaru,
        ]);
    }
}
