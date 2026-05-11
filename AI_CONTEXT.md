# AI CONTEXT — Gealin Project

> **Tujuan file ini**: Memberikan konteks lengkap kepada AI assistant agar tidak perlu
> memeriksa keseluruhan program di setiap sesi baru. Baca file ini terlebih dahulu
> sebelum melakukan perubahan apapun.
>
> **Terakhir diperbarui**: 2026-05-11 (Session 8 - Sinkronisasi Dokumentasi)

---

## 1. RINGKASAN PROJECT

**Judul**: Aplikasi Kependudukan Berbasis Web di Kelurahan Ardipura
**Jurusan**: Sistem Informasi
**Jenis**: Kerja Praktek (KP) 2026

Gealin adalah aplikasi kependudukan berbasis web untuk **Kelurahan Ardipura** yang
dibangun sebagai project Kerja Praktek. Aplikasi ini mengelola data kependudukan
(penduduk, kartu keluarga, surat-surat administrasi, dll) untuk kebutuhan operasional
kelurahan. Fitur **CRUD Penduduk** sudah diimplementasikan dengan validasi Yup,
toast notifications, dan debounced auto-search.

---

## 2. TECH STACK

| Layer              | Technology                   | Version  |
| ------------------ | ---------------------------- | -------- |
| Backend Framework  | Laravel                      | 12.x     |
| Frontend Framework | React                        | 19.2     |
| SPA Bridge         | Inertia.js (@inertiajs/react)| 2.3      |
| Language           | TypeScript                   | 5.7      |
| CSS Framework      | TailwindCSS                  | 4.x      |
| UI Components      | daisyUI                      | 5.5      |
| Build Tool         | Vite                         | 7.x      |
| Auth               | Laravel Fortify              | 1.30     |
| Database           | MySQL (KP_gealing)           | 8.x     |
| Form Handling      | react-hook-form + yup        | 7.71/1.7 |
| Route Generation   | Laravel Wayfinder            | 0.1.9    |
| React Optimization | babel-plugin-react-compiler  | 1.0      |

### Key Frontend Libraries
- `react-hot-toast` — toast notifications
- `react-select` — searchable select input
- `react-datepicker` — date picker
- `react-image-file-resizer` — image compression before upload
- `yet-another-react-lightbox` — image lightbox viewer
- `aos` — animate on scroll
- `@hookform/resolvers` — yup resolver for react-hook-form

### CSS Setup (`resources/css/app.css`)
```css
@import 'tailwindcss';
@source '../views';
@source '../../vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php';
@plugin "daisyui" {
  themes: emerald --default, forest --prefersDark;
}
```

**Global form styles** di `app.css`:
- Border global untuk semua `input`, `select`, `textarea` (1px base-content/20)
- Focus state: primary border + ring glow
- Fix select `:active` border agar konsisten

### Tema
- **Light**: `emerald` (daisyUI)
- **Dark**: `forest` (otomatis via `prefers-color-scheme: dark`)

---

## 3. DIRECTORY STRUCTURE

