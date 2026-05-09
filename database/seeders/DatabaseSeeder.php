<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Staf kelurahan
        User::factory()->create([
            'name' => 'Admin Staf',
            'email' => 'staf@ardipura.go.id',
            'role' => 'staf',
            'password' => bcrypt(123456),
        ]);

        // Jenis Surat
        $this->call(JenisSuratSeeder::class);
    }
}
