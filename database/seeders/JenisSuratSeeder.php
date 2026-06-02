<?php

namespace Database\Seeders;

use App\Models\JenisSurat;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisSuratSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        JenisSurat::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $jenisSurat = [
            [
                'kode' => 'SK-MATI',
                'nama' => 'Surat Keterangan Kematian',
                'deskripsi' => 'Surat keterangan kematian sebagai pengantar pembuatan akta kematian.',
                'persyaratan' => "• Surat Pengantar RT/RW\n• Foto Copy KTP-E\n• Foto Copy Kartu Keluarga\n• Surat keterangan dari Rumah Sakit\n• Surat SK PNS",
                'bisa_diajukan_warga' => true,
                'urutan' => 1,
            ],
            [
                'kode' => 'SK-DOM',
                'nama' => 'Surat Keterangan Domisili',
                'deskripsi' => 'Surat keterangan yang menerangkan bahwa seseorang berdomisili di wilayah Kelurahan Ardipura.',
                'persyaratan' => "• Surat Pengantar RT/RW\n• Foto Copy KTP-E\n• Foto Copy Kartu Keluarga\n• Surat Ket Pindah / Masuk",
                'bisa_diajukan_warga' => true,
                'urutan' => 2,
            ],
            [
                'kode' => 'SK-PINDAH',
                'nama' => 'Surat Keterangan Pindah / Masuk',
                'deskripsi' => 'Surat keterangan pindah atau masuk domisili ke/dari Kelurahan Ardipura.',
                'persyaratan' => "• Surat Pengantar RT/RW\n• Foto Copy KTP-E\n• Foto Copy Kartu Keluarga\n• Surat pindah dari daerah asal",
                'bisa_diajukan_warga' => true,
                'urutan' => 3,
            ],
        ];

        foreach ($jenisSurat as $data) {
            JenisSurat::create($data);
        }
    }
}
