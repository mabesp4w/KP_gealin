<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Kelurahan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class KelurahanController extends Controller
{
    public function edit(): Response
    {
        $kelurahan = Kelurahan::first() ?? new Kelurahan();

        return Inertia::render('settings/kelurahan', [
            'kelurahan' => $kelurahan,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_kelurahan' => ['required', 'string', 'max:255'],
            'alamat' => ['nullable', 'string', 'max:500'],
            'kelurahan' => ['nullable', 'string', 'max:100'],
            'kecamatan' => ['nullable', 'string', 'max:100'],
            'kota' => ['nullable', 'string', 'max:100'],
            'provinsi' => ['nullable', 'string', 'max:100'],
            'kode_pos' => ['nullable', 'string', 'max:10'],
            'telepon' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'nama_lurah' => ['nullable', 'string', 'max:255'],
            'nip_lurah' => ['nullable', 'string', 'max:50'],
            'jabatan_lurah' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:2048'],
            'tanda_tangan' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:1024'],
        ]);

        $kelurahan = Kelurahan::first();
        if (!$kelurahan) {
            $kelurahan = new Kelurahan();
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            if ($kelurahan->logo) {
                Storage::disk('public')->delete($kelurahan->logo);
            }
            $validated['logo'] = $request->file('logo')->store('kelurahan', 'public');
        } else {
            unset($validated['logo']);
        }

        // Handle tanda tangan upload
        if ($request->hasFile('tanda_tangan')) {
            if ($kelurahan->tanda_tangan) {
                Storage::disk('public')->delete($kelurahan->tanda_tangan);
            }
            $validated['tanda_tangan'] = $request->file('tanda_tangan')->store('kelurahan', 'public');
        } else {
            unset($validated['tanda_tangan']);
        }

        $kelurahan->fill($validated);
        $kelurahan->save();

        return to_route('staf.settings.kelurahan')->with('success', 'Data kelurahan berhasil diperbarui.');
    }
}
