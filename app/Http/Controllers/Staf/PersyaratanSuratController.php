<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Models\JenisSurat;
use App\Models\PersyaratanSurat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PersyaratanSuratController extends Controller
{
    public function index(Request $request): Response
    {
        $jenisSuratId = $request->input('jenis_surat_id');

        return Inertia::render('staf/persyaratan-surat/index', [
            'persyaratan' => PersyaratanSurat::with('jenisSurat')
                ->when($jenisSuratId, function ($query) use ($jenisSuratId) {
                    $query->where('jenis_surat_id', $jenisSuratId);
                })
                ->orderBy('jenis_surat_id')
                ->orderBy('urutan')
                ->orderBy('nama')
                ->get(),
            'jenisSurat' => JenisSurat::active()->orderBy('urutan')->get(['id', 'kode', 'nama']),
            'filters' => [
                'jenis_surat_id' => $jenisSuratId,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'jenis_surat_id' => ['required', 'exists:jenis_surat,id'],
            'nama' => ['required', 'string', 'max:100'],
            'tipe_file' => ['required', 'in:image,pdf,document'],
            'wajib' => ['boolean'],
            'urutan' => ['nullable', 'integer', 'min:0'],
            'keterangan' => ['nullable', 'string'],
        ]);

        // Auto-set urutan if not provided
        if (!isset($validated['urutan'])) {
            $maxUrutan = PersyaratanSurat::where('jenis_surat_id', $validated['jenis_surat_id'])
                ->max('urutan') ?? 0;
            $validated['urutan'] = $maxUrutan + 1;
        }

        PersyaratanSurat::create($validated);

        return back()->with('success', 'Persyaratan surat berhasil ditambahkan.');
    }

    public function update(Request $request, PersyaratanSurat $persyaratan): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'tipe_file' => ['required', 'in:image,pdf,document'],
            'wajib' => ['boolean'],
            'urutan' => ['nullable', 'integer', 'min:0'],
            'keterangan' => ['nullable', 'string'],
        ]);

        $persyaratan->update($validated);

        return back()->with('success', 'Persyaratan surat berhasil diperbarui.');
    }

    public function destroy(PersyaratanSurat $persyaratan): RedirectResponse
    {
        $persyaratan->delete();

        return back()->with('success', 'Persyaratan surat berhasil dihapus.');
    }
}
