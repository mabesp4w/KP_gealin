<?php

namespace Database\Seeders;

use App\Models\JenisSurat;
use Illuminate\Database\Seeder;

class JenisSuratSeeder extends Seeder
{
    public function run(): void
    {
        $jenisSurat = [
            [
                'kode' => 'SK-DOM',
                'nama' => 'Surat Keterangan Domisili',
                'deskripsi' => 'Surat keterangan yang menerangkan bahwa seseorang benar-benar berdomisili di wilayah Kelurahan Ardipura.',
                'persyaratan' => "1. Fotokopi KTP\n2. Fotokopi Kartu Keluarga\n3. Surat Pengantar RT/RW",
                'template_fields' => json_encode([
                    ['name' => 'keperluan', 'label' => 'Keperluan', 'type' => 'text', 'required' => true],
                ]),
                'bisa_diajukan_warga' => true,
                'urutan' => 1,
            ],
            [
                'kode' => 'SKTM',
                'nama' => 'Surat Keterangan Tidak Mampu',
                'deskripsi' => 'Surat keterangan yang menerangkan bahwa seseorang termasuk dalam kategori keluarga tidak mampu/kurang mampu.',
                'persyaratan' => "1. Fotokopi KTP\n2. Fotokopi Kartu Keluarga\n3. Surat Pengantar RT/RW\n4. Surat pernyataan tidak mampu",
                'template_fields' => json_encode([
                    ['name' => 'keperluan', 'label' => 'Keperluan', 'type' => 'text', 'required' => true],
                    ['name' => 'penghasilan_bulanan', 'label' => 'Penghasilan per Bulan (Rp)', 'type' => 'number', 'required' => false],
                ]),
                'bisa_diajukan_warga' => true,
                'urutan' => 2,
            ],
            [
                'kode' => 'SK-USAHA',
                'nama' => 'Surat Keterangan Usaha',
                'deskripsi' => 'Surat keterangan yang menerangkan bahwa seseorang memiliki usaha di wilayah Kelurahan Ardipura.',
                'persyaratan' => "1. Fotokopi KTP\n2. Fotokopi Kartu Keluarga\n3. Surat Pengantar RT/RW\n4. Foto lokasi usaha",
                'template_fields' => json_encode([
                    ['name' => 'nama_usaha', 'label' => 'Nama Usaha', 'type' => 'text', 'required' => true],
                    ['name' => 'jenis_usaha', 'label' => 'Jenis Usaha', 'type' => 'text', 'required' => true],
                    ['name' => 'alamat_usaha', 'label' => 'Alamat Usaha', 'type' => 'textarea', 'required' => true],
                    ['name' => 'tahun_berdiri', 'label' => 'Tahun Berdiri', 'type' => 'number', 'required' => false],
                ]),
                'bisa_diajukan_warga' => true,
                'urutan' => 3,
            ],
            [
                'kode' => 'SK-PINDAH',
                'nama' => 'Surat Keterangan Pindah',
                'deskripsi' => 'Surat keterangan pindah domisili dari Kelurahan Ardipura ke wilayah lain.',
                'persyaratan' => "1. Fotokopi KTP\n2. Fotokopi Kartu Keluarga\n3. Surat Pengantar RT/RW\n4. Alasan pindah",
                'template_fields' => json_encode([
                    ['name' => 'alamat_tujuan', 'label' => 'Alamat Tujuan', 'type' => 'textarea', 'required' => true],
                    ['name' => 'kelurahan_tujuan', 'label' => 'Kelurahan Tujuan', 'type' => 'text', 'required' => true],
                    ['name' => 'kecamatan_tujuan', 'label' => 'Kecamatan Tujuan', 'type' => 'text', 'required' => true],
                    ['name' => 'kabupaten_tujuan', 'label' => 'Kabupaten/Kota Tujuan', 'type' => 'text', 'required' => true],
                    ['name' => 'provinsi_tujuan', 'label' => 'Provinsi Tujuan', 'type' => 'text', 'required' => true],
                    ['name' => 'alasan_pindah', 'label' => 'Alasan Pindah', 'type' => 'text', 'required' => true],
                    ['name' => 'jumlah_pengikut', 'label' => 'Jumlah Anggota Keluarga yang Ikut Pindah', 'type' => 'number', 'required' => false],
                ]),
                'bisa_diajukan_warga' => true,
                'urutan' => 4,
            ],
            [
                'kode' => 'SK-LAHIR',
                'nama' => 'Surat Keterangan Kelahiran',
                'deskripsi' => 'Surat keterangan kelahiran sebagai pengantar pembuatan akta kelahiran.',
                'persyaratan' => "1. Fotokopi KTP kedua orang tua\n2. Fotokopi Kartu Keluarga\n3. Fotokopi Buku Nikah/Akta Nikah\n4. Surat keterangan lahir dari bidan/RS",
                'template_fields' => json_encode([
                    ['name' => 'nama_bayi', 'label' => 'Nama Bayi', 'type' => 'text', 'required' => true],
                    ['name' => 'tanggal_lahir_bayi', 'label' => 'Tanggal Lahir', 'type' => 'date', 'required' => true],
                    ['name' => 'tempat_lahir_bayi', 'label' => 'Tempat Lahir', 'type' => 'text', 'required' => true],
                    ['name' => 'jenis_kelamin_bayi', 'label' => 'Jenis Kelamin', 'type' => 'select', 'options' => ['Laki-laki', 'Perempuan'], 'required' => true],
                    ['name' => 'anak_ke', 'label' => 'Anak Ke', 'type' => 'number', 'required' => true],
                    ['name' => 'berat_badan', 'label' => 'Berat Badan (gram)', 'type' => 'number', 'required' => false],
                    ['name' => 'panjang_badan', 'label' => 'Panjang Badan (cm)', 'type' => 'number', 'required' => false],
                ]),
                'bisa_diajukan_warga' => true,
                'urutan' => 5,
            ],
            [
                'kode' => 'SK-MATI',
                'nama' => 'Surat Keterangan Kematian',
                'deskripsi' => 'Surat keterangan kematian sebagai pengantar pembuatan akta kematian.',
                'persyaratan' => "1. Fotokopi KTP almarhum/almarhumah\n2. Fotokopi Kartu Keluarga\n3. Surat keterangan kematian dari RS/dokter/RT\n4. Fotokopi KTP pelapor",
                'template_fields' => json_encode([
                    ['name' => 'tanggal_meninggal', 'label' => 'Tanggal Meninggal', 'type' => 'date', 'required' => true],
                    ['name' => 'tempat_meninggal', 'label' => 'Tempat Meninggal', 'type' => 'text', 'required' => true],
                    ['name' => 'sebab_meninggal', 'label' => 'Sebab Meninggal', 'type' => 'text', 'required' => true],
                    ['name' => 'hubungan_pelapor', 'label' => 'Hubungan Pelapor dengan Almarhum', 'type' => 'text', 'required' => true],
                ]),
                'bisa_diajukan_warga' => true,
                'urutan' => 6,
            ],
            [
                'kode' => 'SK-NIKAH',
                'nama' => 'Surat Pengantar Nikah (N1/N2/N4)',
                'deskripsi' => 'Surat pengantar nikah dari kelurahan untuk persyaratan pencatatan pernikahan di KUA atau Catatan Sipil.',
                'persyaratan' => "1. Fotokopi KTP calon pengantin\n2. Fotokopi Kartu Keluarga\n3. Fotokopi Akta Kelahiran\n4. Surat Pengantar RT/RW\n5. Pas foto 2x3 (4 lembar)",
                'template_fields' => json_encode([
                    ['name' => 'nama_calon_pasangan', 'label' => 'Nama Calon Pasangan', 'type' => 'text', 'required' => true],
                    ['name' => 'rencana_tanggal_nikah', 'label' => 'Rencana Tanggal Nikah', 'type' => 'date', 'required' => false],
                    ['name' => 'status_perkawinan_sebelumnya', 'label' => 'Status Perkawinan Sebelumnya', 'type' => 'select', 'options' => ['Belum Kawin', 'Cerai Hidup', 'Cerai Mati'], 'required' => true],
                ]),
                'bisa_diajukan_warga' => true,
                'urutan' => 7,
            ],
            [
                'kode' => 'SK-BELUM-NIKAH',
                'nama' => 'Surat Keterangan Belum Menikah',
                'deskripsi' => 'Surat keterangan bahwa seseorang belum pernah menikah / belum terikat perkawinan.',
                'persyaratan' => "1. Fotokopi KTP\n2. Fotokopi Kartu Keluarga\n3. Surat Pengantar RT/RW",
                'template_fields' => json_encode([
                    ['name' => 'keperluan', 'label' => 'Keperluan', 'type' => 'text', 'required' => true],
                ]),
                'bisa_diajukan_warga' => true,
                'urutan' => 8,
            ],
            [
                'kode' => 'SK-CATPOL',
                'nama' => 'Surat Pengantar SKCK',
                'deskripsi' => 'Surat pengantar dari kelurahan untuk pembuatan Surat Keterangan Catatan Kepolisian (SKCK) di Polres/Polsek.',
                'persyaratan' => "1. Fotokopi KTP\n2. Fotokopi Kartu Keluarga\n3. Surat Pengantar RT/RW\n4. Pas foto 4x6 (4 lembar, latar merah)",
                'template_fields' => json_encode([
                    ['name' => 'keperluan', 'label' => 'Keperluan SKCK', 'type' => 'text', 'required' => true],
                ]),
                'bisa_diajukan_warga' => true,
                'urutan' => 9,
            ],
            [
                'kode' => 'SK-WARIS',
                'nama' => 'Surat Keterangan Ahli Waris',
                'deskripsi' => 'Surat keterangan yang menerangkan ahli waris dari seseorang yang telah meninggal dunia.',
                'persyaratan' => "1. Fotokopi KTP semua ahli waris\n2. Fotokopi Kartu Keluarga\n3. Fotokopi Akta Kematian\n4. Surat Pengantar RT/RW\n5. 2 orang saksi",
                'template_fields' => json_encode([
                    ['name' => 'nama_pewaris', 'label' => 'Nama Pewaris (Almarhum)', 'type' => 'text', 'required' => true],
                    ['name' => 'tanggal_meninggal_pewaris', 'label' => 'Tanggal Meninggal', 'type' => 'date', 'required' => true],
                    ['name' => 'daftar_ahli_waris', 'label' => 'Daftar Ahli Waris (Nama dan Hubungan)', 'type' => 'textarea', 'required' => true],
                ]),
                'bisa_diajukan_warga' => true,
                'urutan' => 10,
            ],
            [
                'kode' => 'SK-TANAH',
                'nama' => 'Surat Keterangan Kepemilikan Tanah',
                'deskripsi' => 'Surat keterangan yang menerangkan kepemilikan tanah/lahan di wilayah Kelurahan Ardipura.',
                'persyaratan' => "1. Fotokopi KTP\n2. Fotokopi Kartu Keluarga\n3. Bukti kepemilikan tanah\n4. Surat Pengantar RT/RW\n5. 2 orang saksi",
                'template_fields' => json_encode([
                    ['name' => 'lokasi_tanah', 'label' => 'Lokasi Tanah', 'type' => 'textarea', 'required' => true],
                    ['name' => 'luas_tanah', 'label' => 'Luas Tanah (m²)', 'type' => 'number', 'required' => true],
                    ['name' => 'batas_utara', 'label' => 'Batas Utara', 'type' => 'text', 'required' => false],
                    ['name' => 'batas_selatan', 'label' => 'Batas Selatan', 'type' => 'text', 'required' => false],
                    ['name' => 'batas_timur', 'label' => 'Batas Timur', 'type' => 'text', 'required' => false],
                    ['name' => 'batas_barat', 'label' => 'Batas Barat', 'type' => 'text', 'required' => false],
                ]),
                'bisa_diajukan_warga' => true,
                'urutan' => 11,
            ],
            [
                'kode' => 'SK-IZIN-RAMAIAN',
                'nama' => 'Surat Izin Keramaian',
                'deskripsi' => 'Surat izin penyelenggaraan kegiatan/acara yang menimbulkan keramaian di wilayah Kelurahan Ardipura.',
                'persyaratan' => "1. Fotokopi KTP penanggung jawab\n2. Surat Pengantar RT/RW\n3. Proposal kegiatan\n4. Denah lokasi",
                'template_fields' => json_encode([
                    ['name' => 'nama_kegiatan', 'label' => 'Nama Kegiatan', 'type' => 'text', 'required' => true],
                    ['name' => 'tanggal_kegiatan', 'label' => 'Tanggal Kegiatan', 'type' => 'date', 'required' => true],
                    ['name' => 'waktu_kegiatan', 'label' => 'Waktu Pelaksanaan', 'type' => 'text', 'required' => true],
                    ['name' => 'tempat_kegiatan', 'label' => 'Tempat Kegiatan', 'type' => 'text', 'required' => true],
                    ['name' => 'jumlah_peserta', 'label' => 'Perkiraan Jumlah Peserta', 'type' => 'number', 'required' => false],
                ]),
                'bisa_diajukan_warga' => true,
                'urutan' => 12,
            ],
            [
                'kode' => 'SK-UMUM',
                'nama' => 'Surat Keterangan Umum',
                'deskripsi' => 'Surat keterangan untuk keperluan umum lainnya yang tidak termasuk dalam kategori surat di atas.',
                'persyaratan' => "1. Fotokopi KTP\n2. Fotokopi Kartu Keluarga\n3. Surat Pengantar RT/RW",
                'template_fields' => json_encode([
                    ['name' => 'keperluan', 'label' => 'Keperluan', 'type' => 'text', 'required' => true],
                    ['name' => 'isi_keterangan', 'label' => 'Isi Keterangan', 'type' => 'textarea', 'required' => true],
                ]),
                'bisa_diajukan_warga' => true,
                'urutan' => 13,
            ],
        ];

        foreach ($jenisSurat as $data) {
            JenisSurat::create($data);
        }
    }
}
