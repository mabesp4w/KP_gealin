# Database Diagram — Proyek Gealin

Salin kode DBML di bawah ini ke [dbdiagram.io](https://dbdiagram.io) untuk menghasilkan diagram ERD.

```dbml
// ============================================
// GEALIN — Sistem Informasi Kelurahan Ardipura
// Database Diagram (dbdiagram.io)
// ============================================

// ─────────────────────────────────
// AUTENTIKASI
// ─────────────────────────────────

Table users {
  id bigint [pk, increment]
  name varchar
  role varchar(20) [default: 'warga', note: 'staf / warga']
  email varchar [unique]
  email_verified_at timestamp [null]
  password varchar
  show_password varchar [null]
  two_factor_secret text [null]
  two_factor_recovery_codes text [null]
  two_factor_confirmed_at timestamp [null]
  remember_token varchar [null]
  created_at timestamp
  updated_at timestamp
}

Table sessions {
  id varchar [pk]
  user_id bigint [null, ref: > users.id]
  ip_address varchar(45) [null]
  user_agent text [null]
  payload longtext
  last_activity int
}

// ─────────────────────────────────
// DATA KEPENDUDUKAN
// ─────────────────────────────────

Table kartu_keluarga {
  id bigint [pk, increment]
  nomor_kk varchar(16) [unique, note: '16 digit nomor KK']
  alamat text
  rt varchar(5)
  rw varchar(5)
  kelurahan varchar(100) [default: 'Ardipura']
  kecamatan varchar(100) [default: 'Jayapura Selatan']
  kabupaten_kota varchar(100) [default: 'Kota Jayapura']
  provinsi varchar(100) [default: 'Papua']
  kode_pos varchar(10) [null]
  tanggal_dikeluarkan date [null]
  created_at timestamp
  updated_at timestamp
}

Table penduduk {
  id bigint [pk, increment]

  // Identitas Utama
  nik varchar(16) [unique, note: '16 digit NIK']
  kartu_keluarga_id bigint [null, ref: > kartu_keluarga.id]
  user_id bigint [null, ref: > users.id]
  nama_lengkap varchar
  tempat_lahir varchar(100)
  tanggal_lahir date
  jenis_kelamin varchar(1) [note: 'L = Laki-laki, P = Perempuan']

  // Data Pribadi
  agama varchar(30) [note: 'Islam, Kristen Protestan, Katolik, Hindu, Buddha, Konghucu, Kepercayaan']
  status_perkawinan varchar(20) [note: 'Belum Kawin, Kawin, Cerai Hidup, Cerai Mati']
  pendidikan_terakhir varchar(50) [note: 'SD, SLTP, SLTA, D3, D4/S1, S2, S3, dll']
  pekerjaan varchar(100)
  kewarganegaraan varchar(5) [default: 'WNI', note: 'WNI / WNA']
  golongan_darah varchar(5) [null, note: 'A, B, AB, O, Tidak Tahu']

  // Data Keluarga
  status_hubungan_keluarga varchar(30) [note: 'Kepala Keluarga, Istri, Anak, dll']
  nama_ayah varchar(100) [null]
  nama_ibu varchar(100) [null]

  // Alamat
  alamat text
  rt varchar(5)
  rw varchar(5)

  // Status & Tambahan
  status_penduduk varchar(20) [default: 'Tetap', note: 'Tetap, Sementara, Pindah, Meninggal']
  telepon varchar(20) [null]
  foto varchar [null, note: 'path foto']
  tanggal_masuk date [null, note: 'tanggal terdaftar di kelurahan']
  catatan text [null]

  created_at timestamp
  updated_at timestamp
}

Table mutasi_penduduk {
  id bigint [pk, increment]
  penduduk_id bigint [ref: > penduduk.id]
  jenis_mutasi varchar(20) [note: 'masuk, keluar, meninggal, lahir']
  tanggal_mutasi date
  asal_tujuan varchar [null, note: 'asal (masuk) / tujuan (keluar)']
  alasan text [null]
  keterangan text [null]
  created_at timestamp
  updated_at timestamp
}

// ─────────────────────────────────
// PERSURATAN
// ─────────────────────────────────

Table jenis_surat {
  id bigint [pk, increment]
  kode varchar(20) [unique, note: 'e.g. SK-DOM, SKTM, SK-PINDAH']
  nama varchar [note: 'e.g. Surat Keterangan Domisili']
  deskripsi text [null]
  persyaratan text [null, note: 'deskripsi persyaratan dokumen']
  template_fields json [null, note: 'JSON: field-field tambahan per jenis surat']
  is_active boolean [default: true]
  bisa_diajukan_warga boolean [default: true, note: 'Warga bisa ajukan sendiri?']
  urutan int [default: 0, note: 'untuk sorting tampilan']
  created_at timestamp
  updated_at timestamp
}

Table persyaratan_surat {
  id bigint [pk, increment]
  jenis_surat_id bigint [ref: > jenis_surat.id]
  nama varchar [note: 'e.g. Fotokopi KTP, Surat Pengantar']
  tipe_file varchar(50) [null, note: 'KTP, KK, Foto, Pengantar RT, dll']
  wajib boolean [default: true]
  urutan int [default: 0]
  keterangan text [null]
  created_at timestamp
  updated_at timestamp
}

Table pengajuan_surat {
  id bigint [pk, increment]
  jenis_surat_id bigint [ref: > jenis_surat.id]
  penduduk_id bigint [ref: > penduduk.id]
  user_id bigint [ref: > users.id, note: 'warga yang mengajukan']
  keperluan varchar
  keterangan text [null]
  data_tambahan json [null, note: 'data form dinamis sesuai template_fields']
  status varchar(20) [default: 'menunggu', note: 'menunggu, diproses, selesai, ditolak']
  catatan_staf text [null]
  tanggal_diproses timestamp [null]
  created_at timestamp
  updated_at timestamp
}

Table lampiran_pengajuan {
  id bigint [pk, increment]
  pengajuan_surat_id bigint [ref: > pengajuan_surat.id]
  persyaratan_surat_id bigint [null, ref: > persyaratan_surat.id]
  nama_file varchar
  path_file varchar
  tipe_file varchar(50) [note: 'KTP, KK, Foto, Pengantar RT, dll']
  ukuran_file int [null, note: 'dalam bytes']
  created_at timestamp
  updated_at timestamp
}

Table surat {
  id bigint [pk, increment]
  nomor_surat varchar [unique]
  jenis_surat_id bigint [ref: > jenis_surat.id]
  pengajuan_surat_id bigint [null, ref: > pengajuan_surat.id]
  penduduk_id bigint [ref: > penduduk.id]
  perihal varchar
  keterangan text [null]
  data_tambahan json [null]
  status varchar(20) [default: 'draft', note: 'draft, diterbitkan, dibatalkan']
  tanggal_surat date
  ditandatangani_oleh varchar [null]
  jabatan_penandatangan varchar [null]
  created_at timestamp
  updated_at timestamp
}

// ─────────────────────────────────
// TABLE GROUPS
// ─────────────────────────────────

TableGroup autentikasi {
  users
  sessions
}

TableGroup kependudukan {
  kartu_keluarga
  penduduk
  mutasi_penduduk
}

TableGroup persuratan {
  jenis_surat
  persyaratan_surat
  pengajuan_surat
  lampiran_pengajuan
  surat
}
```