```
gealin/
├── app/
│   ├── Actions/Fortify/
│   │   ├── CreateNewUser.php          # Validates & creates user (uses ProfileValidationRules + PasswordValidationRules)
│   │   └── ResetUserPassword.php      # Validates & resets password
│   ├── Concerns/
│   │   ├── PasswordValidationRules.php # Trait: passwordRules(), currentPasswordRules()
│   │   └── ProfileValidationRules.php  # Trait: profileRules(), nameRules(), emailRules()
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php          # Base controller (empty)
│   │   │   ├── Staf/                   # Staf controllers
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── PendudukController.php
│   │   │   │   ├── KartuKeluargaController.php
│   │   │   │   ├── MutasiPendudukController.php
│   │   │   │   ├── JenisSuratController.php
│   │   │   │   ├── PersyaratanSuratController.php
│   │   │   │   ├── SuratController.php
│   │   │   │   ├── SuratCetakController.php
│   │   │   │   ├── PengajuanSuratController.php
│   │   │   │   └── LaporanController.php
│   │   │   ├── Warga/                  # Warga controllers
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── PengajuanSuratController.php
│   │   │   │   ├── SuratCetakController.php
│   │   │   │   └── RiwayatController.php
│   │   │   └── Settings/
│   │   │       ├── ProfileController.php              # edit/update/destroy profile
│   │   │       ├── PasswordController.php             # edit/update password
│   │   │       └── TwoFactorAuthenticationController.php # show 2FA settings
│   │   ├── Middleware/
│   │   │   ├── EnsureUserHasRole.php                  # Role-based access middleware (staf/warga)
│   │   │   ├── HandleAppearance.php                   # Theme appearance middleware
│   │   │   ├── HandleInertiaRequests.php               # Shares flash messages, auth data to Inertia
│   │   │   └── RedirectByRole.php                     # Redirects user to role-specific home
│   │   └── Requests/
│   │       ├── Settings/
│   │       │   ├── ProfileUpdateRequest.php            # uses ProfileValidationRules
│   │       │   ├── ProfileDeleteRequest.php            # validates current password
│   │       │   ├── PasswordUpdateRequest.php           # validates current + new password
│   │       │   └── TwoFactorAuthenticationRequest.php  # authorization check
│   │       ├── StorePersyaratanSuratRequest.php        # Validate store persyaratan surat
│   │       └── UpdatePersyaratanSuratRequest.php       # Validate update persyaratan surat
│   ├── Models/
│   │   ├── User.php                   # HasFactory, Notifiable, TwoFactorAuthenticatable, isStaf(), isWarga()
│   │   ├── KartuKeluarga.php          # hasMany Penduduk
│   │   ├── Penduduk.php               # belongsTo KartuKeluarga/User, hasMany Surat/PengajuanSurat/MutasiPenduduk
│   │   ├── JenisSurat.php             # hasMany Surat, PengajuanSurat, PersyaratanSurat
│   │   ├── PersyaratanSurat.php       # belongsTo JenisSurat, hasMany LampiranPengajuan
│   │   ├── Surat.php                  # belongsTo JenisSurat/Penduduk/PengajuanSurat
│   │   ├── PengajuanSurat.php         # belongsTo JenisSurat/Penduduk/User, hasMany Surat/LampiranPengajuan
│   │   ├── MutasiPenduduk.php         # belongsTo Penduduk
│   │   └── LampiranPengajuan.php      # belongsTo PengajuanSurat, PersyaratanSurat
│   └── Providers/
│       ├── AppServiceProvider.php     # CarbonImmutable, DB::prohibitDestructiveCommands, Password defaults
│       └── FortifyServiceProvider.php # Auth actions, views (Inertia), rate limiting
├── database/
│   ├── database.sqlite
│   ├── factories/UserFactory.php      # withTwoFactor(), unverified() states
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php     # users, password_reset_tokens, sessions
│   │   ├── 0001_01_01_000001_create_cache_table.php     # cache, cache_locks
│   │   ├── 0001_01_01_000002_create_jobs_table.php      # jobs, job_batches, failed_jobs
│   │   ├── 2025_08_14_170933_add_two_factor_columns...  # two_factor_secret, recovery_codes, confirmed_at
│   │   ├── 2026_05_06_000000_create_kartu_keluarga_table.php
│   │   ├── 2026_05_06_000000_create_penduduk_table.php
│   │   ├── 2026_05_06_000001_add_role_and_penduduk_to_users_table.php
│   │   ├── 2026_05_06_000002_create_jenis_surat_table.php
│   │   ├── 2026_05_06_000002_create_pengajuan_surat_table.php
│   │   ├── 2026_05_06_000003_create_surat_table.php
│   │   ├── 2026_05_06_000004_create_mutasi_penduduk_table.php
│   │   ├── 2026_05_06_000005_create_lampiran_pengajuan_table.php
│   │   ├── 2026_05_08_094642_create_persyaratan_surat_table.php
│   │   └── 2026_05_09_213020_add_persyaratan_surat_id_to_lampiran_pengajuan_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php         # Creates staf account + calls JenisSuratSeeder & PendudukSeeder
│       ├── JenisSuratSeeder.php       # Seeds 13 jenis surat (SK-DOM, SKTM, SK-USAHA, etc.)
│       └── PendudukSeeder.php         # Seeds 6 KK + penduduk + beberapa user warga
├── resources/
│   ├── css/app.css                    # TailwindCSS + daisyUI + global form styles
│   ├── views/pdf/surat.blade.php      # PDF template untuk cetak surat
│   └── js/
│       ├── app.tsx                    # Inertia entry + <Toaster />
│       ├── ssr.tsx                    # SSR entry point
│       ├── components/ui/            # ★ 42 reusable UI components (see Section 6)
│       ├── hooks/
│       │   └── use-appearance.ts     # Theme hook (light/dark/system)
│       ├── pages/
│       │   ├── auth/login.tsx         # Login page (rendered at root /)
│       │   ├── settings/              # Settings pages (profile, password, appearance, 2FA)
│       │   ├── staf/
│       │   │   ├── dashboard.tsx      # Dashboard Staf dengan statistik
│       │   │   ├── laporan/           # Laporan kependudukan & surat
│       │   │   ├── penduduk/ (CRUD)
│       │   │   ├── kartu-keluarga/ (CRUD)
│       │   │   ├── mutasi/ (CRUD)
│       │   │   ├── surat/ (CRUD + cetak PDF)
│       │   │   ├── pengajuan/ (CRUD)
│       │   │   ├── jenis-surat/ (CRUD)
│       │   │   └── persyaratan-surat/ (CRUD)
│       │   └── warga/                 # Warga pages
│       │       ├── index.tsx          # Dashboard Warga
│       │       ├── pengajuan/         # Form pengajuan surat dengan upload lampiran
│       │       └── riwayat/           # Riwayat pengajuan (detail modal + hapus jika menunggu/ditolak)
│       ├── actions/                  # Auto-generated by Wayfinder
│       ├── routes/                   # Auto-generated by Wayfinder
│       ├── layouts/
│       │   ├── StafLayout.tsx        # Sidebar + Navbar + flash toast listener
│       │   └── WargaLayout.tsx       # Warga layout (simple)
│       ├── lib/
│       │   └── date.ts              # Date utilities: formatDate, parseDate, toDateString, formatRelativeTime (Indonesian locale)
│       └── types/                    # PageProps interface
├── routes/
│   ├── web.php                       # Staf routes (penduduk, kk, mutasi, surat, pengajuan, jenis-surat)
│   ├── settings.php                  # Profile, password, appearance, 2FA
│   └── console.php                   # (empty)
├── config/
│   ├── fortify.php                   # Features: registration, resetPasswords, emailVerification, 2FA
│   ├── inertia.php                   # SSR enabled, testing config
│   └── ... (standard Laravel configs)
└── vite.config.ts                    # laravel-vite-plugin, react (with compiler), tailwindcss, wayfinder
```

---

## 4. DATABASE SCHEMA

> Database: MySQL — `KP_gealing` (DB_CONNECTION=mysql)

### Tabel: `users`
| Column                      | Type      | Notes                         |
| --------------------------- | --------- | ----------------------------- |
| id                          | bigint PK | auto increment                |
| name                        | string    | required                      |
| **role**                    | string(20)| **'staf' \| 'warga'** (default: warga) |
| email                       | string    | unique                        |
| email_verified_at           | timestamp | nullable                      |
| password                    | string    | hashed (cast)                 |
| two_factor_secret           | text      | nullable, encrypted           |
| two_factor_recovery_codes   | text      | nullable, encrypted           |
| two_factor_confirmed_at     | timestamp | nullable (cast datetime)      |
| remember_token              | string    | nullable                      |
| created_at / updated_at     | timestamps|                               |

