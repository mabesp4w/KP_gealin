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
        Schema::table('lampiran_pengajuan', function (Blueprint $table) {
            $table->foreignId('persyaratan_surat_id')->nullable()->after('pengajuan_surat_id')->constrained('persyaratan_surat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lampiran_pengajuan', function (Blueprint $table) {
            $table->dropForeign(['persyaratan_surat_id']);
            $table->dropColumn('persyaratan_surat_id');
        });
    }
};
