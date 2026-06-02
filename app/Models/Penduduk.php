<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Penduduk extends Model
{
    use HasFactory;

    protected $table = 'penduduk';

    protected $fillable = [
        'nik',
        'kartu_keluarga_id',
        'nama_lengkap',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'agama',
        'status_perkawinan',
        'pendidikan_terakhir',
        'pekerjaan',
        'kewarganegaraan',
        'golongan_darah',
        'status_hubungan_keluarga',
        'nama_ayah',
        'nama_ibu',
        'alamat',
        'rt',
        'rw',
        'status_penduduk',
        'telepon',
        'foto',
        'tanggal_masuk',
        'catatan',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
            'tanggal_masuk' => 'date',
        ];
    }

    // ── Relationships ──────────────────────────────────────

    public function kartuKeluarga(): BelongsTo
    {
        return $this->belongsTo(KartuKeluarga::class, 'kartu_keluarga_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function surat(): HasMany
    {
        return $this->hasMany(Surat::class, 'penduduk_id');
    }

    public function pengajuanSurat(): HasMany
    {
        return $this->hasMany(PengajuanSurat::class, 'penduduk_id');
    }

    public function mutasi(): HasMany
    {
        return $this->hasMany(MutasiPenduduk::class, 'penduduk_id');
    }

    // ── Accessors ──────────────────────────────────────────

    public function getUsiaAttribute(): int
    {
        return $this->tanggal_lahir->age;
    }

    public function getAlamatLengkapAttribute(): string
    {
        return "{$this->alamat}, RT {$this->rt}/RW {$this->rw}";
    }
}
