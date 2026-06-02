# Flowmap / Prosedur Penggunaan Website Gealin

> **Aplikasi Kependudukan Berbasis Web — Kelurahan Ardipura**

---

## 1. Flowmap Umum Sistem

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka Website]
    B --> C{Sudah Login?}
    C -- Belum --> D[Halaman Login]
    C -- Sudah --> E{Cek Role}
    D --> F[Masukkan Email & Password]
    F --> G{Login Berhasil?}
    G -- Gagal --> F
    G -- Berhasil --> E
    E -- Staf --> H[Dashboard Staf]
    E -- Warga --> I[Dashboard Warga]
    H --> H1["Menu Staf:<br/>• Penduduk<br/>• Kartu Keluarga<br/>• Mutasi<br/>• Jenis Surat<br/>• Persyaratan Surat<br/>• Surat<br/>• Pengajuan Surat<br/>• Laporan<br/>• Settings"]
    I --> I1["Menu Warga:<br/>• Pengajuan Surat<br/>• Riwayat Pengajuan<br/>• Settings"]
    H1 --> Z([Selesai])
    I1 --> Z
```

---

## 2. Prosedur Login

```mermaid
flowchart TD
    A([Mulai]) --> B["Buka halaman utama (/)"]
    B --> C{Sudah terautentikasi?}
    C -- Ya --> D[Redirect otomatis ke dashboard sesuai role]
    C -- Tidak --> E[Tampilkan form login]
    E --> F[Input email & password]
    F --> G[Klik tombol Login]
    G --> H{Validasi berhasil?}
    H -- Tidak --> I[Tampilkan pesan error]
    I --> F
    H -- Ya --> J{Cek role user}
    J -- staf --> K[Redirect ke /staf]
    J -- warga --> L[Redirect ke /warga]
    K --> M([Selesai])
    L --> M
```

---

## 3. Prosedur Staf — Kelola Data Penduduk

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka menu Penduduk]
    B --> C[Tampil tabel data penduduk<br/>dengan pagination & search]
    C --> D{Pilih Aksi}

    D -- Tambah --> E1[Klik tombol Tambah Penduduk]
    E1 --> E2[Tampil form modal]
    E2 --> E3["Isi data:<br/>NIK, Nama, Tempat/Tgl Lahir,<br/>Jenis Kelamin, Agama,<br/>Status, Pekerjaan, Alamat,<br/>Kartu Keluarga, dll"]
    E3 --> E4[Klik Simpan]
    E4 --> E5{Validasi berhasil?}
    E5 -- Tidak --> E6[Tampilkan error di form]
    E6 --> E3
    E5 -- Ya --> E7[Data tersimpan + Toast sukses]
    E7 --> C

    D -- Edit --> F1["Klik tombol Edit (✏️)"]
    F1 --> F2[Tampil form modal berisi data]
    F2 --> F3[Ubah data yang diinginkan]
    F3 --> F4[Klik Simpan]
    F4 --> F5{Validasi berhasil?}
    F5 -- Tidak --> F6[Tampilkan error]
    F6 --> F3
    F5 -- Ya --> F7[Data diperbarui + Toast sukses]
    F7 --> C

    D -- Hapus --> G1["Klik tombol Hapus (🗑️)"]
    G1 --> G2[Tampil konfirmasi hapus]
    G2 --> G3{Konfirmasi?}
    G3 -- Batal --> C
    G3 -- Ya --> G4[Data dihapus + Toast sukses]
    G4 --> C

    D -- Cari --> H1[Ketik di kolom pencarian]
    H1 --> H2[Auto-search setelah 300ms]
    H2 --> C

    D -- Filter --> I1[Pilih filter status penduduk]
    I1 --> C

    D -- Selesai --> Z([Selesai])
```

---