### Tabel: `kartu_keluarga`
| Column              | Type      | Notes                                   |
| ------------------- | --------- | --------------------------------------- |
| id                  | bigint PK |                                         |
| nomor_kk            | string(16)| unique, 16 digit                        |
| alamat              | text      |                                         |
| rt                  | string(5) |                                         |
| rw                  | string(5) |                                         |
| kelurahan           | string    | default: 'Ardipura'                     |
| kecamatan           | string    | default: 'Jayapura Selatan'             |
| kabupaten_kota      | string    | default: 'Kota Jayapura'               |
| provinsi            | string    | default: 'Papua'                        |
| kode_pos            | string(10)| nullable                                |
| tanggal_dikeluarkan | date      | nullable                                |
| created_at/updated_at| timestamps|                                        |

### Tabel: `penduduk`
| Column                       | Type      | Notes                                    |
| ---------------------------- | --------- | ---------------------------------------- |
| id                           | bigint PK |                                          |
| nik                          | string(16)| unique, 16 digit NIK                     |
| kartu_keluarga_id            | FK → kartu_keluarga | nullable                      |
| nama_lengkap                 | string    |                                          |
| tempat_lahir                 | string    |                                          |
| tanggal_lahir                | date      |                                          |
| jenis_kelamin                | string(1) | L / P                                    |
| agama                        | string(30)| Islam, Kristen, Katolik, Hindu, Buddha, Konghucu |
| status_perkawinan            | string(20)| Belum Kawin, Kawin, Cerai Hidup, Cerai Mati |
| pendidikan_terakhir          | string(50)| SD, SLTP, SLTA, D3, S1, S2, S3, dll     |
| pekerjaan                    | string    |                                          |
| kewarganegaraan              | string(5) | WNI / WNA (default: WNI)                |
| golongan_darah               | string(5) | A, B, AB, O, nullable                    |
| status_hubungan_keluarga     | string(30)| Kepala Keluarga, Istri, Anak, dll        |
| nama_ayah                    | string    | nullable                                 |
| nama_ibu                     | string    | nullable                                 |
| alamat                       | text      |                                          |
| rt                           | string(5) |                                          |
| rw                           | string(5) |                                          |
| status_penduduk              | string(20)| Tetap, Sementara, Pindah, Meninggal     |
| telepon                      | string(20)| nullable                                 |
| foto                         | string    | nullable, path                           |
| tanggal_masuk                | date      | nullable                                 |
| catatan                      | text      | nullable                                 |
| **user_id**                  | FK → users | nullable, link ke akun login            |
| created_at / updated_at      | timestamps|                                          |

### Tabel: `jenis_surat`
| Column              | Type     | Notes                                    |
| ------------------- | -------- | ---------------------------------------- |
| id                  | bigint PK|                                          |
| kode                | string(20)| unique (SK-DOM, SKTM, dll)              |
| nama                | string   | Nama lengkap jenis surat                 |
| deskripsi           | text     | nullable                                 |
| persyaratan         | text     | nullable, persyaratan dokumen            |
| template_fields     | JSON     | nullable, field tambahan per jenis surat |
| is_active           | boolean  | default: true                            |
| bisa_diajukan_warga | boolean  | default: true                            |
| urutan              | integer  | default: 0, untuk sorting                |
| created_at/updated_at| timestamps|                                        |

### Tabel: `pengajuan_surat`
| Column            | Type      | Notes                                     |
| ----------------- | --------- | ----------------------------------------- |
| id                | bigint PK |                                           |
| jenis_surat_id    | FK → jenis_surat |                                    |
| penduduk_id       | FK → penduduk |                                        |
| user_id           | FK → users | warga yang mengajukan                    |
| keperluan         | string    |                                           |
| keterangan        | text      | nullable                                  |
| data_tambahan     | JSON      | nullable, data dinamis sesuai jenis surat |
| status            | string(20)| menunggu, diproses, selesai, ditolak      |
| catatan_staf      | text      | nullable, feedback dari staf              |
| tanggal_diproses  | timestamp | nullable                                  |
| created_at/updated_at| timestamps|                                        |

### Tabel: `surat`
| Column                 | Type      | Notes                                  |
| ---------------------- | --------- | -------------------------------------- |
| id                     | bigint PK |                                        |
| nomor_surat            | string    | unique (e.g. 001/SK-DOM/KA/V/2026)    |
| jenis_surat_id         | FK → jenis_surat |                                 |
| penduduk_id            | FK → penduduk |                                    |
| perihal                | string    |                                        |
| keterangan             | text      | nullable                               |
| data_tambahan          | JSON      | nullable                               |
| status                 | string(20)| draft, diterbitkan, dibatalkan          |
| tanggal_surat          | date      |                                        |
| ditandatangani_oleh    | string    | nullable, nama pejabat                 |
| jabatan_penandatangan  | string    | nullable                               |
| pengajuan_surat_id     | FK → pengajuan_surat | nullable, jika dari pengajuan |
| created_at/updated_at  | timestamps|                                        |

### Tabel: `mutasi_penduduk`
| Column          | Type      | Notes                                      |
| --------------- | --------- | ------------------------------------------ |
| id              | bigint PK |                                            |
| penduduk_id     | FK → penduduk |                                          |
| jenis_mutasi    | string(20)| masuk, keluar, meninggal, lahir            |
| tanggal_mutasi  | date      |                                            |
| asal_tujuan     | string    | nullable, asal (masuk) / tujuan (keluar)   |
| alasan          | text      | nullable                                   |
| keterangan      | text      | nullable                                   |
| created_at/updated_at| timestamps|                                       |

### Tabel: `lampiran_pengajuan`
| Column               | Type      | Notes                                  |
| -------------------- | --------- | -------------------------------------- |
| id                   | bigint PK |                                        |
| pengajuan_surat_id   | FK → pengajuan_surat | cascade delete                |
| persyaratan_surat_id | FK → persyaratan_surat | nullable                 |
| nama_file            | string    |                                        |
| path_file            | string    |                                        |
| tipe_file            | string(50)| KTP, KK, Foto, Pengantar RT, dll      |
| ukuran_file          | integer   | nullable, bytes                        |
| created_at/updated_at| timestamps|                                       |

