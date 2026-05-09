<?php

use App\Http\Controllers\Staf\DashboardController as StafDashboardController;
use App\Http\Controllers\Staf\JenisSuratController;
use App\Http\Controllers\Staf\KartuKeluargaController;
use App\Http\Controllers\Staf\LaporanController;
use App\Http\Controllers\Staf\MutasiPendudukController;
use App\Http\Controllers\Staf\PengajuanSuratController as StafPengajuanSuratController;
use App\Http\Controllers\Staf\PendudukController;
use App\Http\Controllers\Staf\PersyaratanSuratController;
use App\Http\Controllers\Staf\SuratController;
use App\Http\Controllers\Staf\SuratCetakController;
use App\Http\Controllers\Warga\DashboardController as WargaDashboardController;
use App\Http\Controllers\Warga\PengajuanSuratController as WargaPengajuanSuratController;
use App\Http\Controllers\Warga\RiwayatController;
use App\Http\Controllers\Warga\SuratCetakController as WargaSuratCetakController;
use App\Http\Middleware\RedirectByRole;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect(RedirectByRole::homeFor(auth()->user()->role));
    }

    return Inertia::render('auth/login', [
        'status' => session('status'),
    ]);
})->name('home');

// ── Staf Routes ────────────────────────────────────────────
Route::prefix('staf')->middleware(['auth', 'verified', 'role:staf'])->group(function () {
    Route::get('/', StafDashboardController::class)->name('staf.dashboard');

    Route::resource('penduduk', PendudukController::class)
        ->except(['create', 'show', 'edit'])
        ->names('staf.penduduk');

    // Reset password penduduk
    Route::post('penduduk/reset-password', [PendudukController::class, 'resetPassword'])
        ->name('staf.penduduk.reset-password');

    Route::resource('kartu-keluarga', KartuKeluargaController::class)
        ->except(['create', 'show', 'edit'])
        ->names('staf.kartu-keluarga');

    Route::resource('mutasi', MutasiPendudukController::class)
        ->except(['create', 'show', 'edit'])
        ->names('staf.mutasi');

    Route::resource('jenis-surat', JenisSuratController::class)
        ->except(['create', 'show', 'edit'])
        ->names('staf.jenis-surat');

    // Persyaratan Surat management (embedded in Jenis Surat page)
    Route::prefix('persyaratan-surat')->group(function () {
        Route::get('/', [PersyaratanSuratController::class, 'index'])->name('staf.persyaratan-surat.index');
        Route::post('/', [PersyaratanSuratController::class, 'store'])->name('staf.persyaratan-surat.store');
        Route::put('{persyaratan}', [PersyaratanSuratController::class, 'update'])->name('staf.persyaratan-surat.update');
        Route::delete('{persyaratan}', [PersyaratanSuratController::class, 'destroy'])->name('staf.persyaratan-surat.destroy');
    });

    // Surat routes with custom actions
    Route::post('surat/{surat}/terbitkan', [SuratController::class, 'terbitkan'])
        ->name('staf.surat.terbitkan');
    Route::post('surat/{surat}/batalkan', [SuratController::class, 'batalkan'])
        ->name('staf.surat.batalkan');

    Route::resource('surat', SuratController::class)
        ->except(['create', 'show', 'edit'])
        ->names('staf.surat');

    // Cetak surat
    Route::get('surat/{surat}/cetak', [SuratCetakController::class, 'cetak'])
        ->name('staf.surat.cetak');
    Route::get('surat/{surat}/preview', [SuratCetakController::class, 'preview'])
        ->name('staf.surat.preview');

    // Custom route for status update (must be before resource)
    Route::patch('pengajuan/{pengajuan}/status', [StafPengajuanSuratController::class, 'updateStatus'])
        ->name('staf.pengajuan.update-status');

    Route::resource('pengajuan', StafPengajuanSuratController::class)
        ->except(['create', 'show', 'edit'])
        ->names('staf.pengajuan');

    // Laporan
    Route::get('laporan', LaporanController::class)->name('staf.laporan');
});

// ── Warga Routes ────────────────────────────────────────────
Route::prefix('warga')->middleware(['auth', 'verified', 'role:warga'])->group(function () {
    Route::get('/', WargaDashboardController::class)->name('warga.dashboard');

    // Pengajuan Surat (warga submit pengajuan)
    Route::prefix('pengajuan')->group(function () {
        Route::get('/', [WargaPengajuanSuratController::class, 'create'])->name('warga.pengajuan.create');
        Route::post('/', [WargaPengajuanSuratController::class, 'store'])->name('warga.pengajuan.store');
    });

    // Riwayat Pengajuan
    Route::get('/riwayat', RiwayatController::class)->name('warga.riwayat');

    // Cetak Surat (hanya jika status selesai)
    Route::get('/surat/{pengajuanId}/cetak', [WargaSuratCetakController::class, 'cetak'])->name('warga.surat.cetak');
    Route::get('/surat/{pengajuanId}/preview', [WargaSuratCetakController::class, 'preview'])->name('warga.surat.preview');

    // Hapus Pengajuan (hanya jika status menunggu atau ditolak)
    Route::delete('/pengajuan/{id}', [WargaPengajuanSuratController::class, 'destroy'])->name('warga.pengajuan.destroy');
});

require __DIR__.'/settings.php';
