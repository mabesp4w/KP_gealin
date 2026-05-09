<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengajuan_surat', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jenis_surat_id')->constrained('jenis_surat')->restrictOnDelete();
            $table->foreignId('penduduk_id')->constrained('penduduk')->restrictOnDelete();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete(); // warga yg mengajukan
            $table->string('keperluan');
            $table->text('keterangan')->nullable();
            $table->json('data_tambahan')->nullable();
            $table->string('status', 20)->default('menunggu'); // menunggu, diproses, selesai, ditolak
            $table->text('catatan_staf')->nullable();
            $table->timestamp('tanggal_diproses')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengajuan_surat');
    }
};
