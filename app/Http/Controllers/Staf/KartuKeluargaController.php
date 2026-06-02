<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Models\KartuKeluarga;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KartuKeluargaController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

        return Inertia::render('staf/kartu-keluarga/index', [
            'kartuKeluarga' => KartuKeluarga::withCount('anggota')
                ->with(['anggota' => function ($q) {
                    $q->where('status_hubungan_keluarga', 'Kepala Keluarga')
                        ->select('id', 'kartu_keluarga_id', 'nama_lengkap', 'status_hubungan_keluarga');
                }])
                ->when($search !== '', function ($query) use ($search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('nomor_kk', 'like', "%{$search}%")
                            ->orWhere('alamat', 'like', "%{$search}%")
                            ->orWhereHas('anggota', function ($sub) use ($search) {
                                $sub->where('nama_lengkap', 'like', "%{$search}%");
                            });
                    });
                })
                ->orderBy('nomor_kk')
                ->paginate(10)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        KartuKeluarga::create($validated);

        return to_route('staf.kartu-keluarga.index')->with('success', 'Kartu Keluarga berhasil ditambahkan.');
    }

    public function update(Request $request, KartuKeluarga $kartuKeluarga): RedirectResponse
    {
        $validated = $request->validate($this->rules($kartuKeluarga->id));

        $kartuKeluarga->update($validated);

        return to_route('staf.kartu-keluarga.index')->with('success', 'Kartu Keluarga berhasil diperbarui.');
    }

    public function destroy(KartuKeluarga $kartuKeluarga): RedirectResponse
    {
        if ($kartuKeluarga->anggota()->count() > 0) {
            return to_route('staf.kartu-keluarga.index')
                ->with('error', "Tidak dapat menghapus KK {$kartuKeluarga->nomor_kk} karena masih memiliki anggota.");
        }

        $kartuKeluarga->delete();

        return to_route('staf.kartu-keluarga.index')->with('success', "Kartu Keluarga {$kartuKeluarga->nomor_kk} berhasil dihapus.");
    }

    private function rules(?int $ignoreId = null): array
    {
        return [
            'nomor_kk' => ['required', 'string', 'size:16', 'unique:kartu_keluarga,nomor_kk' . ($ignoreId ? ",{$ignoreId}" : '')],
            'alamat' => ['required', 'string'],
            'rt' => ['required', 'string', 'max:5'],
            'rw' => ['required', 'string', 'max:5'],
            'kelurahan' => ['sometimes', 'string', 'max:100'],
            'kecamatan' => ['sometimes', 'string', 'max:100'],
            'kabupaten_kota' => ['sometimes', 'string', 'max:100'],
            'provinsi' => ['sometimes', 'string', 'max:100'],
            'kode_pos' => ['nullable', 'string', 'max:10'],
            'tanggal_dikeluarkan' => ['nullable', 'date'],
        ];
    }
}
