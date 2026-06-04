<?php

namespace App\Http\Controllers\Publik;

use App\Http\Controllers\Controller;
use App\Models\JenisSurat;
use App\Models\Penduduk;
use App\Models\Postingan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Config;

class PostinganController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $search   = trim((string) $request->input('search', ''));
        $kategori = trim((string) $request->input('kategori', ''));

        return Inertia::render('publik/dashboard', [
            'appName' => Config::get('app.name'),
            'postingan' => Postingan::with('user:id,name')
                ->published()
                ->when($kategori !== '', fn($q) => $q->kategori($kategori))
                ->when($search !== '', function ($q) use ($search) {
                    $q->where(function ($inner) use ($search) {
                        $inner->where('judul', 'like', "%{$search}%")
                            ->orWhere('ringkasan', 'like', "%{$search}%");
                    });
                })
                ->orderBy('published_at', 'desc')
                ->paginate(9)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
                'kategori' => $kategori,
            ],
            'kategoriList' => Postingan::kategoriList(),
            'stats' => [
                'penduduk' => Penduduk::count(),
                'jenis_surat' => JenisSurat::active()->count(),
            ],
        ]);
    }

    public function index(): Response
    {
        $jenisSurat = JenisSurat::active()
            ->orderBy('urutan')
            ->get(['id', 'kode', 'nama', 'deskripsi', 'persyaratan', 'bisa_diajukan_warga', 'urutan']);

        $pendudukLaki = Penduduk::where('jenis_kelamin', 'L')->count();
        $pendudukPerempuan = Penduduk::where('jenis_kelamin', 'P')->count();

        return Inertia::render('publik/postingan/index', [
            'appName' => Config::get('app.name'),
            'jenisSurat' => $jenisSurat,
            'statsPenduduk' => [
                'laki' => $pendudukLaki,
                'perempuan' => $pendudukPerempuan,
                'total' => $pendudukLaki + $pendudukPerempuan,
            ],
        ]);
    }

    // Halaman Berita - menampilkan semua postingan
    public function berita(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

        return Inertia::render('publik/berita/index', [
            'appName' => Config::get('app.name'),
            'postingan' => Postingan::with('user:id,name')
                ->published()
                ->when($search !== '', function ($q) use ($search) {
                    $q->where(function ($inner) use ($search) {
                        $inner->where('judul', 'like', "%{$search}%")
                            ->orWhere('ringkasan', 'like', "%{$search}%");
                    });
                })
                ->orderBy('published_at', 'desc')
                ->paginate(12)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    // Halaman Pengumuman
    public function pengumuman(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

        return Inertia::render('publik/berita/index', [
            'appName' => Config::get('app.name'),
            'pageTitle' => 'Pengumuman',
            'pageIcon' => '📢',
            'postingan' => Postingan::with('user:id,name')
                ->published()
                ->kategori('pengumuman')
                ->when($search !== '', function ($q) use ($search) {
                    $q->where(function ($inner) use ($search) {
                        $inner->where('judul', 'like', "%{$search}%")
                            ->orWhere('ringkasan', 'like', "%{$search}%");
                    });
                })
                ->orderBy('published_at', 'desc')
                ->paginate(12)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    // Halaman Kegiatan
    public function kegiatan(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

        return Inertia::render('publik/berita/index', [
            'appName' => Config::get('app.name'),
            'pageTitle' => 'Kegiatan',
            'pageIcon' => '🎯',
            'postingan' => Postingan::with('user:id,name')
                ->published()
                ->kategori('kegiatan')
                ->when($search !== '', function ($q) use ($search) {
                    $q->where(function ($inner) use ($search) {
                        $inner->where('judul', 'like', "%{$search}%")
                            ->orWhere('ringkasan', 'like', "%{$search}%");
                    });
                })
                ->orderBy('published_at', 'desc')
                ->paginate(12)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $post = Postingan::with('user:id,name')
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Postingan::published()
            ->where('kategori', $post->kategori)
            ->where('id', '!=', $post->id)
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get(['id', 'judul', 'slug', 'ringkasan', 'gambar', 'published_at', 'kategori']);

        return Inertia::render('publik/postingan/show', [
            'appName' => Config::get('app.name'),
            'post' => $post,
            'related' => $related,
        ]);
    }

    // Halaman Artikel
    public function artikel(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

        return Inertia::render('publik/berita/index', [
            'appName' => Config::get('app.name'),
            'pageTitle' => 'Artikel',
            'pageIcon' => '📝',
            'postingan' => Postingan::with('user:id,name')
                ->published()
                ->kategori('artikel')
                ->when($search !== '', function ($q) use ($search) {
                    $q->where(function ($inner) use ($search) {
                        $inner->where('judul', 'like', "%{$search}%")
                            ->orWhere('ringkasan', 'like', "%{$search}%");
                    });
                })
                ->orderBy('published_at', 'desc')
                ->paginate(12)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    // Halaman Berita Video
    public function beritaVideo(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

        return Inertia::render('publik/berita/index', [
            'appName' => Config::get('app.name'),
            'pageTitle' => 'Berita Video',
            'pageIcon' => '🎬',
            'postingan' => Postingan::with('user:id,name')
                ->published()
                ->kategori('berita_video')
                ->when($search !== '', function ($q) use ($search) {
                    $q->where(function ($inner) use ($search) {
                        $inner->where('judul', 'like', "%{$search}%")
                            ->orWhere('ringkasan', 'like', "%{$search}%");
                    });
                })
                ->orderBy('published_at', 'desc')
                ->paginate(12)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    // Halaman Visi Misi
    public function visiMisi(): Response
    {
        return Inertia::render('publik/profil/visi-misi', [
            'appName' => Config::get('app.name'),
        ]);
    }

    // Halaman Struktur Organisasi
    public function strukturOrganisasi(): Response
    {
        return Inertia::render('publik/profil/struktur-organisasi', [
            'appName' => Config::get('app.name'),
        ]);
    }

    // Halaman Peta
    public function peta(): Response
    {
        return Inertia::render('publik/profil/peta', [
            'appName' => Config::get('app.name'),
        ]);
    }
}