## 4. Prosedur Staf — Kelola Kartu Keluarga

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka menu Kartu Keluarga]
    B --> C[Tampil tabel data KK<br/>dengan search & pagination]
    C --> D{Pilih Aksi}

    D -- Tambah --> E1[Klik tombol Tambah KK]
    E1 --> E2[Tampil form modal]
    E2 --> E3["Isi data:<br/>Nomor KK, Alamat,<br/>RT/RW, Kelurahan,<br/>Kecamatan, Kab/Kota,<br/>Provinsi, Kode Pos"]
    E3 --> E4[Klik Simpan]
    E4 --> E5{Validasi?}
    E5 -- Error --> E3
    E5 -- OK --> E6[Data tersimpan]
    E6 --> C

    D -- "Detail (👁️)" --> F1[Tampil modal detail KK<br/>beserta info lengkap]
    F1 --> C

    D -- "Edit (✏️)" --> G1[Tampil form modal berisi data]
    G1 --> G2[Ubah & Simpan]
    G2 --> C

    D -- "Hapus (🗑️)" --> H1{KK masih punya anggota?}
    H1 -- Ya --> H2[Tampil pesan error:<br/>tidak bisa dihapus]
    H2 --> C
    H1 -- Tidak --> H3[Konfirmasi & hapus]
    H3 --> C

    D -- Selesai --> Z([Selesai])
```

---

## 5. Prosedur Staf — Kelola Mutasi Penduduk

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka menu Mutasi]
    B --> C[Tampil tabel mutasi<br/>dengan filter & search]
    C --> D{Pilih Aksi}

    D -- Tambah --> E1[Klik Tambah Mutasi]
    E1 --> E2[Tampil form modal]
    E2 --> E3["Isi data:<br/>Pilih Penduduk,<br/>Jenis Mutasi (masuk/keluar/meninggal/lahir),<br/>Tanggal, Asal/Tujuan,<br/>Alasan, Keterangan"]
    E3 --> E4[Simpan]
    E4 --> E5{Valid?}
    E5 -- Error --> E3
    E5 -- OK --> E6[Data tersimpan]
    E6 --> C

    D -- "Edit (✏️)" --> F1[Edit data mutasi]
    F1 --> C

    D -- "Hapus (🗑️)" --> G1[Konfirmasi & hapus]
    G1 --> C

    D -- Filter --> H1["Filter jenis mutasi<br/>(masuk/keluar/meninggal/lahir)"]
    H1 --> C

    D -- Selesai --> Z([Selesai])
```

---

## 6. Prosedur Staf — Kelola Surat

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka menu Surat]
    B --> C[Tampil tabel surat<br/>dengan filter status & jenis]
    C --> D{Pilih Aksi}

    D -- Tambah --> E1[Klik Tambah Surat]
    E1 --> E2[Tampil form modal]
    E2 --> E3["Isi data:<br/>Jenis Surat, Penduduk,<br/>Perihal, Keterangan,<br/>Tanggal Surat,<br/>Penandatangan & Jabatan,<br/>Data Tambahan (dinamis)"]
    E3 --> E4[Simpan sebagai Draft]
    E4 --> E5{Valid?}
    E5 -- Error --> E3
    E5 -- OK --> E6["Surat tersimpan (status: draft)"]
    E6 --> C

    D -- "Terbitkan (✅)" --> F1{Status draft?}
    F1 -- Ya --> F2["Ubah status → diterbitkan<br/>+ generate nomor surat"]
    F2 --> C
    F1 -- Tidak --> C

    D -- "Batalkan (🚫)" --> G1["Ubah status → dibatalkan"]
    G1 --> C

    D -- "Cetak PDF" --> H1[Stream PDF di browser]
    H1 --> H2{Cetak / Download?}
    H2 -- Ya --> H3[Print / Save PDF]
    H3 --> C
    H2 -- Kembali --> C

    D -- "Edit (✏️)" --> I1[Edit data surat]
    I1 --> C

    D -- "Hapus (🗑️)" --> J1[Konfirmasi & hapus]
    J1 --> C

    D -- Selesai --> Z([Selesai])
```

---

## 7. Prosedur Staf — Proses Pengajuan Surat

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka menu Pengajuan Surat]
    B --> C[Tampil tabel pengajuan<br/>dengan filter status & search]
    C --> D{Pilih Aksi}

    D -- "Lihat Detail (📋)" --> E1[Tampil detail pengajuan<br/>+ lampiran yang diupload]
    E1 --> C

    D -- "Update Status" --> F1{Pilih status baru}
    F1 -- Diproses --> F2["Status → diproses<br/>+ isi catatan staf (opsional)"]
    F2 --> C
    F1 -- Selesai --> F3["Status → selesai<br/>+ buat surat otomatis"]
    F3 --> C
    F1 -- Ditolak --> F4["Status → ditolak<br/>+ isi catatan alasan penolakan"]
    F4 --> C

    D -- "Edit (✏️)" --> G1[Edit data pengajuan]
    G1 --> C

    D -- "Hapus (🗑️)" --> H1[Konfirmasi & hapus]
    H1 --> C

    D -- Selesai --> Z([Selesai])
```

