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

        $agamaList = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];
        $agamaWeights = [44, 50, 6, 0.1, 0.1, 0]; // Sesuai proporsi Kota Jayapura

        $pendidikanList = ['SD', 'SLTP', 'SLTA', 'D3', 'S1', 'S2', 'S3', 'Tidak Sekolah'];
        $pekerjaanList = [
            'Petani', 'Nelayan', 'Pedagang', 'PNS', 'TNI/Polri', 'Wiraswasta',
            'Buruh', 'Pensiunan', 'Pelajar/Mahasiswa', 'Ibu Rumah Tangga',
            'Tenaga Kesehatan', 'Guru', 'Ustadz/Pendeta', 'Lainnya'
        ];

        $statusPerkawinan = ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'];
        $statusHubungan = [
            'Kepala Keluarga', 'Istri', 'Anak', 'Orang Tua', 'Menantu',
            'Cucu', 'Famili Lain', 'Pembantu'
        ];

        $margaPapua = [
            'Kogoya', 'Wenda', 'Tabuni', 'Wonda', 'Murib', 'Gebze', 'Mahuze',
            'Ndiken', 'Samkakai', 'Kaize', 'Balagaise', 'Youw', 'Aitrem',
            'Telenggen', 'Gire', 'Wakum', 'Degei', 'Auwe', 'Bones'
        ];

        // Nama laki-laki dan perempuan yang lebih variatif
        $namaLaki = [
            'Yohanes', 'Lukas', 'Matius', 'Markus', 'Yusuf', 'Ignasius', 'Septian', 'Ricky',
            'Yulius', 'Ferdinand', 'Natan', 'Elia', 'Yakobus', 'Melkisedek', 'Lorenzo',
            'Simon', 'Petrus', 'Thomas', 'Filipus', 'Bartolomeus', 'Tadeus', 'Andreas',
            'Stephanus', 'Barnabas', 'Silas', 'Timotius', 'Titus', 'Filemon', 'Onesimus',
            'Kornelius', 'Kleopas', 'Yudas', 'Matius', 'Paulus', 'Silvanus', 'Festus'
        ];

        $namaPerempuan = [
            'Maria', 'Siska', 'Yuliana', 'Kristina', 'Rina', 'Dewi', 'Sari', 'Putri', 'Wulan',
            'Maya', 'Fitriani', 'Handayani', 'Lestari', 'Kusuma', 'Sartika', 'Melani', 'Gracia',
            'Patricia', 'Angelina', 'Fransiska', 'Yosefina', 'Magdalena', 'Agata', 'Monika',
            'Rosalina', 'Theresia', 'Sukma', 'Indah', 'Citra', 'Ayunda', 'Ningsih', 'Puspa'
        ];

        $jalanArdipura = [
            'Jl. Boswezen', 'Jl. Gajah Mada', 'Jl. Percetakan Negara', 'Jl. Mandala',
            'Jl. Soa Siu Dok II', 'Jl. Sam Ratulangi', 'Jl. Ahmad Yani', 'Jl. Diponegoro',
            'Jl. Sudirman', 'Jl. Gatot Subroto', 'Jl. Kelapa', 'Jl. Cendrawasih',
            'Jl. Musamus', 'Jl. Kayu Batu', 'Jl. Padang Bulan', 'Jl. Entrop',
            'Jl. Hamadi', 'Jl. Holtekamp', 'Jl. Skyline', 'Jl. Trikora'
        ];

        // Data lengkap untuk 20 KK (setiap KK unik)
        $kkData = [
            ['nomor_kk' => '91710100012501', 'alamat' => 'Jl. Boswezen No. 12', 'rt' => '001', 'rw' => '001', 'kepala' => 'Yohanes Kogoya', 'istri' => 'Maria Wenda', 'anak' => 3],
            ['nomor_kk' => '91710100012502', 'alamat' => 'Jl. Gajah Mada No. 45', 'rt' => '001', 'rw' => '002', 'kepala' => 'Lukas Tabuni', 'istri' => 'Siska Murib', 'anak' => 2],
            ['nomor_kk' => '91710100012503', 'alamat' => 'Jl. Percetakan Negara No. 8', 'rt' => '002', 'rw' => '001', 'kepala' => 'Matius Wonda', 'istri' => 'Yuliana Gebze', 'anak' => 4],
            ['nomor_kk' => '91710100012504', 'alamat' => 'Jl. Mandala No. 23', 'rt' => '002', 'rw' => '002', 'kepala' => 'Markus Mahuze', 'istri' => 'Kristina Ndiken', 'anak' => 2],
            ['nomor_kk' => '91710100012505', 'alamat' => 'Jl. Soa Siu Dok II No. 67', 'rt' => '003', 'rw' => '001', 'kepala' => 'Yusuf Samkakai', 'istri' => 'Rina Kaize', 'anak' => 3],
            ['nomor_kk' => '91710100012511', 'alamat' => 'Jl. Kelapa No. 90', 'rt' => '006', 'rw' => '001', 'kepala' => 'Natan Auwe', 'istri' => 'Fitriani Auwe', 'anak' => 1],
        ];

        $kartuKeluarga = [];
        $kkCounter = 1;

        foreach ($kkData as $kk) {
            $kk = KartuKeluarga::create([
                'nomor_kk' => $kk['nomor_kk'],
                'alamat' => $kk['alamat'],
                'rt' => $kk['rt'],
                'rw' => $kk['rw'],
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
            $kkInfo = $kkData[$index];
            $jumlahAnggota = $kkInfo['anak'] + 2; // Kepala keluarga + istri + anak
            $agamaKK = $this->getRandomWeighted($agamaList, $agamaWeights);

            for ($j = 0; $j < $jumlahAnggota; $j++) {
                $isKepalaKeluarga = ($j === 0);
                $isIstri = ($j === 1);
                $jenisKelamin = $isKepalaKeluarga ? 'L' : ($isIstri ? 'P' : (rand(0, 1) === 0 ? 'L' : 'P'));

                if ($isKepalaKeluarga) {
                    $nama = $kkInfo['kepala'];
                    $pekerjaan = $pekerjaanList[array_rand($pekerjaanList)];
                } elseif ($isIstri) {
                    $nama = $kkInfo['istri'];
                    $pekerjaan = rand(0, 1) === 0 ? 'Ibu Rumah Tangga' : (in_array('Guru', $pekerjaanList) ? 'Guru' : 'Pedagang');
                } else {
                    // Anak
                    $nama = $jenisKelamin === 'L'
                        ? $namaLaki[array_rand($namaLaki)]
                        : $namaPerempuan[array_rand($namaPerempuan)];
                    $pekerjaan = 'Pelajar/Mahasiswa';
                }

                $tahunLahir = $isKepalaKeluarga ? rand(1960, 1985) : ($isIstri ? rand(1965, 1990) : rand(2000, 2015));
                $tanggalLahir = sprintf('%04d-%02d-%02d', $tahunLahir, rand(1, 12), rand(1, 28));

                $statusHubungan = $isKepalaKeluarga
                    ? 'Kepala Keluarga'
                    : ($isIstri ? 'Istri' : 'Anak');

                $statusPerkawinanValue = $isKepalaKeluarga || $isIstri ? 'Kawin' : $statusPerkawinan[array_rand($statusPerkawinan)];

                $penduduk = Penduduk::create([
                    'nik' => $this->generateNIK($pendudukCounter++),
                    'kartu_keluarga_id' => $kk->id,
                    'nama_lengkap' => $nama,
                    'tempat_lahir' => 'Jayapura',
                    'tanggal_lahir' => $tanggalLahir,
                    'jenis_kelamin' => $jenisKelamin,
                    'agama' => $agamaKK,
                    'status_perkawinan' => $statusPerkawinanValue,
                    'pendidikan_terakhir' => $tahunLahir < 2005 ? $pendidikanList[array_rand($pendidikanList)] : 'SLTA',
                    'pekerjaan' => $pekerjaan,
                    'kewarganegaraan' => 'WNI',
                    'golongan_darah' => ['', 'A', 'B', 'AB', 'O', null][array_rand([0, 1, 2, 3, 4, 5])],
                    'status_hubungan_keluarga' => $statusHubungan,
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

                // Create user account untuk beberapa warga dewasa (20%)
                if (!$isKepalaKeluarga && !$isIstri && rand(1, 100) <= 20 && $tahunLahir < 2005) {
                    $email = strtolower(str_replace(' ', '.', $nama)) . '.' . $penduduk->id . '@gmail.com';
                    $user = User::create([
                        'name' => $nama,
                        'email' => $email,
                        'role' => 'warga',
                        'password' => bcrypt('password123'),
                        'email_verified_at' => now(),
                    ]);

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
