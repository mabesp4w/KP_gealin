<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersyaratanSurat extends Model
{
    use HasFactory;

    protected $table = 'persyaratan_surat';

    protected $fillable = [
        'jenis_surat_id',
        'nama',
        'tipe_file',
        'wajib',
        'urutan',
        'keterangan',
    ];

    protected function casts(): array
    {
        return [
            'wajib' => 'boolean',
            'jenis_surat_id' => 'integer',
            'urutan' => 'integer',
        ];
    }

    // ── Relationships ──────────────────────────────────────

    public function jenisSurat()
    {
        return $this->belongsTo(JenisSurat::class, 'jenis_surat_id');
    }

    public function lampiran()
    {
        return $this->hasMany(LampiranPengajuan::class, 'persyaratan_surat_id');
    }

    // ── Scopes ─────────────────────────────────────────────

    public function scopeWajib($query)
    {
        return $query->where('wajib', true);
    }

    public function scopeOrderByUrutan($query)
    {
        return $query->orderBy('urutan');
    }
}
