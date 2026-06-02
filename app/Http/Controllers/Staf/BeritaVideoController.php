<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Models\Postingan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BeritaVideoController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

        return Inertia::render('staf/berita_video/index', [
            'items' => Postingan::with('user:id,name')
                ->kategori('berita_video')
                ->when($search !== '', function ($query) use ($search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('judul', 'like', "%{$search}%")
                            ->orWhere('ringkasan', 'like', "%{$search}%");
                    });
                })
                ->orderBy('created_at', 'desc')
                ->paginate(10)
                ->withQueryString(),
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('staf/berita_video/form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $validated['user_id'] = $request->user()->id;
        $validated['kategori'] = 'berita_video';

        if ($request->boolean('is_published') && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        Postingan::create($validated);

        return to_route('staf.berita_video.index')->with('success', 'Berita video berhasil dibuat.');
    }

    public function edit(Postingan $postingan): Response
    {
        return Inertia::render('staf/berita_video/form', [
            'item' => $postingan,
        ]);
    }

    public function update(Request $request, Postingan $postingan): RedirectResponse
    {
        $validated = $request->validate($this->rules($postingan->id));

        if ($request->boolean('is_published') && !$postingan->is_published && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $postingan->update($validated);

        return to_route('staf.berita_video.index')->with('success', 'Berita video berhasil diperbarui.');
    }

    public function destroy(Postingan $postingan): RedirectResponse
    {
        $nama = $postingan->judul;
        $postingan->delete();

        return to_route('staf.berita_video.index')->with('success', "Berita video \"{$nama}\" berhasil dihapus.");
    }

    public function togglePublish(Postingan $postingan): RedirectResponse
    {
        $postingan->update([
            'is_published' => !$postingan->is_published,
            'published_at' => !$postingan->is_published ? now() : $postingan->published_at,
        ]);

        $status = $postingan->is_published ? 'dipublikasikan' : 'disembunyikan';

        return back()->with('success', "Berita video berhasil {$status}.");
    }

    private function rules(?int $ignoreId = null): array
    {
        return [
            'judul' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:postingan,slug,' . ($ignoreId ?? 'NULL')],
            'ringkasan' => ['nullable', 'string', 'max:500'],
            'isi' => ['required', 'string'],
            'video_url' => ['required', 'url', 'max:500'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }
}
