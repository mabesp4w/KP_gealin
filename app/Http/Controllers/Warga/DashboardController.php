<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use App\Models\KartuKeluarga;
use App\Models\Penduduk;
use App\Models\PengajuanSurat;
use Illuminate\Http\Request;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        // Get penduduk data linked to user
        $penduduk = Penduduk::where('user_id', $user->id)->first();

        $kartuKeluarga = null;
        if ($penduduk?->kartu_keluarga_id) {
            $kartuKeluarga = KartuKeluarga::find($penduduk->kartu_keluarga_id);
        }

        // Get pengajuan stats
        $totalPengajuan = PengajuanSurat::where('user_id', $user->id)->count();
        $pengajuanDiproses = PengajuanSurat::where('user_id', $user->id)
            ->whereIn('status', ['menunggu', 'diproses'])
            ->count();
        $pengajuanSelesai = PengajuanSurat::where('user_id', $user->id)
            ->where('status', 'selesai')
            ->count();

        // Get latest pengajuan (5 terakhir)
        $pengajuanTerbaru = PengajuanSurat::with('jenisSurat')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'jenis_surat' => $item->jenisSurat?->nama ?? '-',
                    'keperluan' => $item->keperluan,
                    'status' => $item->status,
                    'created_at' => $item->created_at?->toIso8601String(),
                ];
            });

        return inertia('warga/index', [
            'penduduk' => $penduduk,
            'kartuKeluarga' => $kartuKeluarga,
            'totalPengajuan' => $totalPengajuan,
            'pengajuanDiproses' => $pengajuanDiproses,
            'pengajuanSelesai' => $pengajuanSelesai,
            'pengajuanTerbaru' => $pengajuanTerbaru,
        ]);
    }
}
