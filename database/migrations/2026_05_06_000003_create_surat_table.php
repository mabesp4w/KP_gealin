<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surat', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_surat')->unique();
            $table->foreignId('jenis_surat_id')->constrained('jenis_surat')->restrictOnDelete();
            $table->foreignId('pengajuan_surat_id')->nullable()->constrained('pengajuan_surat')->nullOnDelete();
            $table->foreignId('penduduk_id')->constrained('penduduk')->restrictOnDelete();
            $table->string('perihal');
            $table->text('keterangan')->nullable();
            $table->json('data_tambahan')->nullable();
            $table->string('status', 20)->default('draft'); // draft, diterbitkan, dibatalkan
            $table->date('tanggal_surat');
            $table->string('ditandatangani_oleh')->nullable();
            $table->string('jabatan_penandatangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat');
    }
};