### Tabel: `persyaratan_surat`
| Column            | Type      | Notes                                    |
| ----------------- | --------- | ---------------------------------------- |
| id                | bigint PK |                                          |
| jenis_surat_id    | FK → jenis_surat |                                     |
| nama              | string    | Nama persyaratan                         |
| tipe_file         | string(50)| KTP, KK, Foto, Pengantar RT, dll        |
| wajib             | boolean   | default: true                            |
| urutan            | integer   | default: 0, untuk sorting                |
| keterangan        | text      | nullable                                 |
| created_at/updated_at| timestamps|                                        |

### Tabel Pendukung (standard Laravel)
- `password_reset_tokens` (email PK, token, created_at)
- `sessions` (id PK, user_id, ip_address, user_agent, payload, last_activity)
- `cache` / `cache_locks`
- `jobs` / `job_batches` / `failed_jobs`

### Models (`app/Models/`)
| Model              | Table                 | Key Relationships                                      |
| ------------------ | --------------------- | ------------------------------------------------------ |
| User               | users                 | hasOne Penduduk, hasMany PengajuanSurat                |
| KartuKeluarga      | kartu_keluarga        | hasMany Penduduk (anggota)                             |
| Penduduk           | penduduk              | belongsTo KartuKeluarga, belongsTo User, hasMany Surat/PengajuanSurat/MutasiPenduduk |
| JenisSurat         | jenis_surat           | hasMany Surat, PengajuanSurat, PersyaratanSurat        |
| PersyaratanSurat   | persyaratan_surat     | belongsTo JenisSurat, hasMany LampiranPengajuan        |
| PengajuanSurat     | pengajuan_surat       | belongsTo JenisSurat/Penduduk/User, hasMany Surat/LampiranPengajuan |
| Surat              | surat                 | belongsTo JenisSurat/Penduduk/PengajuanSurat           |
| MutasiPenduduk     | mutasi_penduduk       | belongsTo Penduduk                                     |
| LampiranPengajuan  | lampiran_pengajuan    | belongsTo PengajuanSurat, PersyaratanSurat             |

### Jenis Surat (13 tipe, seeded via JenisSuratSeeder)
| Kode           | Nama                              |
| -------------- | --------------------------------- |
| SK-DOM         | Surat Keterangan Domisili         |
| SKTM           | Surat Keterangan Tidak Mampu      |
| SK-USAHA       | Surat Keterangan Usaha            |
| SK-PINDAH      | Surat Keterangan Pindah           |
| SK-LAHIR       | Surat Keterangan Kelahiran        |
| SK-MATI        | Surat Keterangan Kematian         |
| SK-NIKAH       | Surat Pengantar Nikah (N1/N2/N4)  |
| SK-BELUM-NIKAH | Surat Keterangan Belum Menikah    |
| SK-CATPOL      | Surat Pengantar SKCK              |
| SK-WARIS       | Surat Keterangan Ahli Waris       |
| SK-TANAH       | Surat Keterangan Kepemilikan Tanah|
| SK-IZIN-RAMAIAN| Surat Izin Keramaian              |
| SK-UMUM        | Surat Keterangan Umum             |

### Seeder Accounts
```
Staf:  staf@ardipura.go.id  / 123456  (role: staf)
```

---

## 5. ROUTING

### Web Routes (`routes/web.php`)
```
GET  /                    → Inertia::render('auth/login')  [guest, root = login page]
GET  /staf                → Inertia::render('staf/dashboard') [auth, staf]
Resource /staf/penduduk   → PendudukController [auth, staf]
  GET    /staf/penduduk           → index (paginated, search, filter)
  POST   /staf/penduduk           → store
  PUT    /staf/penduduk/{id}      → update
  DELETE /staf/penduduk/{id}      → destroy
  POST   /staf/penduduk/reset-password → resetPassword (reset password penduduk/warga)
Resource /staf/kartu-keluarga → KartuKeluargaController [auth, staf]
  GET    /staf/kartu-keluarga           → index (paginated, search)
  POST   /staf/kartu-keluarga           → store
  PUT    /staf/kartu-keluarga/{id}      → update
  DELETE /staf/kartu-keluarga/{id}      → destroy
Resource /staf/mutasi → MutasiPendudukController [auth, staf]
  GET    /staf/mutasi           → index (paginated, search, filter)
  POST   /staf/mutasi           → store
  PUT    /staf/mutasi/{id}      → update
  DELETE /staf/mutasi/{id}      → destroy
Resource /staf/jenis-surat → JenisSuratController [auth, staf]
  GET    /staf/jenis-surat      → index (list, search, no pagination)
  POST   /staf/jenis-surat      → store
  PUT    /staf/jenis-surat/{id} → update
  DELETE /staf/jenis-surat/{id} → destroy
Resource /staf/persyaratan-surat → PersyaratanSuratController [auth, staf]
  GET    /staf/persyaratan-surat           → index (list by jenis_surat)
  POST   /staf/persyaratan-surat           → store
  PUT    /staf/persyaratan-surat/{id}      → update
  DELETE /staf/persyaratan-surat/{id}      → destroy
Resource /staf/surat → SuratController [auth, staf]
  GET    /staf/surat           → index (paginated, search, filter)
  POST   /staf/surat           → store
  PUT    /staf/surat/{id}      → update
  DELETE /staf/surat/{id}      → destroy
  POST   /staf/surat/{id}/terbitkan → terbitkan (draft → diterbitkan)
  POST   /staf/surat/{id}/batalkan → batalkan (set status → dibatalkan)
  GET    /staf/surat/{id}/cetak      → cetak PDF (SuratCetakController)
  GET    /staf/surat/{id}/preview    → preview PDF (SuratCetakController)
Resource /staf/pengajuan → PengajuanSuratController [auth, staf]
  GET    /staf/pengajuan        → index (paginated, search, filter)
  POST   /staf/pengajuan        → store
  PUT    /staf/pengajuan/{id}   → update
  DELETE /staf/pengajuan/{id}   → destroy
  PATCH  /staf/pengajuan/{id}/status → updateStatus
```