---

## 8. Prosedur Staf — Kelola Jenis Surat & Persyaratan

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka menu Jenis Surat]
    B --> C[Tampil daftar 13 jenis surat]
    C --> D{Pilih Aksi}

    D -- Tambah --> E1[Form: Kode, Nama, Deskripsi,<br/>Template Fields, Pengaturan]
    E1 --> E2[Simpan jenis surat baru]
    E2 --> C

    D -- "Toggle Aktif (🔒/🔓)" --> F1[Aktifkan / Nonaktifkan<br/>jenis surat]
    F1 --> C

    D -- "Kelola Persyaratan" --> G1[Buka halaman Persyaratan Surat]
    G1 --> G2[Filter by jenis surat]
    G2 --> G3[Tampil daftar persyaratan]
    G3 --> G4{Aksi Persyaratan}
    G4 -- Tambah --> G5["Isi: Nama, Tipe File,<br/>Wajib/Opsional, Urutan"]
    G5 --> G3
    G4 -- Edit --> G6[Edit persyaratan]
    G6 --> G3
    G4 -- Hapus --> G7[Hapus persyaratan]
    G7 --> G3
    G4 -- Kembali --> C

    D -- "Edit (✏️)" --> H1[Edit jenis surat]
    H1 --> C

    D -- "Hapus (🗑️)" --> I1{Sudah dipakai di surat/pengajuan?}
    I1 -- Ya --> I2[Error: tidak bisa dihapus]
    I2 --> C
    I1 -- Tidak --> I3[Hapus jenis surat]
    I3 --> C

    D -- Selesai --> Z([Selesai])
```

---

## 9. Prosedur Staf — Laporan

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka menu Laporan]
    B --> C[Tampil halaman laporan<br/>kependudukan & surat]
    C --> D{Pilih jenis laporan}
    D -- "Laporan Kependudukan" --> E1[Lihat statistik &<br/>data penduduk]
    D -- "Laporan Surat" --> E2[Lihat statistik &<br/>data surat yang diterbitkan]
    E1 --> Z([Selesai])
    E2 --> Z
```

---

## 10. Prosedur Warga — Pengajuan Surat Online

```mermaid
flowchart TD
    A([Mulai]) --> B[Login sebagai Warga]
    B --> C[Dashboard Warga<br/>tampil statistik pengajuan]
    C --> D[Klik menu Pengajuan Surat]
    D --> E[Tampil form pengajuan]
    E --> F[Pilih Jenis Surat<br/>yang ingin diajukan]
    F --> G["Isi data pengajuan:<br/>Keperluan, Keterangan,<br/>Data Tambahan (sesuai jenis)"]
    G --> H{Ada persyaratan lampiran?}
    H -- Ya --> I["Upload file lampiran<br/>(KTP, KK, Foto, dll)<br/>max 5MB per file"]
    I --> J[Klik Kirim Pengajuan]
    H -- Tidak --> J
    J --> K{Validasi berhasil?}
    K -- Tidak --> L[Tampilkan error]
    L --> G
    K -- Ya --> M["Pengajuan terkirim<br/>(status: menunggu)"]
    M --> N[Toast sukses]
    N --> O([Selesai])
```

---

## 11. Prosedur Warga — Riwayat & Cetak Surat

```mermaid
flowchart TD
    A([Mulai]) --> B[Klik menu Riwayat Pengajuan]
    B --> C[Tampil daftar pengajuan<br/>dengan status badge]
    C --> D{Pilih Aksi}

    D -- "Lihat Detail" --> E1[Tampil modal detail:<br/>status, tanggal, jenis surat,<br/>catatan staf, dokumen terupload]
    E1 --> C

    D -- "Cetak Surat" --> F1{Status pengajuan = selesai?}
    F1 -- Ya --> F2[Stream PDF surat di browser]
    F2 --> F3[Print / Download PDF]
    F3 --> C
    F1 -- Tidak --> F4[Tombol cetak tidak tersedia]
    F4 --> C

    D -- "Hapus Pengajuan" --> G1{Status menunggu / ditolak?}
    G1 -- Ya --> G2[Tampil konfirmasi hapus]
    G2 --> G3{Konfirmasi?}
    G3 -- Ya --> G4[Pengajuan dihapus]
    G4 --> C
    G3 -- Batal --> C
    G1 -- Tidak --> G5["Tidak bisa dihapus<br/>(status: diproses/selesai)"]
    G5 --> C

    D -- Selesai --> Z([Selesai])
```

