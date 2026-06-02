<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('persyaratan_surat', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jenis_surat_id')->constrained('jenis_surat')->restrictOnDelete();
            $table->string('nama'); // Nama persyaratan (e.g., Fotokopi KTP, Surat Pengantar)
            $table->string('tipe_file', 50)->nullable(); // KTP, KK, Foto, Pengantar RT, dll (untuk kategori file di lampiran)
            $table->boolean('wajib')->default(true);
            $table->integer('urutan')->default(0);
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->index('jenis_surat_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('persyaratan_surat');
    }
};
