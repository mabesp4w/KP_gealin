<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Models\MutasiPenduduk;
use App\Models\Penduduk;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MutasiPendudukController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $jenis = trim((string) $request->input('jenis', ''));

        return Inertia::render('staf/mutasi/index', [
            'mutasi' => MutasiPenduduk::with('penduduk')
                ->when($search !== '', function ($query) use ($search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('asal_tujuan', 'like', "%{$search}%")
                            ->orWhere('alasan', 'like', "%{$search}%")
                            ->orWhereHas('penduduk', function ($subQ) use ($search) {
                                $subQ->where('nama_lengkap', 'like', "%{$search}%")
                                    ->orWhere('nik', 'like', "%{$search}%");
                            });
                    });
                })
                ->when($jenis !== '', function ($query) use ($jenis) {
                    $query->where('jenis_mutasi', $jenis);
                })
                ->orderBy('tanggal_mutasi', 'desc')
                ->orderBy('created_at', 'desc')
                ->paginate(10)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
                'jenis' => $jenis,
            ],
            'penduduk' => Penduduk::orderBy('nama_lengkap')
                ->get(['id', 'nik', 'nama_lengkap', 'status_penduduk']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        MutasiPenduduk::create($validated);

        return to_route('staf.mutasi.index')->with('success', 'Data mutasi berhasil ditambahkan.');
    }

    public function update(Request $request, MutasiPenduduk $mutasi): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $mutasi->update($validated);

        return to_route('staf.mutasi.index')->with('success', 'Data mutasi berhasil diperbarui.');
    }

    public function destroy(MutasiPenduduk $mutasi): RedirectResponse
    {
        $mutasi->delete();

        return to_route('staf.mutasi.index')->with('success', 'Data mutasi berhasil dihapus.');
    }

    private function rules(): array
    {
        return [
            'penduduk_id' => ['required', 'exists:penduduk,id'],
            'jenis_mutasi' => ['required', 'in:masuk,keluar,meninggal,lahir'],
            'tanggal_mutasi' => ['required', 'date'],
            'asal_tujuan' => ['nullable', 'string', 'max:255'],
            'alasan' => ['nullable', 'string'],
            'keterangan' => ['nullable', 'string'],
        ];
    }
}
