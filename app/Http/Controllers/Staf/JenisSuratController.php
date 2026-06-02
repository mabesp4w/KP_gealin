<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Models\JenisSurat;
use App\Models\Surat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JenisSuratController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

        return Inertia::render('staf/jenis-surat/index', [
            'jenisSurat' => JenisSurat::query()
                ->when($search !== '', function ($query) use ($search) {
                    $query->where('kode', 'like', "%{$search}%")
                        ->orWhere('nama', 'like', "%{$search}%");
                })
                ->with('persyaratan')
                ->orderBy('urutan')
                ->orderBy('kode')
                ->get(),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        // Set urutan otomatis jika tidak diisi
        if (empty($validated['urutan'])) {
            $maxUrutan = JenisSurat::max('urutan') ?? 0;
            $validated['urutan'] = $maxUrutan + 1;
        }

        JenisSurat::create($validated);

        return to_route('staf.jenis-surat.index')->with('success', 'Jenis surat berhasil dibuat.');
    }

    public function update(Request $request, JenisSurat $jenisSurat): RedirectResponse
    {
        $validated = $request->validate($this->rules($jenisSurat->id));

        $jenisSurat->update($validated);

        return to_route('staf.jenis-surat.index')->with('success', 'Jenis surat berhasil diperbarui.');
    }

    public function destroy(JenisSurat $jenisSurat): RedirectResponse
    {
        // Cek apakah ada surat yang menggunakan jenis ini
        $suratCount = Surat::where('jenis_surat_id', $jenisSurat->id)->count();
        $pengajuanCount = \App\Models\PengajuanSurat::where('jenis_surat_id', $jenisSurat->id)->count();

        if ($suratCount > 0 || $pengajuanCount > 0) {
            return to_route('staf.jenis-surat.index')
                ->with('error', "Jenis surat tidak dapat dihapus karena masih digunakan pada {$suratCount} surat dan {$pengajuanCount} pengajuan.");
        }

        $jenisSurat->delete();

        return to_route('staf.jenis-surat.index')->with('success', "Jenis surat {$jenisSurat->nama} berhasil dihapus.");
    }

    private function rules(?int $ignoreId = null): array
    {
        return [
            'kode' => ['required', 'string', 'max:20', 'unique:jenis_surat,kode,' . ($ignoreId ?? 'NULL')],
            'nama' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'template_fields' => ['nullable', 'array'],
            'template_fields.*' => ['nullable'],
            'is_active' => ['sometimes', 'boolean'],
            'bisa_diajukan_warga' => ['sometimes', 'boolean'],
            'urutan' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
