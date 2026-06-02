<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Surat extends Model
{
    use HasFactory;

    protected $table = 'surat';

    protected $fillable = [
        'nomor_surat',
        'jenis_surat_id',
        'penduduk_id',
        'perihal',
        'keterangan',
        'data_tambahan',
        'status',
        'tanggal_surat',
        'ditandatangani_oleh',
        'jabatan_penandatangan',
        'pengajuan_surat_id',
    ];

    protected function casts(): array
    {
        return [
            'data_tambahan' => 'array',
            'tanggal_surat' => 'date',
        ];
    }

    // ── Relationships ──────────────────────────────────────

    public function jenisSurat(): BelongsTo
    {
        return $this->belongsTo(JenisSurat::class, 'jenis_surat_id');
    }

    public function penduduk(): BelongsTo
    {
        return $this->belongsTo(Penduduk::class, 'penduduk_id');
    }

    public function pengajuan(): BelongsTo
    {
        return $this->belongsTo(PengajuanSurat::class, 'pengajuan_surat_id');
    }

    // ── Scopes ─────────────────────────────────────────────

    public function scopeDiterbitkan($query)
    {
        return $query->where('status', 'diterbitkan');
    }
}
