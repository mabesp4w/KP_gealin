<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Mutasi penduduk — pindah masuk / pindah keluar
        Schema::create('mutasi_penduduk', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penduduk_id')->constrained('penduduk')->restrictOnDelete();
            $table->string('jenis_mutasi', 20); // masuk, keluar, meninggal, lahir
            $table->date('tanggal_mutasi');
            $table->string('asal_tujuan')->nullable(); // asal (masuk) / tujuan (keluar)
            $table->text('alasan')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mutasi_penduduk');
    }
};
