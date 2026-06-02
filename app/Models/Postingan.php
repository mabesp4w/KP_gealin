<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Postingan extends Model
{
    use HasFactory;

    protected $table = 'postingan';

    protected $fillable = [
        'user_id',
        'kategori',
        'judul',
        'slug',
        'ringkasan',
        'isi',
        'gambar',
        'video_url',
        'tanggal_kegiatan',
        'lokasi',
        'is_published',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'tanggal_kegiatan' => 'date',
            'published_at' => 'datetime',
        ];
    }

    // ── Boot ───────────────────────────────────────────────

    protected static function booted(): void
    {
        static::creating(function (Postingan $postingan) {
            if (empty($postingan->slug)) {
                $postingan->slug = static::generateUniqueSlug($postingan->judul);
            }

            if ($postingan->is_published && !$postingan->published_at) {
                $postingan->published_at = now();
            }
        });

        static::updating(function (Postingan $postingan) {
            if ($postingan->isDirty('is_published') && $postingan->is_published && !$postingan->published_at) {
                $postingan->published_at = now();
            }
        });
    }

    // ── Helpers ────────────────────────────────────────────

    public static function generateUniqueSlug(string $judul): string
    {
        $slug = Str::slug($judul);
        $original = $slug;
        $counter = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = $original . '-' . $counter++;
        }

        return $slug;
    }

    public static function kategoriList(): array
    {
        return [
            'berita' => 'Berita',
            'kegiatan' => 'Kegiatan',
            'pengumuman' => 'Pengumuman',
            'berita_video' => 'Berita Video',
            'artikel' => 'Artikel',
        ];
    }

    // ── Relationships ──────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // ── Scopes ─────────────────────────────────────────────

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeKategori($query, string $kategori)
    {
        return $query->where('kategori', $kategori);
    }
}
