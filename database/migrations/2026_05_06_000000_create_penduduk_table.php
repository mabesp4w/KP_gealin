<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('penduduk', function (Blueprint $table) {
            $table->id();

            // --- Identitas Utama ---
            $table->string('nik', 16)->unique();              // 16 digit NIK
            $table->foreignId('kartu_keluarga_id')->nullable()
                ->constrained('kartu_keluarga')->nullOnDelete();
                 // --- Link ke User (akun login) ---
            $table->foreignId('user_id')->nullable()
                ->constrained('users')->nullOnDelete();
            $table->string('nama_lengkap');
            $table->string('tempat_lahir', 100);
            $table->date('tanggal_lahir');
            $table->string('jenis_kelamin', 1);               // L = Laki-laki, P = Perempuan

            // --- Data Pribadi ---
            $table->string('agama', 30);
            // Islam, Kristen Protestan, Katolik, Hindu, Buddha, Konghucu, Kepercayaan
            $table->string('status_perkawinan', 20);
            // Belum Kawin, Kawin, Cerai Hidup, Cerai Mati
            $table->string('pendidikan_terakhir', 50);
            // Tidak/Belum Sekolah, Belum Tamat SD, Tamat SD, SLTP, SLTA, D1/D2, D3, D4/S1, S2, S3
            $table->string('pekerjaan', 100);
            $table->string('kewarganegaraan', 5)->default('WNI'); // WNI, WNA
            $table->string('golongan_darah', 5)->nullable();      // A, B, AB, O, Tidak Tahu

            // --- Data Keluarga ---
            $table->string('status_hubungan_keluarga', 30);
            // Kepala Keluarga, Suami, Istri, Anak, Menantu, Cucu, Orang Tua, Mertua, Famili Lain, Lainnya
            $table->string('nama_ayah', 100)->nullable();
            $table->string('nama_ibu', 100)->nullable();

            // --- Alamat ---
            $table->text('alamat');
            $table->string('rt', 5);
            $table->string('rw', 5);

            // --- Status & Tambahan ---
            $table->string('status_penduduk', 20)->default('Tetap');
            // Tetap, Sementara, Pindah, Meninggal
            $table->string('telepon', 20)->nullable();
            $table->string('foto')->nullable();                // path foto
            $table->date('tanggal_masuk')->nullable();         // tanggal terdaftar di kelurahan
            $table->text('catatan')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penduduk');
    }
};