### Settings Routes (`routes/settings.php`)
```
GET    /settings              → redirect to /settings/profile
GET    /settings/profile      → ProfileController@edit           [auth]
PATCH  /settings/profile      → ProfileController@update         [auth]
DELETE /settings/profile      → ProfileController@destroy        [auth, verified]
GET    /settings/password     → PasswordController@edit          [auth, verified]
PUT    /settings/password     → PasswordController@update        [auth, verified, throttle:6,1]
GET    /settings/appearance   → Inertia::render('settings/appearance') [auth, verified]
GET    /settings/two-factor   → TwoFactorAuthenticationController@show [auth, verified]
```

### Warga Routes (`routes/web.php`)
```
GET  /warga                    → WargaDashboardController [auth, warga]
GET  /warga/pengajuan         → create form pengajuan [auth, warga]
POST /warga/pengajuan         → store pengajuan + upload lampiran [auth, warga]
GET  /warga/riwayat           → list riwayat pengajuan [auth, warga]
DELETE /warga/pengajuan/{id}  → destroy (hanya jika status: menunggu/ditolak) [auth, warga]
GET  /warga/surat/{pengajuanId}/cetak → cetak PDF (stream) [auth, warga]
GET  /warga/surat/{pengajuanId}/preview → preview HTML [auth, warga]
```

### Fortify Auth Views (defined in `FortifyServiceProvider`)
```
login              → Inertia::render('auth/login')              — props: canResetPassword, canRegister, status  ✅ ADA
register           → Inertia::render('auth/register')            ❌ BELUM ADA (view belum dibuat)
forgot-password    → Inertia::render('auth/forgot-password')    ❌ BELUM ADA (view belum dibuat)
reset-password     → Inertia::render('auth/reset-password')     ❌ BELUM ADA (view belum dibuat)
verify-email       → Inertia::render('auth/verify-email')       ❌ BELUM ADA (view belum dibuat)
two-factor-challenge → Inertia::render('auth/two-factor-challenge') ❌ BELUM ADA (view belum dibuat)
confirm-password   → Inertia::render('auth/confirm-password')   ❌ BELUM ADA (view belum dibuat)
```

> **Catatan**: Fortify features (registration, reset password, dll) **enabled di config**,
> tapi hanya `auth/login.tsx` yang sudah dibuat sebagai view.

### Fortify Features (enabled)
- Registration
- Reset Passwords
- Email Verification
- Two-Factor Authentication (confirm: true, confirmPassword: true)

---

## 6. UI COMPONENT LIBRARY

Semua komponen ada di `resources/js/components/ui/` dan di-export via `index.ts`.
Import: `import { Button, Modal, TextInput, ... } from '@/components/ui'`

### Pattern yang digunakan
Semua komponen mengikuti pattern yang sama:
1. `forwardRef` untuk akses ref
2. Class builder array: `['base-class', condition && 'variant-class', className].filter(Boolean).join(' ')`
3. Props meng-extend HTML element attributes yang sesuai
4. TypeScript types di-export bersama komponen

### Daftar Komponen & API

#### ACTIONS
| Component | Props | Sub-components |
|-----------|-------|----------------|
| `Button` | `color?: ButtonColor, size?: ButtonSize, variant?: 'outline'\|'soft'\|'dash', wide?, block?, circle?, square?, glass?, loading?, active?` | — |
| `Dropdown` | `trigger: ReactNode, position?: 'top'\|'bottom'\|'left'\|'right', align?: 'start'\|'end', hover?, open?` | `DropdownItem` |
| `Modal` | `open?: boolean, onClose?, position?: 'top'\|'bottom'\|'middle', closeOnBackdrop?, boxClassName?` | `ModalHeader, ModalBody, ModalAction` |
| `ThemeController` | controller tema daisyUI | — |
| `Swap` | toggle swap animation | — |

**Modal** — mendukung 2 mode:
```tsx
// Mode 1: Declarative (controlled)
<Modal open={isOpen} onClose={() => setIsOpen(false)}>...</Modal>

// Mode 2: Imperative (via ref)
const modalRef = useRef<ModalHandle>(null);
modalRef.current?.showModal();
modalRef.current?.close();
```

#### DATA DISPLAY
| Component | Props | Sub-components |
|-----------|-------|----------------|
| `Card` | `variant?: 'bordered'\|'dash', size?: 'compact'\|'side'\|'normal', glass?, imagePosition?: 'full'\|'overlay'` | `CardBody, CardTitle, CardActions, CardFigure` |
| `Accordion` | accordion groups | `AccordionItem, Collapse` |
| `Table` | `zebra?, pinRows?, pinCols?, size?: 'xs'\|'sm'\|'md'\|'lg'` | `TableHead, TableBody, TableFoot, TableRow(hover?, active?), TableHeaderCell, TableCell` |
| `Badge` | `color?: BadgeColor, size?: BadgeSize` | — |
| `Avatar` | avatar image | `AvatarGroup` |
| `Timeline` | timeline display | `TimelineItem` |
| `Stat` | statistics display | `StatGroup` |
| `Carousel` | image carousel | `CarouselItem` |

#### NAVIGATION
| Component | Props | Sub-components |
|-----------|-------|----------------|
| `Breadcrumbs` | `items: BreadcrumbItem[]` | — |
| `Dock` | bottom dock navigation | `DockItem` |
| `Menu` | side/dropdown menu | `MenuItem, MenuTitle, SubMenu` |
| `Navbar` | `glass?` | `NavbarStart, NavbarCenter, NavbarEnd` |
| `Tabs` | `size?: TabsSize, variant?: 'bordered'\|'lifted'\|'boxed'` | `Tab, TabContent` |
| `ControlledTabs` | `tabs: {label, content, disabled?}[], variant?, size?, defaultIndex?` | — |
| `Steps` | step indicator | `Step` |
| `Pagination` | pagination wrapper | `PaginationButton` |
| `LaravelPagination` | `data: LaravelPaginationData, size?` — auto-renders Laravel paginator links | — |

**LaravelPagination** — menggunakan format data Laravel paginator standar:
```tsx
interface LaravelPaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}
```

