<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class PengajuanSurat extends Model
{
    use HasFactory;

    protected $table = 'pengajuan_surat';

    protected $fillable = [
        'jenis_surat_id',
        'penduduk_id',
        'user_id',
        'keperluan',
        'keterangan',
        'data_tambahan',
        'status',
        'catatan_staf',
        'tanggal_diproses',
    ];

    protected function casts(): array
    {
        return [
            'data_tambahan' => 'array',
            'tanggal_diproses' => 'datetime',
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function surat(): HasMany
    {
        return $this->hasMany(Surat::class, 'pengajuan_surat_id');
    }

    public function lampiran(): HasMany
    {
        return $this->hasMany(LampiranPengajuan::class, 'pengajuan_surat_id');
    }

    // ── Scopes ─────────────────────────────────────────────

    public function scopeMenunggu($query)
    {
        return $query->where('status', 'menunggu');
    }

    public function scopeDiproses($query)
    {
        return $query->where('status', 'diproses');
    }
}
