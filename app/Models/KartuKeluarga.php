<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class KartuKeluarga extends Model
{
    use HasFactory;

    protected $table = 'kartu_keluarga';

    protected $fillable = [
        'nomor_kk',
        'alamat',
        'rt',
        'rw',
        'kelurahan',
        'kecamatan',
        'kabupaten_kota',
        'provinsi',
        'kode_pos',
        'tanggal_dikeluarkan',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_dikeluarkan' => 'date',
        ];
    }

    // ── Relationships ──────────────────────────────────────

    /**
     * Anggota keluarga dalam KK ini.
     */
    public function anggota(): HasMany
    {
        return $this->hasMany(Penduduk::class, 'kartu_keluarga_id');
    }

    /**
     * Kepala keluarga.
     */
    public function kepalaKeluarga()
    {
        return $this->anggota()->where('status_hubungan_keluarga', 'Kepala Keluarga')->first();
    }
}