#### DATA INPUT
| Component | Props |
|-----------|-------|
| `TextInput` | `label?, altLabel?, color?, size?, variant?: 'bordered'\|'ghost', error?, topRightLabel?, bottomRightLabel?` |
| `PasswordInput` | `label?, altLabel?, color?, size?, variant?: 'bordered'\|'ghost', error?, topRightLabel?, bottomRightLabel?` — toggle show/hide password dengan eye icon |
| `Textarea` | `label?, altLabel?, color?, size?, variant?, error?` |
| `SelectInput` | `label?, error?` + semua props `react-select` — auto daisyUI-themed via `getDaisyStyles()` |
| `NativeSelect` | `label?, altLabel?, options: NativeSelectOption[], placeholder?, color?, size?, variant?, error?` |
| `Checkbox` | `label?, color?, size?, error?` |
| `RadioButton` | `label?, color?, size?, error?` |
| `RadioGroup` | `name, options: {label, value, disabled?}[], value?, onChange?, color?, size?, direction?: 'vertical'\|'horizontal', error?` |
| `Toggle` | `label?, color?, size?, error?` |
| `Range` | range slider |
| `Rating` | star rating |
| `FileInput` | `label?, altLabel?, color?, size?, variant?, error?` |
| `DatePickerInput` | `label?, error?, selected?, onChange, color?, inputSize?, dateFormat?, showTimeSelect?, minDate?, maxDate?, isClearable?, showMonthYearPicker?, showYearPicker?, inline?, yearRange?: {start, end}` — **Custom header** dengan dropdown bulan (Indonesia) + tahun. Default tahun: 1945–sekarang+5 |
| `Fieldset` | form grouping | + `FieldsetLabel` |

Semua input component memiliki pattern seragam:
- `label` → renders `<label className="label"><span className="label-text">...</span></label>` di atas input
- `error` → renders `<span className="label-text-alt text-error">...</span>` di bawah input + menambah class error pada input
- `color` → menambah class `{component}-{color}` (misal `input-primary`)
- `size` → menambah class `{component}-{size}` (misal `input-sm`)

#### FEEDBACK
| Component | Props / Usage |
|-----------|---------------|
| `Loading` | `variant?: 'spinner'\|'dots'\|'ring'\|'ball'\|'bars'\|'infinity', size?, color?` |
| `LoadingOverlay` | `visible?, text?, variant?, size?` — full-page overlay |
| `Alert` | `color?: 'info'\|'success'\|'warning'\|'error', variant?: 'soft'\|'dash'\|'outline', icon?, actions?, onClose?` — auto icon per color |
| `Skeleton` | `width?, height?, circle?` |
| `SkeletonText` | `lines?` — pre-built multi-line skeleton |
| `SkeletonCard` | pre-built card skeleton |
| `SkeletonAvatar` | `size?` — circular skeleton |
| `SkeletonListItem` | pre-built list item skeleton (avatar + text) |
| `Progress` | progress bar |
| `RadialProgress` | circular progress |
| `Tooltip` | `position?, color?` |

**Toast System** — uses `react-hot-toast` with daisyUI styling:
```tsx
import { showSuccess, showError, showLoading, dismissToast, showPromise } from '@/components/ui';

showSuccess('Data berhasil disimpan');
showError('Gagal menyimpan data');
```

**Setup sudah selesai:**
- `<Toaster position="top-right" />` di `app.tsx`
- Flash messages dari Laravel di-share via `HandleInertiaRequests` middleware (`flash.success`, `flash.error`)
- `StafLayout` otomatis mendengarkan flash props dan menampilkan toast (via `usePage()` + `useEffect`)

#### LAYOUT
| Component | Props |
|-----------|-------|
| `Drawer` | `drawerId: string, sidebar: ReactNode, open?, end?` |
| `DrawerButton` | `drawerId: string` — toggle drawer |

#### THIRD-PARTY
| Component | Props |
|-----------|-------|
| `Lightbox` | image viewer (yet-another-react-lightbox) |
| `ImageGallery` | image gallery grid |

---

## 7. HOOKS

### `useAppearance` (`hooks/use-appearance.ts`)
```tsx
const { appearance, setAppearance } = useAppearance();
// appearance: 'light' | 'dark' | 'system'
// Persists to localStorage key 'appearance'
// Toggles 'dark' class on <html>
```

### `initializeTheme` — called in `app.tsx` on load

---

## 8. BACKEND PATTERNS

### Validation Traits (`app/Concerns/`)
```php
// PasswordValidationRules trait
passwordRules()        → ['required', 'string', Password::default(), 'confirmed']
currentPasswordRules() → ['required', 'string', 'current_password']

// ProfileValidationRules trait
profileRules(?int $userId) → ['name' => nameRules(), 'email' => emailRules($userId)]
nameRules()                → ['required', 'string', 'max:255']
emailRules(?int $userId)   → ['required', 'string', 'email', 'max:255', Rule::unique(User::class)->ignore($userId)]
```

### AppServiceProvider defaults
- `Date::use(CarbonImmutable::class)` — immutable dates
- `DB::prohibitDestructiveCommands()` — production safety
- `Password::defaults()` — production: min 12, mixedCase, letters, numbers, symbols, uncompromised

### Seeder
```php
// DatabaseSeeder creates:
// 1. Admin Staf / staf@ardipura.go.id / 123456 (role: staf)
// 2. Calls JenisSuratSeeder (13 jenis surat)
// 3. Calls PendudukSeeder (6 KK + penduduk + beberapa user warga dengan password: password123)
```

---

## 9. FRONTEND PATTERNS & CONVENTIONS

### Import Paths
```tsx
import { ComponentName } from '@/components/ui';           // UI components
import { useAppearance } from '@/hooks/use-appearance';    // Hooks
// '@' = resources/js (configured via tsconfig)
```

### Inertia Page Pattern
```tsx
import { Head } from '@inertiajs/react';

export default function PageName({ prop1, prop2 }: PageProps) {
    return (
        <>
            <Head title="Page Title" />
            {/* page content using daisyUI classes */}
        </>
    );
}
```

