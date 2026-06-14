<?php

use App\Http\Controllers\Publik\PostinganController as PublikPostinganController;
use App\Http\Controllers\Staf\DashboardController as StafDashboardController;
use App\Http\Controllers\Staf\JenisSuratController;
use App\Http\Controllers\Staf\KartuKeluargaController;
use App\Http\Controllers\Staf\KartuKeluargaCetakController;
use App\Http\Controllers\Staf\LaporanController;
use App\Http\Controllers\Staf\MutasiPendudukController;
use App\Http\Controllers\Staf\PengajuanSuratController as StafPengajuanSuratController;
use App\Http\Controllers\Staf\PendudukController;
use App\Http\Controllers\Staf\PersyaratanSuratController;
use App\Http\Controllers\Staf\ArtikelController;
use App\Http\Controllers\Staf\BeritaController;
use App\Http\Controllers\Staf\BeritaVideoController;
use App\Http\Controllers\Staf\KegiatanController;
use App\Http\Controllers\Staf\PengumumanController;
use App\Http\Controllers\Staf\SuratController;
use App\Http\Controllers\Staf\SuratCetakController;
use App\Http\Controllers\Settings\KelurahanController;
use App\Http\Controllers\Warga\DashboardController as WargaDashboardController;
use App\Http\Controllers\Warga\PengajuanSuratController as WargaPengajuanSuratController;
use App\Http\Controllers\Warga\RiwayatController;
use App\Http\Controllers\Warga\SuratCetakController as WargaSuratCetakController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [PublikPostinganController::class, 'dashboard'])->name('home');

// ── Publik Routes (tanpa login) ─────────────────────────────
Route::get('/berita', [PublikPostinganController::class, 'berita'])->name('publik.berita');
Route::get('/artikel', [PublikPostinganController::class, 'artikel'])->name('publik.artikel');
Route::get('/pengumuman', [PublikPostinganController::class, 'pengumuman'])->name('publik.pengumuman');
Route::get('/kegiatan', [PublikPostinganController::class, 'kegiatan'])->name('publik.kegiatan');
Route::get('/berita-video', [PublikPostinganController::class, 'beritaVideo'])->name('publik.berita-video');

// ── Profil Pages ───────────────────────────────────────────
Route::prefix('profil')->name('publik.profil.')->group(function () {
    Route::get('/visi-misi', [PublikPostinganController::class, 'visiMisi'])->name('visi-misi');
    Route::get('/struktur-organisasi', [PublikPostinganController::class, 'strukturOrganisasi'])->name('struktur-organisasi');
    Route::get('/peta', [PublikPostinganController::class, 'peta'])->name('peta');
});

Route::prefix('informasi')->name('publik.')->group(function () {
    Route::get('/', [PublikPostinganController::class, 'index'])->name('postingan.index');
    Route::get('/{slug}', [PublikPostinganController::class, 'show'])->name('postingan.show');
});

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

    Route::get('kartu-keluarga/{kartuKeluarga}/cetak', [KartuKeluargaCetakController::class, 'cetak'])
        ->name('staf.kartu-keluarga.cetak');
    Route::get('kartu-keluarga/{kartuKeluarga}/preview', [KartuKeluargaCetakController::class, 'preview'])
        ->name('staf.kartu-keluarga.preview');

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

    // ── Berita ────────────────────────────────────────
    Route::prefix('berita')->name('staf.berita.')->group(function () {
        Route::get('/', [BeritaController::class, 'index'])->name('index');
        Route::get('create', [BeritaController::class, 'create'])->name('create');
        Route::post('/', [BeritaController::class, 'store'])->name('store');
        Route::get('{postingan}/edit', [BeritaController::class, 'edit'])->name('edit');
        Route::put('{postingan}', [BeritaController::class, 'update'])->name('update');
        Route::delete('{postingan}', [BeritaController::class, 'destroy'])->name('destroy');
        Route::post('{postingan}/toggle-publish', [BeritaController::class, 'togglePublish'])->name('toggle-publish');
    });

    // ── Kegiatan ──────────────────────────────────────
    Route::prefix('kegiatan')->name('staf.kegiatan.')->group(function () {
        Route::get('/', [KegiatanController::class, 'index'])->name('index');
        Route::get('create', [KegiatanController::class, 'create'])->name('create');
        Route::post('/', [KegiatanController::class, 'store'])->name('store');
        Route::get('{postingan}/edit', [KegiatanController::class, 'edit'])->name('edit');
        Route::put('{postingan}', [KegiatanController::class, 'update'])->name('update');
        Route::delete('{postingan}', [KegiatanController::class, 'destroy'])->name('destroy');
        Route::post('{postingan}/toggle-publish', [KegiatanController::class, 'togglePublish'])->name('toggle-publish');
    });

    // ── Pengumuman ────────────────────────────────────
    Route::prefix('pengumuman')->name('staf.pengumuman.')->group(function () {
        Route::get('/', [PengumumanController::class, 'index'])->name('index');
        Route::get('create', [PengumumanController::class, 'create'])->name('create');
        Route::post('/', [PengumumanController::class, 'store'])->name('store');
        Route::get('{postingan}/edit', [PengumumanController::class, 'edit'])->name('edit');
        Route::put('{postingan}', [PengumumanController::class, 'update'])->name('update');
        Route::delete('{postingan}', [PengumumanController::class, 'destroy'])->name('destroy');
        Route::post('{postingan}/toggle-publish', [PengumumanController::class, 'togglePublish'])->name('toggle-publish');
    });

    // ── Berita Video ──────────────────────────────────
    Route::prefix('berita-video')->name('staf.berita_video.')->group(function () {
        Route::get('/', [BeritaVideoController::class, 'index'])->name('index');
        Route::get('create', [BeritaVideoController::class, 'create'])->name('create');
        Route::post('/', [BeritaVideoController::class, 'store'])->name('store');
        Route::get('{postingan}/edit', [BeritaVideoController::class, 'edit'])->name('edit');
        Route::put('{postingan}', [BeritaVideoController::class, 'update'])->name('update');
        Route::delete('{postingan}', [BeritaVideoController::class, 'destroy'])->name('destroy');
        Route::post('{postingan}/toggle-publish', [BeritaVideoController::class, 'togglePublish'])->name('toggle-publish');
    });

    // ── Artikel ───────────────────────────────────────
    Route::prefix('artikel')->name('staf.artikel.')->group(function () {
        Route::get('/', [ArtikelController::class, 'index'])->name('index');
        Route::get('create', [ArtikelController::class, 'create'])->name('create');
        Route::post('/', [ArtikelController::class, 'store'])->name('store');
        Route::get('{postingan}/edit', [ArtikelController::class, 'edit'])->name('edit');
        Route::put('{postingan}', [ArtikelController::class, 'update'])->name('update');
        Route::delete('{postingan}', [ArtikelController::class, 'destroy'])->name('destroy');
        Route::post('{postingan}/toggle-publish', [ArtikelController::class, 'togglePublish'])->name('toggle-publish');
    });

    // ── Settings Kelurahan ─────────────────────────────────
    Route::prefix('settings')->name('staf.settings.')->group(function () {
        Route::get('/kelurahan', [KelurahanController::class, 'edit'])->name('kelurahan');
        Route::post('/kelurahan', [KelurahanController::class, 'update'])->name('kelurahan.update');
    });
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

require __DIR__ . '/settings.php';
