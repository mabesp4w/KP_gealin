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
        Schema::create('jenis_surat', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 20)->unique();       // e.g. SK-DOM, SKTM, SK-PINDAH
            $table->string('nama');                      // e.g. Surat Keterangan Domisili
            $table->text('deskripsi')->nullable();
            $table->json('template_fields')->nullable(); // JSON: field-field tambahan per jenis surat
            $table->boolean('is_active')->default(true);
            $table->boolean('bisa_diajukan_warga')->default(true); // Warga bisa ajukan sendiri?
            $table->integer('urutan')->default(0);       // untuk sorting tampilan
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jenis_surat');
    }
};