---

## 12. Flowmap Alur Pengajuan Surat (End-to-End)

> Alur lengkap dari pengajuan oleh warga hingga surat dicetak.

```mermaid
flowchart TD
    subgraph WARGA ["🧑 Warga"]
        W1[Login] --> W2[Buka form Pengajuan Surat]
        W2 --> W3[Pilih jenis surat]
        W3 --> W4[Isi data & upload lampiran]
        W4 --> W5[Kirim pengajuan]
        W5 --> W6["Status: Menunggu ⏳"]
    end

    subgraph STAF ["👨‍💼 Staf Kelurahan"]
        S1[Login] --> S2[Buka menu Pengajuan]
        S2 --> S3[Review pengajuan warga]
        S3 --> S4{Keputusan}
        S4 -- Proses --> S5["Status → Diproses 🔄"]
        S5 --> S6[Verifikasi data & lampiran]
        S6 --> S7{Data lengkap & valid?}
        S7 -- Ya --> S8["Status → Selesai ✅<br/>+ Surat dibuat otomatis"]
        S7 -- Tidak --> S9["Status → Ditolak ❌<br/>+ Catatan alasan"]
        S4 -- Tolak --> S9
        S8 --> S10[Terbitkan surat]
        S10 --> S11[Cetak PDF surat]
    end

    subgraph HASIL ["📄 Hasil"]
        H1[Warga cek riwayat]
        H2{Status selesai?}
        H3[Cetak/Download surat PDF]
        H4[Lihat catatan penolakan]
        H5[Ajukan ulang jika perlu]
    end

    W6 -.->|Notifikasi status| S2
    S8 -.-> H1
    S9 -.-> H1
    H1 --> H2
    H2 -- Ya --> H3
    H2 -- Tidak/Ditolak --> H4
    H4 --> H5
    H5 -.-> W2
```

---

## 13. Prosedur Settings (Staf & Warga)

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka menu Settings]
    B --> C{Pilih sub-menu}

    C -- Profile --> D1[Edit Nama & Email]
    D1 --> D2[Klik Simpan]
    D2 --> D3[Profil diperbarui]

    C -- Password --> E1[Masukkan password lama]
    E1 --> E2[Masukkan password baru + konfirmasi]
    E2 --> E3[Klik Update Password]
    E3 --> E4{Valid?}
    E4 -- Error --> E1
    E4 -- OK --> E5[Password diperbarui]

    C -- Appearance --> F1["Pilih tema:<br/>Light / Dark / System"]
    F1 --> F2[Tema langsung berubah]

    C -- "Two-Factor Auth" --> G1[Aktifkan 2FA]
    G1 --> G2[Scan QR Code]
    G2 --> G3[Masukkan kode verifikasi]
    G3 --> G4[2FA aktif + recovery codes]

    D3 --> Z([Selesai])
    E5 --> Z
    F2 --> Z
    G4 --> Z
```

---

## Ringkasan Prosedur

| No | Prosedur | Aktor | Halaman |
|----|----------|-------|---------|
| 1 | Login | Staf / Warga | `/` |
| 2 | Kelola Penduduk (CRUD) | Staf | `/staf/penduduk` |
| 3 | Kelola Kartu Keluarga (CRUD) | Staf | `/staf/kartu-keluarga` |
| 4 | Kelola Mutasi Penduduk (CRUD) | Staf | `/staf/mutasi` |
| 5 | Kelola Surat (CRUD + Terbitkan/Batalkan + Cetak) | Staf | `/staf/surat` |
| 6 | Proses Pengajuan Surat | Staf | `/staf/pengajuan` |
| 7 | Kelola Jenis Surat (CRUD) | Staf | `/staf/jenis-surat` |
| 8 | Kelola Persyaratan Surat (CRUD) | Staf | `/staf/persyaratan-surat` |
| 9 | Laporan Kependudukan & Surat | Staf | `/staf/laporan` |
| 10 | Pengajuan Surat Online | Warga | `/warga/pengajuan` |
| 11 | Riwayat & Cetak Surat | Warga | `/warga/riwayat` |
| 12 | Pengaturan Akun | Staf / Warga | `/settings/*` |