### Inertia Form Pattern (digunakan di CRUD Penduduk)
```tsx
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from '@inertiajs/react';
import { schema, defaultValues, type FormValues } from './schema';
import { TextInput, Button, showError } from '@/components/ui';

function MyForm() {
    const { control, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });

    const onSubmit = (values: FormValues) => {
        router.post('/endpoint', values, {
            onError: (serverErrors) => {
                Object.entries(serverErrors).forEach(([field, msg]) => {
                    setError(field as keyof FormValues, { type: 'server', message: msg });
                });
                showError(Object.values(serverErrors)[0] || 'Gagal menyimpan.');
            },
            onSuccess: () => closeModal(),  // flash toast handled by StafLayout
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller name="name" control={control} render={({ field }) => (
                <TextInput label="Name" {...field} error={errors.name?.message} />
            )} />
            <Button type="submit" color="primary">Simpan</Button>
        </form>
    );
}
```

**Catatan penting:**
- Gunakan `Controller` (bukan `register`) agar kompatibel dengan komponen UI daisyUI
- Server validation errors di-map ke field form via `setError()`
- Toast sukses otomatis dari flash message (tidak perlu `showSuccess` manual di `onSuccess`)

### Wayfinder Actions
Auto-generated TypeScript route helpers di `resources/js/actions/` dan `resources/js/routes/`.
Digunakan untuk type-safe routing ke backend controllers.

---

## 10. BUILD & RUN

```bash
# Development (runs: server + queue + logs + vite concurrently)
composer dev

# SSR Development
composer dev:ssr

# Build production
npm run build

# Lint
composer lint        # PHP (pint)
npm run lint         # JS/TS (eslint)
npm run format       # Prettier

# Type check
npm run types
```

---

## 11. STATUS & TODO

### ✅ Yang Sudah Ada
- Full stack & config (Laravel 12, React 19, Inertia, TailwindCSS v4, daisyUI v5)
- **4 custom Middleware**: EnsureUserHasRole, HandleAppearance, HandleInertiaRequests, RedirectByRole
- 42 reusable UI components dengan TypeScript types (incl. PasswordInput)
- Auth system (Fortify) — login page di root `/`
- **Database MySQL** (`KP_gealing`) dengan 13 migrations
- **9 Eloquent Models** dengan relationships lengkap
- **13 Jenis Surat** sudah di-seed dengan template_fields
- **Role system**: staf & warga (on users table)
- **StafLayout** — sidebar + navbar + flash toast listener
- **CRUD Penduduk** — fully functional:
  - Debounced auto-search (300ms) dengan ikon 🔍 + clear ✕
  - Filter by status penduduk
  - Form modal wide (`max-w-4xl`) dengan sections
  - Validasi client-side (Yup) + server-side (Laravel)
  - `react-hook-form` + `Controller` pattern
  - DatePickerInput dengan custom header (dropdown bulan/tahun)
  - Icon action buttons (edit ✏️ warning, hapus 🗑️ error, detail 👁️ info) dengan `title` attribute
  - Toast notifications (flash messages)
- **CRUD Kartu Keluarga** — fully functional:
  - Debounced auto-search (nomor KK, alamat, nama kepala keluarga)
  - Form modal (`max-w-3xl`) dengan sections (identitas, alamat, wilayah)
  - Detail modal (lihat info KK lengkap)
  - Jumlah anggota ditampilkan sebagai badge
  - Kepala keluarga di-eager load dan ditampilkan di tabel
  - Proteksi hapus: tidak bisa hapus KK yang masih punya anggota
  - Icon action buttons: detail 👁️ info, edit ✏️ warning, hapus 🗑️ error dengan `title` attribute
- **CRUD Mutasi Penduduk** — fully functional:
  - Filter jenis mutasi (masuk, keluar, meninggal, lahir)
  - Debounced search (nama penduduk, alasan)
  - Form modal dengan sections (identitas, detail mutasi)
  - Badge jenis mutasi dengan warna
  - Proteksi: tidak bisa hapus mutasi penduduk yang sudah meninggal
  - Icon action buttons: edit ✏️ warning, hapus 🗑️ error dengan `title` attribute
- **CRUD Pengajuan Surat** — fully functional:
  - Filter status (menunggu, diproses, selesai, ditolak)
  - Debounced search (nama penduduk, jenis surat, keperluan)
  - Form modal dengan sections (pengajuan, detail lampiran)
  - Update status via dropdown atau tombol
  - Catatan staf untuk feedback
  - Icon action buttons: status 📋 info, edit ✏️ warning, hapus 🗑️ error dengan `title` attribute
- **CRUD Surat** — fully functional:
  - Filter status & jenis surat
  - Debounced search (nomor surat, perihal, nama penduduk)
  - Form modal dengan sections (identitas, penduduk, penandatangan)
  - Auto-generate nomor surat
  - Aksi: terbitkan, batalkan, edit, hapus
  - Status badge dengan warna
  - Menggunakan `SelectInput` (react-select) untuk dropdown
  - **Cetak PDF**: stream preview di browser dengan layout tabel rapi
  - **Warga bisa cetak** surat dari pengajuan yang sudah selesai
- **CRUD Jenis Surat** — fully functional:
  - Search (kode, nama) - no pagination
  - Form modal dengan sections (identitas, persyaratan, pengaturan)
  - Toggle aktif/nonaktif langsung dari tabel
  - Proteksi hapus: cek penggunaan di surat/pengajuan
  - Badge status & bisa diajukan warga
  - Urutan otomatis jika kosong
  - Icon action buttons: toggle 🔒/🔓 success/neutral, edit ✏️ warning, hapus 🗑️ error dengan `title` attribute
- **CRUD Persyaratan Surat** — fully functional:
  - Daftar persyaratan per jenis surat
  - Filter by jenis surat
  - Form modal dengan sections (identitas, pengaturan)
  - Toggle wajib opsional langsung dari tabel
  - Urutan persyaratan bisa di-custom
  - Tipe file: KTP, KK, Foto, Pengantar RT, dll
  - Icon action buttons: edit ✏️ warning, hapus 🗑️ error dengan `title` attribute
