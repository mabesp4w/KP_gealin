<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class LampiranPengajuan extends Model
{
    use HasFactory;

    protected $table = 'lampiran_pengajuan';

    protected $fillable = [
        'pengajuan_surat_id',
        'persyaratan_surat_id',
        'nama_file',
        'path_file',
        'tipe_file',
        'ukuran_file',
    ];

    protected function casts(): array
    {
        return [
            'ukuran_file' => 'integer',
        ];
    }

    // ── Relationships ──────────────────────────────────────

    public function pengajuanSurat(): BelongsTo
    {
        return $this->belongsTo(PengajuanSurat::class, 'pengajuan_surat_id');
    }

    public function persyaratanSurat(): BelongsTo
    {
        return $this->belongsTo(PersyaratanSurat::class, 'persyaratan_surat_id');
    }
}
