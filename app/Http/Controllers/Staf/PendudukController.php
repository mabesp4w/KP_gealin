<?php

namespace App\Http\Controllers\Staf;

use App\Http\Controllers\Controller;
use App\Models\KartuKeluarga;
use App\Models\Penduduk;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class PendudukController extends Controller
{
    /**
     * Reset password user penduduk menjadi default: ardipura
     */
    public function resetPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'penduduk_id' => ['required', 'exists:penduduk,id'],
        ]);

        $penduduk = Penduduk::findOrFail($request->penduduk_id);

        if (!$penduduk->user_id) {
            return back()->with('error', 'Penduduk ini tidak memiliki akun login.');
        }

        $user = User::findOrFail($penduduk->user_id);
        $user->update([
            'password' => Hash::make('ardipura'),
        ]);

        return back()->with('success', "Password untuk {$penduduk->nama_lengkap} berhasil direset menjadi: ardipura");
    }

    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $status = trim((string) $request->input('status', ''));

        return Inertia::render('staf/penduduk/index', [
            'penduduk' => Penduduk::with('kartuKeluarga')
                ->with('user')
                ->when($search !== '', function ($query) use ($search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('nama_lengkap', 'like', "%{$search}%")
                            ->orWhere('nik', 'like', "%{$search}%")
                            ->orWhere('alamat', 'like', "%{$search}%");
                    });
                })
                ->when($status !== '', function ($query) use ($status) {
                    $query->where('status_penduduk', $status);
                })
                ->orderBy('nama_lengkap')
                ->paginate(10)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'kartuKeluarga' => KartuKeluarga::orderBy('nomor_kk')->get(['id', 'nomor_kk', 'alamat']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        // Extract user creation fields
        $createUser = $request->boolean('create_user', false);
        $userEmail = $request->input('user_email');
        $userPassword = $request->input('user_password');

        // Remove user fields from validated data
        unset($validated['create_user'], $validated['user_email'], $validated['user_password']);

        DB::beginTransaction();
        try {
            // Create penduduk
            $penduduk = Penduduk::create($validated);

            // Create user account if requested
            if ($createUser && $userEmail && $userPassword) {
                $user = User::create([
                    'name' => $validated['nama_lengkap'],
                    'email' => $userEmail,
                    'password' => Hash::make($userPassword),
                    'role' => 'warga',
                ]);

                // Link user to penduduk
                $penduduk->update(['user_id' => $user->id]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menyimpan data: ' . $e->getMessage());
        }

        return to_route('staf.penduduk.index')->with('success', 'Data penduduk berhasil ditambahkan.');
    }

    public function update(Request $request, Penduduk $penduduk): RedirectResponse
    {
        $validated = $request->validate($this->rules($penduduk->id));

        $penduduk->update($validated);

        return to_route('staf.penduduk.index')->with('success', 'Data penduduk berhasil diperbarui.');
    }

    public function destroy(Penduduk $penduduk): RedirectResponse
    {
        // Cek relasi yang mencegah hapus (selain akun login)
        $relations = [];

        if ($penduduk->mutasi()->count() > 0) {
            $relations[] = 'data mutasi';
        }
        if ($penduduk->surat()->count() > 0) {
            $relations[] = 'surat';
        }
        if ($penduduk->pengajuanSurat()->count() > 0) {
            $relations[] = 'pengajuan surat';
        }

        if (!empty($relations)) {
            $relationList = implode(', ', $relations);
            return back()->with('error', "Tidak dapat menghapus penduduk ini karena masih memiliki data terkait: {$relationList}. Hapus data tersebut terlebih dahulu.");
        }

        // Hapus akun login jika ada
        if ($penduduk->user_id !== null) {
            User::destroy($penduduk->user_id);
        }

        $penduduk->delete();

        return to_route('staf.penduduk.index')->with('success', "Data penduduk {$penduduk->nama_lengkap} berhasil dihapus.");
    }

    private function rules(?int $ignoreId = null): array
    {
        return [
            'nik' => ['required', 'string', 'size:16', 'unique:penduduk,nik' . ($ignoreId ? ",{$ignoreId}" : '')],
            'kartu_keluarga_id' => ['nullable', 'exists:kartu_keluarga,id'],
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'tempat_lahir' => ['required', 'string', 'max:100'],
            'tanggal_lahir' => ['required', 'date'],
            'jenis_kelamin' => ['required', 'in:L,P'],
            'agama' => ['required', 'string', 'max:30'],
            'status_perkawinan' => ['required', 'string', 'max:20'],
            'pendidikan_terakhir' => ['required', 'string', 'max:50'],
            'pekerjaan' => ['required', 'string', 'max:100'],
            'kewarganegaraan' => ['sometimes', 'string', 'in:WNI,WNA'],
            'golongan_darah' => ['nullable', 'string', 'in:A,B,AB,O'],
            'status_hubungan_keluarga' => ['required', 'string', 'max:30'],
            'nama_ayah' => ['nullable', 'string', 'max:100'],
            'nama_ibu' => ['nullable', 'string', 'max:100'],
            'alamat' => ['required', 'string'],
            'rt' => ['required', 'string', 'max:5'],
            'rw' => ['required', 'string', 'max:5'],
            'status_penduduk' => ['sometimes', 'string', 'in:Tetap,Sementara,Pindah,Meninggal'],
            'telepon' => ['nullable', 'string', 'max:20'],
            'tanggal_masuk' => ['nullable', 'date'],
            'catatan' => ['nullable', 'string'],
            // User creation fields (optional)
            'create_user' => ['sometimes', 'boolean'],
            'user_email' => ['nullable', 'email', 'max:255', 'unique:users,email'],
            'user_password' => ['nullable', 'string', 'min:6'],
        ];
    }
}
