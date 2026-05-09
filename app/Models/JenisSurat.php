<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class JenisSurat extends Model
{
    use HasFactory;

    protected $table = 'jenis_surat';

    protected $fillable = [
        'kode',
        'nama',
        'deskripsi',
        'template_fields',
        'is_active',
        'bisa_diajukan_warga',
        'urutan',
    ];

    protected function casts(): array
    {
        return [
            'template_fields' => 'array',
            'is_active' => 'boolean',
            'bisa_diajukan_warga' => 'boolean',
        ];
    }

    // ── Relationships ──────────────────────────────────────

    public function surat(): HasMany
    {
        return $this->hasMany(Surat::class, 'jenis_surat_id');
    }

    public function pengajuanSurat(): HasMany
    {
        return $this->hasMany(PengajuanSurat::class, 'jenis_surat_id');
    }

    public function persyaratan(): HasMany
    {
        return $this->hasMany(PersyaratanSurat::class, 'jenis_surat_id')->orderBy('urutan');
    }

    // ── Scopes ─────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeDapatDiajukan($query)
    {
        return $query->where('bisa_diajukan_warga', true)->where('is_active', true);
    }
}
