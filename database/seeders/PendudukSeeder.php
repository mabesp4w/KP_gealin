<?php

namespace Database\Seeders;

use App\Models\KartuKeluarga;
use App\Models\Penduduk;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PendudukSeeder extends Seeder
{
    /**
     * Data demografi Kelurahan Ardipura, Jayapura Selatan:
     * - Penduduk: 18.857 jiwa
     * - Luas: 16,66 km²
     * - Agama (Kota Jayapura): Protestan 49,62%, Islam 43,69%, Katolik 6,26%, Buddha 0,27%, Hindu 0,16%
     * - Marga Papua umum: Kogoya, Wenda, Tabuni, Wonda, Murib, Gebze, Mahuze, Ndiken, Samkakai, Kaize
     */
    public function run(): void
    {
        // Nonaktifkan logging untuk performa
        DB::disableQueryLog();

        $agamaList = ['Kristen', 'Islam', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];
        $agamaWeights = [44, 50, 6, 0.1, 0.1, 0]; // Sesuai proporsi Kota Jayapura

        $pendidikanList = ['SD', 'SLTP', 'SLTA', 'D3', 'S1', 'S2', 'S3', 'Tidak Sekolah'];
        $pekerjaanList = [
            'Petani', 'Nelayan', 'Pedagang', 'PNS', 'TNI/Polri', 'Wiraswasta',
            'Buruh', 'Pensiunan', 'Pelajar/Mahasiswa', 'Ibu Rumah Tangga',
            'Tenaga Kesehatan', 'Guru', 'Ustadz/Pendeta', 'Lainnya'
        ];

        $statusKawin = ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'];
        $statusHubungan = [
            'Kepala Keluarga', 'Istri', 'Anak', 'Orang Tua', 'Menantu',
            'Cucu', 'Famili Lain', 'Pembantu'
        ];

        $margaPapua = [
            'Kogoya', 'Wenda', 'Tabuni', 'Wonda', 'Murib', 'Gebze', 'Mahuze',
            'Ndiken', 'Samkakai', 'Kaize', 'Balagaise', 'Youw', 'Aitrem',
            'Telenggen', 'Gire', 'Kogoya', 'Wakum', 'Degei', 'Auwe', 'Bones'
        ];

        $namaLaki = [
            'Yohanes', 'Lukas', 'Matius', 'Markus', 'Yusuf', 'Ignasius',
            'Septian', 'Ricky', 'Yulius', 'Ferdinand', 'Natan', 'Elia',
            'Andi', 'Budi', 'Joko', 'Agus', 'Ahmad', 'Rudi', 'Dedi',
            'Roni', 'Feri', 'Henky', 'Lorenzo', 'Yakobus', 'Melkisedek'
        ];

        $namaPerempuan = [
            'Maria', 'Siska', 'Yuliana', 'Kristina', 'Rina', 'Dewi',
            'Sari', 'Putri', 'Wulan', 'Maya', 'Fitriani', 'Handayani',
            'Lestari', 'Kusuma', 'Wijaya', 'Sartika', 'Melani', 'Gracia',
            'Patricia', 'Angelina', 'Fransiska', 'Yosefina', 'Magdalena'
        ];

        $jalanArdipura = [
            'Jl. Boswezen', 'Jl. Gajah Mada', 'Jl. Percetakan Negara', 'Jl. Mandala',
            'Jl. Soa Siu Dok II', 'Jl. Sam Ratulangi', 'Jl. Ahmad Yani', 'Jl. Diponegoro',
            'Jl. Sudirman', 'Jl. Gatot Subroto', 'Jl. Kelapa', 'Jl. Cendrawasih',
            'Jl. Musamus', 'Jl. Kayu Batu', 'Jl. Padang Bulan', 'Jl. Entrop',
            'Jl. Hamadi', 'Jl. Holtekamp', 'Jl. Skyline', 'Jl. Trikora'
        ];

        // Generate 40 Kartu Keluarga
        $kartuKeluarga = [];
        $kkCounter = 1;

        for ($i = 0; $i < 40; $i++) {
            $rt = str_pad(rand(1, 15), 3, '0', STR_PAD_LEFT);
            $rw = str_pad(rand(1, 10), 3, '0', STR_PAD_LEFT);

            $kk = KartuKeluarga::create([
                'nomor_kk' => $this->generateNIK($kkCounter++),
                'alamat' => $jalanArdipura[array_rand($jalanArdipura)] . ' No. ' . rand(1, 200),
                'rt' => $rt,
                'rw' => $rw,
                'kelurahan' => 'Ardipura',
                'kecamatan' => 'Jayapura Selatan',
                'kabupaten_kota' => 'Kota Jayapura',
                'provinsi' => 'Papua',
                'kode_pos' => rand(10, 99) . '1' . rand(10, 99),
                'tanggal_dikeluarkan' => '20' . rand(18, 24) . '-' . str_pad(rand(1, 12), 2, '0', STR_PAD_LEFT) . '-' . str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT),
            ]);
            $kartuKeluarga[] = $kk;
        }

        // Generate Penduduk untuk setiap KK
        $pendudukCounter = 1;

        foreach ($kartuKeluarga as $index => $kk) {
            $jumlahAnggota = rand(2, 6); // Rata-rata 3-5 orang per KK
            $agamaKK = $this->getRandomWeighted($agamaList, $agamaWeights);

            for ($j = 0; $j < $jumlahAnggota; $j++) {
                $isKepalaKeluarga = ($j === 0);
                $jenisKelamin = $isKepalaKeluarga ? 'L' : (rand(0, 1) === 0 ? 'L' : 'P');

                $nama = $jenisKelamin === 'L'
                    ? $namaLaki[array_rand($namaLaki)]
                    : $namaPerempuan[array_rand($namaPerempuan)];

                // Tambahkan marga Papua secara acak (~30% penduduk asli Papua)
                if (rand(1, 100) <= 30) {
                    $nama .= ' ' . $margaPapua[array_rand($margaPapua)];
                } else {
                    // Nama marga Indonesia umum
                    $margaIndo = ['Wijaya', 'Kusuma', 'Saputra', 'Putra', 'Pratama', 'Siregar', 'Simanjuntak', 'Lumbangaol'];
                    if (rand(1, 100) <= 50) {
                        $nama .= ' ' . $margaIndo[array_rand($margaIndo)];
                    }
                }

                $tahunLahir = $isKepalaKeluarga ? rand(1960, 1985) : rand(1990, 2010);
                $tanggalLahir = sprintf('%04d-%02d-%02d', $tahunLahir, rand(1, 12), rand(1, 28));

                $penduduk = Penduduk::create([
                    'nik' => $this->generateNIK($pendudukCounter++),
                    'kartu_keluarga_id' => $kk->id,
                    'nama_lengkap' => $nama,
                    'tempat_lahir' => 'Jayapura',
                    'tanggal_lahir' => $tanggalLahir,
                    'jenis_kelamin' => $jenisKelamin,
                    'agama' => $agamaKK,
                    'status_perkawinan' => $isKepalaKeluarga ? 'Kawin' : $statusKawin[array_rand($statusKawin)],
                    'pendidikan_terakhir' => $pendidikanList[array_rand($pendidikanList)],
                    'pekerjaan' => $isKepalaKeluarga
                        ? $pekerjaanList[array_rand($pekerjaanList)]
                        : ($tahunLahir > 2010 ? 'Pelajar/Mahasiswa' : $pekerjaanList[array_rand($pekerjaanList)]),
                    'kewarganegaraan' => 'WNI',
                    'golongan_darah' => ['', 'A', 'B', 'AB', 'O', null][rand(0, 5)],
                    'status_hubungan_keluarga' => $isKepalaKeluarga
                        ? 'Kepala Keluarga'
                        : ($jenisKelamin === 'P' && $j === 1 ? 'Istri' : 'Anak'),
                    'nama_ayah' => null,
                    'nama_ibu' => null,
                    'alamat' => $kk->alamat,
                    'rt' => $kk->rt,
                    'rw' => $kk->rw,
                    'status_penduduk' => 'Tetap',
                    'telepon' => '08' . rand(11, 23) . rand(10000000, 99999999),
                    'foto' => null,
                    'tanggal_masuk' => '20' . rand(18, 24) . '-01-01',
                    'catatan' => null,
                    'user_id' => null,
                ]);

                // Create user account for some warga (20%)
                if (!$isKepalaKeluarga && rand(1, 100) <= 20 && $tahunLahir < 2005) {
                    $emailBase = strtolower(str_replace([' ', '\''], ['.', ''], $nama));
                    $email = $emailBase . '.' . $pendudukCounter . '@gmail.com';
                    $user = User::create([
                        'name' => $nama,
                        'email' => $email,
                        'role' => 'warga',
                        'password' => bcrypt('password123'),
                        'email_verified_at' => now(),
                    ]);

                    // Link user to penduduk
                    $penduduk->update(['user_id' => $user->id]);
                }
            }
        }

        DB::enableQueryLog();
        $this->command->info('Data penduduk berhasil di-seed:');
        $this->command->info('- Kartu Keluarga: ' . KartuKeluarga::count());
        $this->command->info('- Penduduk: ' . Penduduk::count());
        $this->command->info('- User Warga: ' . User::where('role', 'warga')->count());
    }

    private function generateNIK($counter): string
    {
        // NIK format: 6 digit provinsi/kabupaten/kota + 6 digit kecamatan/kelurahan + 6 digit urut
        // Papua: 91-94, Kota Jayapura: 9171
        $prefix = '9171'; // Kota Jayapura
        $kecamatan = '01'; // Jayapura Selatan
        $kelurahan = str_pad($counter, 4, '0', STR_PAD_LEFT);
        $urut = str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

        return $prefix . $kecamatan . $kelurahan . $urut;
    }

    private function getRandomWeighted(array $items, array $weights): string
    {
        $total = array_sum($weights);
        $rand = mt_rand(1, $total * 100) / 100;

        foreach ($items as $i => $item) {
            $rand -= $weights[$i];
            if ($rand <= 0) {
                return $item;
            }
        }

        return $items[0];
    }
}
