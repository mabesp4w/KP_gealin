<?php

namespace Database\Seeders;

use App\Models\Kelurahan;
use Illuminate\Database\Seeder;

class KelurahanSeeder extends Seeder
{
    public function run(): void
    {
        Kelurahan::create([
            'nama_kelurahan' => 'Kelurahan Ardipura',
            'alamat' => 'Jl. Dokter Soetomo No. 1',
            'kelurahan' => 'Ardipura',
            'kecamatan' => 'Jayapura Selatan',
            'kota' => 'Kota Jayapura',
            'provinsi' => 'Papua',
            'kode_pos' => '99224',
            'telepon' => '(0967) 123456',
            'email' => 'kelurahan.ardipura@example.com',
            'nama_lurah' => 'Philipus Wamea',
            'nip_lurah' => '198001012010011001',
            'jabatan_lurah' => 'Lurah Ardipura',
        ]);
    }
}
