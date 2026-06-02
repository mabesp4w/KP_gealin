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
        Schema::create('kartu_keluarga', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_kk', 16)->unique();        // 16 digit nomor KK
            $table->text('alamat');
            $table->string('rt', 5);
            $table->string('rw', 5);
            $table->string('kelurahan', 100)->default('Ardipura');
            $table->string('kecamatan', 100)->default('Jayapura Selatan');
            $table->string('kabupaten_kota', 100)->default('Kota Jayapura');
            $table->string('provinsi', 100)->default('Papua');
            $table->string('kode_pos', 10)->nullable();
            $table->date('tanggal_dikeluarkan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kartu_keluarga');
    }
};