- **Tema**: Emerald (light) + Forest (dark, auto via prefers-color-scheme)
- **Global CSS**: Border & focus styles konsisten untuk semua form controls
- **Toast system**: `<Toaster>` di app.tsx + flash listener di StafLayout
- Wayfinder, SSR, React Compiler configured
- **Dashboard Staf** — statistik kependudukan, pengajuan, surat, mutasi
- **Halaman Warga** — fully functional:
  - Dashboard warga dengan statistik
  - Form pengajuan surat dengan upload lampiran (multi-file, max 5MB per file)
  - Riwayat pengajuan dengan:
    - Detail modal (status, tanggal, catatan staf, dokumen terupload)
    - Tombol hapus (hanya jika status: menunggu/ditolak) dengan `title` attribute
    - Konfirmasi hapus dengan peringatan
    - **Cetak surat** untuk pengajuan yang sudah selesai (stream PDF)
- **Settings Pages** — profile, password, appearance, two-factor authentication

### ❌ Yang Belum Ada (perlu dibuat)
- ~~**Manajemen Kartu Keluarga** (CRUD) — staf only~~ ✅ Selesai (Session 3)
- ~~**Manajemen Surat** — staf membuat & menerbitkan surat~~ ✅ Selesai (Session 4)
- ~~**Pengajuan Surat Online** — staf memproses pengajuan~~ ✅ Selesai (Session 3/4)
- ~~**Mutasi Penduduk** — pencatatan pindah masuk/keluar/lahir/meninggal~~ ✅ Selesai (Session 3/4)
- ~~**Manajemen Jenis Surat** (CRUD) — staf only~~ ✅ Selesai (Session 5)
- ~~**Manajemen Persyaratan Surat** (CRUD) — staf only~~ ✅ Selesai (Session 6)
- ~~**Dashboard Staf** — statistik kependudukan~~ ✅ Selesai (Session 5)
- ~~**Halaman Warga** — dashboard + pengajuan surat + riwayat + detail modal + hapus~~ ✅ Selesai (Session 6)
- ~~**Upload Lampiran Pengajuan** — multi-file upload dengan validasi~~ ✅ Selesai (Session 6)
- ~~**Settings Pages** — profile, password, appearance, 2FA~~ ✅ Selesai (Session 5)
- ~~**Cetak Surat** — generate PDF surat~~ ✅ Selesai (Session 5)
- ~~**Laporan** — laporan kependudukan & surat~~ ✅ Selesai (Session 5)

### ❌ Yang Belum Ada
- **Auth pages selain login** — register, forgot-password, reset-password, verify-email, two-factor-challenge, confirm-password (Fortify features enabled tapi view belum dibuat)

### ✅ SEMUA FITUR UTAMA SELESAI!

---

## 12. CATATAN PENTING UNTUK AI

1. **Gunakan komponen UI yang sudah ada** — import dari `@/components/ui`.
2. **Styling** — TailwindCSS + daisyUI classes. CSS custom hanya di `app.css`.
3. **Form handling** — `react-hook-form` + `yup` + `Controller` + komponen UI. Buat file `schema.ts` terpisah.
4. **Toast notifications** — flash message dari Laravel, otomatis ditampilkan oleh StafLayout. Gunakan `showError()` untuk error client-side.
5. **Pagination** — `LaravelPagination` component.
6. **Inertia** — gunakan `router.post/put/delete()` untuk mutasi. Jangan `fetch()` biasa.
7. **Database** — MySQL (`KP_gealing`).
8. **Role-based access** — `$user->isStaf()` / `$user->isWarga()`.
9. **Layout** — Semua halaman staf gunakan `StafLayout`. Buat `WargaLayout` untuk halaman warga.
10. **DatePickerInput** — sudah punya custom header (dropdown bulan Indonesia + tahun). Gunakan `parseDate()` dan `formatDate()` helper (lihat `staf/penduduk/index.tsx`) untuk konversi string↔Date.
11. **Modal wide** — gunakan `boxClassName="max-w-4xl w-full"` untuk form besar.
12. **Jenis Surat template_fields** — JSON field dinamis, frontend harus render berdasarkan template.
13. **Action Buttons Pattern** — Gunakan emoji icons dengan `Button` component:
    - `size="sm"`, `variant="soft"`, `circle`
    - Icons: ✏️ Edit, 🗑️ Hapus, 👁️ Detail, 📋 Status, ✅ Terbitkan, 🚫 Batalkan, 🔒/🔓 Toggle
    - `flex justify-center gap-1` untuk container
    - `color` berdasarkan aksi: warning (edit), error (hapus), success (terbitkan), info (detail)
    - **WAJIB** tambahkan `title` attribute untuk accessibility (tooltip browser native)
    - Contoh: `<Button size="sm" variant="soft" circle color="warning" title="Edit Data">✏️</Button>`
14. **Select Dropdown** — Gunakan `SelectInput` (react-select) untuk form dropdown:
    - Lebih baik untuk banyak opsi, searchable
    - Value format: `{ value: string, label: string }`
    - Untuk controller: `value={options.find(o => o.value === String(field.value))}`
    - Untuk update method dengan unique validation: `rules(?int $ignoreId = null)` dan `unique:table,column,{id}`
15. **Warga Pengajuan** — Form pengajuan dengan upload lampiran:
    - File upload menggunakan FormData via `router.post()`
    - Lampiran disimpan di `storage/app/public/lampiran-pengajuan/`
    - Warga bisa hapus pengajuan jika status: menunggu/ditolak
    - Riwayat menampilkan detail modal dengan dokumen yang diupload
16. **File Upload Pattern** — Untuk upload file di frontend:
    - Gunakan `FormData` dan append file: `formData.append('lampiran[${persyaratanId}]', file)`
    - Backend handle dengan `$request->file('lampiran')` loop
    - Simpan dengan `Storage::disk('public')->store('path', 'public')`
    - Akses file via `/storage/{path}` setelah `php artisan storage:link`
17. **PDF Generation** — Cetak surat menggunakan `PDF` facade (laravel-dompdf):
    - Controller: `SuratCetakController` (Staf & Warga)
    - Use `stream()` untuk preview di browser, bukan `download()` langsung
    - PDF view: `resources/views/pdf/surat.blade.php` dengan layout tabel
    - Relationship: `Surat` model punya `pengajuan()` (bukan `pengajuanSurat`)

