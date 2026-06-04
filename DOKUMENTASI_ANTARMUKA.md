# Dokumentasi Antar Muka — Gealin

> Aplikasi Kependudukan Berbasis Web — Kelurahan Ardipura
>
> Dokumen ini menjelaskan tampilan dan fungsi setiap halaman pada aplikasi Gealin secara berurutan, mulai dari halaman publik hingga seluruh fitur yang tersedia bagi Staf Kelurahan, Warga, dan halaman pengaturan.

---

## Daftar Halaman

### Halaman Publik (Tanpa Masuk)

| No | Nama Halaman | Alamat |
|----|--------------|--------|
| 1 | Beranda | `/` |
| 2 | Berita | `/berita` |
| 3 | Artikel | `/artikel` |
| 4 | Pengumuman | `/pengumuman` |
| 5 | Kegiatan | `/kegiatan` |
| 6 | Berita Video | `/berita-video` |
| 7 | Informasi & Layanan | `/informasi` |
| 8 | Detail Informasi | `/informasi/{slug}` |
| 9 | Visi Misi | `/profil/visi-misi` |
| 10 | Struktur Organisasi | `/profil/struktur-organisasi` |
| 11 | Peta | `/profil/peta` |
| 12 | Halaman Masuk | `/login` |

### Halaman Staf

| No | Nama Halaman | Alamat |
|----|--------------|--------|
| 13 | Dashboard Staf | `/staf` |
| 14 | Data Penduduk | `/staf/penduduk` |
| 15 | Kartu Keluarga | `/staf/kartu-keluarga` |
| 16 | Mutasi Penduduk | `/staf/mutasi` |
| 17 | Pengajuan Masuk | `/staf/pengajuan` |
| 18 | Surat | `/staf/surat` |
| 19 | Jenis Surat | `/staf/jenis-surat` |
| 20 | Persyaratan Surat | `/staf/persyaratan-surat` |
| 21 | Laporan | `/staf/laporan` |
| 22 | Berita | `/staf/berita` |
| 23 | Kegiatan | `/staf/kegiatan` |
| 24 | Pengumuman | `/staf/pengumuman` |
| 25 | Berita Video | `/staf/berita-video` |
| 26 | Artikel | `/staf/artikel` |

### Halaman Warga

| No | Nama Halaman | Alamat |
|----|--------------|--------|
| 27 | Dashboard Warga | `/warga` |
| 28 | Pengajuan Surat | `/warga/pengajuan` |
| 29 | Riwayat Pengajuan | `/warga/riwayat` |

### Halaman Pengaturan (Semua Pengguna)

| No | Nama Halaman | Alamat |
|----|--------------|--------|
| 30 | Kata Sandi | `/settings/password` |
| 31 | Tampilan | `/settings/appearance` |
| 32 | Autentikasi Dua Faktor | `/settings/two-factor` |

### Halaman Cetak

| No | Nama Halaman | Alamat |
|----|--------------|--------|
| 33 | Cetak Surat oleh Staf | `/staf/surat/{id}/cetak` |
| 34 | Cetak Surat oleh Warga | `/warga/surat/{pengajuanId}/cetak` |

---

## Tampilan Umum Aplikasi

Aplikasi Gealin menggunakan tiga jenis tampian dasar yang berbeda sesuai dengan peruntukannya.

### Tampian Halaman Publik

Halaman publik adalah halaman yang dapat dilihat oleh siapa saja tanpa harus masuk ke dalam sistem. Ciri khas tampian ini adalah adanya bagian atas yang memuat logo kelurahan, tautan menu utama, dan tombol untuk masuk. Menu utama terdiri dari Beranda, Profil (memiliki submenu Visi Misi, Struktur Organisasi, Peta), Informasi & Layanan, serta Berita (memiliki submenu Berita, Artikel, Pengumuman, Kegiatan, Berita Video). Apabila pengguna sudah masuk, nama pengguna akan tampil di bagian pojok kanan atas. Di bagian paling bawah halaman, terdapat informasi tentang aplikasi, menu cepat, dan alamat kontak kelurahan.

### Tampian Halaman Staf

Seluruh halaman staf menggunakan tampian yang sama. Di sisi kiri terdapat menu samping yang memuat logo kelurahan dan daftar fitur yang tersedia. Daftar fitur dikelompokkan menjadi beberapa bagian, yaitu Dashboard, Data Kependudukan (Penduduk, Kartu Keluarga, Mutasi Penduduk), Layanan Surat (Pengajuan Masuk, Surat, Jenis Surat, Persyaratan Surat), Konten & Informasi (Berita, Kegiatan, Pengumuman, Berita Video, Artikel), dan Laporan. Di bagian atas terdapat bilah navigasi yang menampilkan judul halaman, tautan ke halaman utama, dan tombol untuk keluar. Pada perangkat bergerak seperti telepon genggam, menu samping akan tersembunyi dan dapat dibuka melalui tombol yang tersedia di bagian atas.

### Tampian Halaman Warga

Halaman warga menampilkan logo kelurahan di bagian atas beserta tulisan "Layanan Warga" dan tombol keluar. Di sisi kiri terdapat menu yang memuat tiga pilihan, yaitu Dashboard, Pengajuan Surat, dan Riwayat Pengajuan.

---

## 1. Beranda (Halaman Publik)

Halaman beranda adalah halaman pertama yang dilihat oleh pengunjung saat membuka aplikasi. Halaman ini terdiri dari beberapa bagian.

Bagian pertama menampilkan judul "Selamat Datang di Gealin — Kelurahan Ardipura" dengan hiasan warna, deskripsi singkat tentang aplikasi, serta dua tombol ajakan yaitu "Mulai Sekarang" dan "Lihat Informasi".

Bagian kedua menampilkan empat informasi ringkas berupa jumlah penduduk terdaftar, jumlah layanan surat, keterangan bahwa layanan dapat diakses selama 24 jam, dan keterangan bahwa layanan tidak dipungut biaya.

Bagian ketiga menampilkan informasi-informasi terkini. Pengunjung dapat memilih kategori informasi yang ingin dilihat, misalnya Semua, Berita, Artikel, Pengumuman, Kegiatan, atau Berita Video. Tersedia pula kolom pencarian untuk mencari informasi berdasarkan kata kunci. Setiap informasi ditampilkan dalam bentuk kartu yang memuat gambar (atau hiasan warna apabila tidak ada gambar), label kategori, tanggal, judul, ringkasan, nama penulis, dan tombol untuk membaca selengkapnya.

Bagian keempat merupakan ajakan bagi pengunjung untuk masuk dan menggunakan layanan administrasi kependudukan secara daring.

---

## 2. Berita (Halaman Publik)

Halaman berita menampilkan seluruh informasi yang termasuk dalam kategori berita. Pengunjung dapat mencari berita berdasarkan kata kunci. Setiap berita ditampilkan dalam bentuk kartu yang memuat gambar, label kategori, tanggal, judul, ringkasan, nama penulis, dan tombol untuk membaca selengkapnya.

---

## 3. Artikel (Halaman Publik)

Halaman artikel menampilkan seluruh informasi yang termasuk dalam kategori artikel. Pengunjung dapat mencari artikel berdasarkan kata kunci. Setiap artikel ditampilkan dalam bentuk kartu yang memuat gambar, label kategori, tanggal, judul, ringkasan, nama penulis, dan tombol untuk membaca selengkapnya.

---

## 4. Pengumuman (Halaman Publik)

Halaman pengumuman menampilkan seluruh informasi yang termasuk dalam kategori pengumuman. Pengunjung dapat mencari pengumuman berdasarkan kata kunci. Setiap pengumuman ditampilkan dalam bentuk kartu yang memuat gambar, label kategori, tanggal, judul, ringkasan, nama penulis, dan tombol untuk membaca selengkapnya.

---

## 5. Kegiatan (Halaman Publik)

Halaman kegiatan menampilkan seluruh informasi yang termasuk dalam kategori kegiatan. Pengunjung dapat mencari kegiatan berdasarkan kata kunci. Setiap kegiatan ditampilkan dalam bentuk kartu yang memuat gambar, label kategori, tanggal, judul, ringkasan, nama penulis, dan tombol untuk membaca selengkapnya.

---

## 6. Berita Video (Halaman Publik)

Halaman berita video menampilkan seluruh informasi yang termasuk dalam kategori berita video. Pengunjung dapat mencari berita video berdasarkan kata kunci. Setiap berita video ditampilkan dalam bentuk kartu yang memuat gambar, label kategori, tanggal, judul, ringkasan, nama penulis, dan tombol untuk membaca selengkapnya.

---

## 7. Informasi & Layanan

Halaman ini menampilkan seluruh informasi publik dalam bentuk daftar yang dapat dicari. Di halaman ini juga terdapat informasi tentang jenis-jenis surat yang tersedia dan statistik kependudukan umum.

---

## 8. Detail Informasi

Halaman detail menampilkan isi lengkap dari suatu informasi, mencakup judul, kategori, tanggal, penulis, gambar, dan isi utama. Di bagian bawah terdapat daftar informasi lain yang masih terkait dengan informasi yang sedang dibaca.

---

## 9. Halaman Profil

### 9a. Visi Misi

Halaman yang menampilkan visi dan misi Kelurahan Ardipura.

### 9b. Struktur Organisasi

Halaman yang menampilkan struktur organisasi kelurahan. [Image 1]

### 9c. Peta

Halaman yang menampilkan peta lokasi kelurahan.

---

## 10. Halaman Masuk

Halaman masuk digunakan oleh pengguna untuk masuk ke dalam sistem. Halaman ini terbagi menjadi dua sisi.

Pada sisi kiri yang hanya tampil pada layar lebar, terdapat latar belakang berwarna dengan ikon dan nama aplikasi beserta keterangan "Sistem Informasi Kependudukan — Kelurahan Ardipura".

Pada sisi kanan, terdapat formulir masuk yang terdiri dari kolom surel, kolom kata sandi yang dilengkapi tombol untuk menampilkan atau menyembunyikan kata sandi, kotak centang "Ingat saya", tautan menuju halaman lupa kata sandi, dan tombol "Masuk". Apabila surel atau kata sandi yang dimasukkan tidak sesuai dengan data yang terdaftar, pesan kesalahan akan muncul di bawah kolom yang bersangkutan.

---

## 11. Dashboard Staf

Dashboard staf adalah halaman utama yang muncul setelah staf kelurahan berhasil masuk. Halaman ini menyajikan ringkasan data kependudukan dan aktivitas layanan surat dalam satu tampian.

Pada bagian atas, terdapat ucapan selamat datang beserta nama staf yang sedang menggunakan aplikasi dan tanggal hari ini. Di bawahnya, tersaji empat ringkasan utama yang menampilkan jumlah total penduduk, jumlah kartu keluarga, jumlah surat yang diterbitkan pada bulan berjalan, dan jumlah pengajuan surat yang masih menunggu untuk ditindaklanjuti.

Bagian selanjutnya menampilkan informasi yang lebih terperinci, yaitu perbandingan jumlah penduduk laki-laki dan perempuan, ringkasan mutasi penduduk bulan ini (masuk, keluar, lahir, dan meninggal), ringkasan status penduduk (tetap, sementara, pindah, dan meninggal), ringkasan status pengajuan (menunggu, diproses, selesai, dan ditolak), serta ringkasan status surat (draf, diterbitkan, dan dibatalkan).

Di bagian bawah, terdapat dua daftar yang menampilkan pengajuan surat terbaru dan mutasi penduduk terbaru.

---

## 12. Data Penduduk

Halaman data penduduk digunakan oleh staf untuk mengelola seluruh data penduduk Kelurahan Ardipura. Staf dapat menambah penduduk baru, mengubah data yang sudah ada, melihat rincian data, serta menghapus data penduduk.

Pada bagian atas halaman, terdapat tombol "Tambah Penduduk" untuk menambahkan data penduduk baru. Di bawahnya, terdapat kolom pencarian yang memungkinkan staf mencari penduduk berdasarkan nama, NIK, atau informasi lainnya. Tersedia pula pilihan penyaring berdasarkan status penduduk, yaitu Tetap, Sementara, Pindah, atau Meninggal.

Data penduduk ditampilkan dalam bentuk tabel yang memuat nomor urut, NIK, nama lengkap, jenis kelamin, alamat, nomor kartu keluarga, status penduduk, status akun, dan tombol-tombol tindakan. Setiap baris data dilengkapi tiga tombol, yaitu tombol untuk melihat rincian, tombol untuk mengubah data, dan tombol untuk menghapus data. Apabila data terlalu banyak, tabel akan dibagi menjadi beberapa halaman.

### Formulir Tambah dan Ubah Penduduk

Saat staf menekan tombol tambah atau ubah, muncul jendela formulir yang terdiri dari:

- **Identitas Utama**: NIK, nama lengkap, tempat lahir, tanggal lahir, jenis kelamin, dan agama.
- **Data Pribadi**: Status perkawinan, pendidikan terakhir, pekerjaan, kewarganegaraan, dan golongan darah.
- **Data Keluarga**: Hubungan dalam keluarga, pemilihan kartu keluarga, nama ayah, dan nama ibu.
- **Alamat**: Alamat lengkap, RT, dan RW.
- **Status dan Keterangan**: Status kependudukan, nomor telepon, tanggal masuk, dan catatan tambahan.
- **Akun Masuk** (hanya saat menambah baru): Pilihan untuk membuatkan akun masuk bagi penduduk tersebut dengan mengisi surel dan kata sandi.

### Jendela Rincian

Saat staf menekan tombol lihat rincian, muncul jendela yang menampilkan seluruh data penduduk dalam bentuk yang hanya dapat dibaca. Apabila penduduk tersebut memiliki akun masuk, surel akun akan ditampilkan beserta tombol untuk mengatur ulang kata sandi.

### Jendela Hapus

Saat staf menekan tombol hapus, muncul jendela konfirmasi yang menampilkan nama dan NIK penduduk yang akan dihapus, disertai peringatan bahwa penghapusan bersifat tetap dan tidak dapat dibatalkan.

---

## 13. Kartu Keluarga

Halaman kartu keluarga digunakan oleh staf untuk mengelola data kartu keluarga. Staf dapat menambah, mengubah, melihat rincian, serta menghapus data kartu keluarga.

Tampilan utama berupa tabel yang memuat nomor kartu keluarga, nama kepala keluarga, alamat, RT/RW, jumlah anggota keluarga, dan tombol-tombol tindakan. Di atas tabel terdapat kolom pencarian dan tombol "Tambah KK".

### Formulir Tambah dan Ubah Kartu Keluarga

Formulir terdiri dari dua bagian, yaitu identitas kartu keluarga yang memuat nomor KK (16 digit) dan tanggal dikeluarkan, serta alamat lengkap yang memuat RT, RW, kelurahan, kecamatan, kabupaten atau kota, provinsi, dan kode pos.

### Jendela Hapus

Jendela konfirmasi akan muncul saat staf menekan tombol hapus. Apabila kartu keluarga masih memiliki anggota, sistem akan memberikan peringatan agar anggota dipindahkan atau dihapus terlebih dahulu sebelum kartu keluarga dapat dihapus.

---

## 14. Mutasi Penduduk

Halaman mutasi penduduk digunakan oleh staf untuk mencatat perubahan status penduduk. Terdapat empat jenis mutasi yang dapat dicatat, yaitu penduduk masuk, penduduk keluar, kelahiran, dan kematian.

Tabel utama menampilkan nama penduduk beserta NIK, jenis mutasi yang ditandai dengan label berwarna, tanggal mutasi, asal atau tujuan, alasan, serta tombol untuk mengubah atau menghapus data. Terdapat pula kolom pencarian dan penyaring berdasarkan jenis mutasi.

### Formulir Tambah dan Ubah Mutasi

Formulir berisi kolom untuk memilih penduduk dari daftar yang tersedia, memilih jenis mutasi, menentukan tanggal mutasi, dan mengisi keterangan tambahan. Kolom asal atau tujuan hanya muncul apabila jenis mutasi yang dipilih adalah "masuk" atau "keluar". Apabila jenis mutasi adalah "masuk", kolom akan bertuliskan "Asal". Apabila "keluar", kolom akan bertuliskan "Tujuan".

---

## 15. Pengajuan Masuk

Halaman pengajuan masuk digunakan oleh staf untuk mengelola seluruh pengajuan surat yang dikirimkan oleh warga. Staf dapat melihat daftar pengajuan, memperbarui status pengajuan, mengubah data pengajuan, serta menghapus pengajuan.

Pada bagian atas, terdapat kolom pencarian dan dua penyaring berdasarkan status pengajuan (Menunggu, Diproses, Selesai, atau Ditolak) dan berdasarkan jenis surat. Tabel utama menampilkan nama pemohon beserta NIK, jenis surat, keperluan, status pengajuan yang ditandai dengan label berwarna, tanggal pengajuan, dan tombol-tombol tindakan.

### Jendela Perbarui Status

Saat staf menekan tombol perbarui status, muncul jendela yang menampilkan ringkasan pengajuan beserta daftar berkas persyaratan yang telah diunggah oleh warga. Staf dapat membuka berkas-berkas tersebut untuk diperiksa. Selanjutnya, staf dapat mengubah status pengajuan menjadi Menunggu, Diproses, Selesai, atau Ditolak serta menambahkan catatan untuk pemohon.

### Formulir Buat dan Ubah Pengajuan

Staf juga dapat membuat pengajuan secara langsung atas nama warga. Formulir berisi kolom untuk memilih penduduk, memilih jenis surat, mengisi keperluan, dan menambahkan keterangan tambahan.

---

## 16. Surat

Halaman surat digunakan oleh staf untuk membuat, menerbitkan, membatalkan, dan mencetak surat resmi kelurahan. Surat yang telah diterbitkan dapat dicetak dalam bentuk PDF.

Tabel utama menampilkan nomor surat, jenis surat, nama penduduk yang bersangkutan, perihal surat, tanggal, status surat, dan tombol-tombol tindakan. Tindakan yang tersedia berbeda-beda tergantung pada status surat:

- Surat berstatus **Draf** dapat diterbitkan, diubah, atau dihapus.
- Surat berstatus **Diterbitkan** dapat dicetak dalam bentuk PDF atau dibatalkan.
- Surat berstatus **Dibatalkan** tidak tersedia tindakan apa pun.

### Formulir Buat dan Ubah Surat

Formulir terdiri dari tiga bagian, yaitu identitas surat (jenis surat, tanggal surat, dan perihal), penduduk yang bersangkutan (dipilih dari daftar), serta keterangan dan penandatangan (keterangan tambahan, nama penandatangan, dan jabatan penandatangan).

---

## 17. Jenis Surat

Halaman jenis surat digunakan oleh staf untuk mengelola daftar jenis-jenis surat yang tersedia di kelurahan. Setiap jenis surat memiliki kode unik, nama, deskripsi, urutan tampilan, status aktif, dan keterangan apakah jenis surat tersebut dapat diajukan oleh warga secara daring.

Tabel utama menampilkan kode surat, nama jenis surat, deskripsi, urutan tampilan, status aktif, keterangan dapat diajukan oleh warga, dan tombol-tombol tindakan. Setiap baris data dilengkapi tombol untuk mengaktifkan atau menonaktifkan jenis surat, mengubah data, dan menghapus data.

### Formulir Tambah dan Ubah

Formulir terdiri dari dua bagian, yaitu identitas (kode surat, urutan tampilan, nama jenis surat, dan deskripsi) serta pengaturan (kotak centang untuk menentukan apakah jenis surat aktif dan apakah jenis surat dapat diajukan oleh warga).

---

## 18. Persyaratan Surat

Halaman persyaratan surat digunakan oleh staf untuk mengelola daftar berkas yang harus dilampirkan oleh warga saat mengajukan surat. Setiap persyaratan terkait dengan jenis surat tertentu.

Pada bagian atas, terdapat penyaring berdasarkan jenis surat. Tabel menampilkan nama persyaratan, jenis berkas yang diterima (gambar, PDF, atau dokumen), keterangan wajib atau opsional, dan urutan tampilan.

### Formulir Tambah dan Ubah

Formulir berisi nama persyaratan, jenis berkas yang diterima, kotak centang untuk menandai apakah persyaratan wajib atau opsional, keterangan tambahan, dan urutan tampilan.

---

## 19. Laporan

Halaman laporan menyajikan data statistik kependudukan dan layanan surat dalam satu tampian yang lengkap. Halaman ini hanya dapat dibaca dan tidak memiliki fungsi untuk menambah atau mengubah data.

Pada bagian atas, terdapat penyaring berdasarkan tahun. Di bawahnya, terdapat empat ringkasan yang menampilkan jumlah total penduduk, jumlah kartu keluarga, jumlah surat yang diterbitkan pada tahun yang dipilih, dan jumlah pengajuan pada tahun yang dipilih.

Bagian selanjutnya menyajikan berbagai informasi statistik yang terdiri dari demografi penduduk (jenis kelamin dan status), distribusi usia, pendidikan terakhir, sepuluh jenis pekerjaan terbanyak, statistik kartu keluarga, surat yang diterbitkan berdasarkan jenis, pengajuan berdasarkan status dan jenis, tren bulanan dalam bentuk tabel per bulan, serta mutasi penduduk (masuk, keluar, lahir, dan meninggal).

---

## 20. Berita (Staf)

Halaman berita digunakan oleh staf untuk mengelola informasi berita yang akan ditampilkan di halaman publik. Staf dapat menambah, mengubah, melihat, dan menghapus berita, serta mengatur apakah suatu berita sudah diterbitkan atau masih dalam bentuk konsep.

Tabel menampilkan judul berita, status publikasi, penulis, tanggal, dan tombol-tombol tindakan. Staf dapat membuat berita baru melalui halaman tersendiri.

### Formulir Tambah dan Ubah Berita

Formulir terdiri dari judul, alamat tautan (dibuat secara otomatis), ringkasan, gambar sampul, isi berita yang dapat diedit menggunakan perangkat penyunting teks, status publikasi, dan penjadwalan publikasi.

---

## 21. Kegiatan (Staf)

Halaman kegiatan digunakan oleh staf untuk mengelola informasi kegiatan yang akan ditampilkan di halaman publik. Staf dapat menambah, mengubah, melihat, dan menghapus kegiatan, serta mengatur apakah suatu kegiatan sudah diterbitkan atau masih dalam bentuk konsep.

Tabel menampilkan judul kegiatan, status publikasi, penulis, tanggal, dan tombol-tombol tindakan. Staf dapat membuat kegiatan baru melalui halaman tersendiri.

### Formulir Tambah dan Ubah Kegiatan

Formulir terdiri dari judul, alamat tautan (dibuat secara otomatis), ringkasan, gambar sampul, isi kegiatan yang dapat diedit menggunakan perangkat penyunting teks, status publikasi, dan penjadwalan publikasi.

---

## 22. Pengumuman (Staf)

Halaman pengumuman digunakan oleh staf untuk mengelola informasi pengumuman yang akan ditampilkan di halaman publik. Staf dapat menambah, mengubah, melihat, dan menghapus pengumuman, serta mengatur apakah suatu pengumuman sudah diterbitkan atau masih dalam bentuk konsep.

Tabel menampilkan judul pengumuman, status publikasi, penulis, tanggal, dan tombol-tombol tindakan. Staf dapat membuat pengumuman baru melalui halaman tersendiri.

### Formulir Tambah dan Ubah Pengumuman

Formulir terdiri dari judul, alamat tautan (dibuat secara otomatis), ringkasan, gambar sampul, isi pengumuman yang dapat diedit menggunakan perangkat penyunting teks, status publikasi, dan penjadwalan publikasi.

---

## 23. Berita Video (Staf)

Halaman berita video digunakan oleh staf untuk mengelola informasi berita video yang akan ditampilkan di halaman publik. Staf dapat menambah, mengubah, melihat, dan menghapus berita video, serta mengatur apakah suatu berita video sudah diterbitkan atau masih dalam bentuk konsep.

Tabel menampilkan judul berita video, status publikasi, penulis, tanggal, dan tombol-tombol tindakan. Staf dapat membuat berita video baru melalui halaman tersendiri.

### Formulir Tambah dan Ubah Berita Video

Formulir terdiri dari judul, alamat tautan (dibuat secara otomatis), ringkasan, gambar sampul, isi berita video yang dapat diedit menggunakan perangkat penyunting teks, status publikasi, dan penjadwalan publikasi.

---

## 24. Artikel (Staf)

Halaman artikel digunakan oleh staf untuk mengelola informasi artikel yang akan ditampilkan di halaman publik. Staf dapat menambah, mengubah, melihat, dan menghapus artikel, serta mengatur apakah suatu artikel sudah diterbitkan atau masih dalam bentuk konsep.

Tabel menampilkan judul artikel, status publikasi, penulis, tanggal, dan tombol-tombol tindakan. Staf dapat membuat artikel baru melalui halaman tersendiri.

### Formulir Tambah dan Ubah Artikel

Formulir terdiri dari judul, alamat tautan (dibuat secara otomatis), ringkasan, gambar sampul, isi artikel yang dapat diedit menggunakan perangkat penyunting teks, status publikasi, dan penjadwalan publikasi.

---

## 25. Dashboard Warga

Dashboard warga adalah halaman utama yang muncul setelah warga berhasil masuk ke dalam aplikasi. Halaman ini menampilkan ucapan selamat datang beserta nama warga dan tiga ringkasan, yaitu jumlah total pengajuan surat, jumlah pengajuan yang sedang diproses, dan jumlah pengajuan yang sudah selesai.

Bagian data kependudukan menampilkan informasi pribadi warga berupa NIK, nama lengkap, tempat dan tanggal lahir, jenis kelamin, alamat lengkap beserta RT dan RW, nomor kartu keluarga, serta status penduduk dalam bentuk label berwarna. Apabila data kependudukan warga belum terhubung ke dalam sistem, akan muncul pesan yang menyarankan warga untuk menghubungi petugas kelurahan.

Di bagian bawah, terdapat daftar pengajuan terbaru yang menampilkan beberapa pengajuan surat terakhir beserta statusnya. Tersedia tautan untuk melihat seluruh riwayat pengajuan.

---

## 26. Pengajuan Surat (Warga)

Halaman pengajuan surat digunakan oleh warga untuk mengajukan permohonan surat secara daring. Warga dapat memilih jenis surat yang diinginkan, mengunggah berkas persyaratan, dan mengirimkan pengajuan tanpa perlu datang ke kantor kelurahan.

Formulir pengajuan dimulai dengan memilih jenis surat dari daftar yang tersedia. Setelah jenis surat dipilih, sistem akan menampilkan daftar berkas persyaratan yang harus diunggah. Setiap persyaratan dilengkapi keterangan jenis berkas yang diterima, seperti gambar, PDF, atau dokumen, serta tanda apakah persyaratan tersebut wajib atau opsional.

Selanjutnya, warga mengisi kolom keperluan untuk menjelaskan alasan pengajuan surat serta kolom keterangan tambahan yang bersifat tidak wajib. Warga menekan tombol "Ajukan Surat" untuk mengirimkan pengajuan. Apabila ada persyaratan wajib yang belum diunggah atau kolom wajib yang belum diisi, sistem akan menampilkan pesan peringatan.

---

## 27. Riwayat Pengajuan (Warga)

Halaman riwayat pengajuan menampilkan seluruh pengajuan surat yang pernah diajukan oleh warga. Warga dapat melihat perkembangan status pengajuan, melihat rincian pengajuan, serta menghapus pengajuan yang masih berstatus menunggu atau ditolak.

Tabel riwayat menampilkan jenis surat beserta catatan dari staf (jika ada), keperluan, status pengajuan yang ditandai dengan label berwarna, tanggal pengajuan, serta tombol-tombol tindakan. Status pengajuan dibedakan dengan empat warna, yaitu kuning untuk menunggu, biru untuk diproses, hijau untuk selesai, dan merah untuk ditolak.

### Jendela Rincian

Saat warga menekan tombol lihat rincian, muncul jendela yang menampilkan informasi lengkap pengajuan, yaitu jenis surat, keperluan, keterangan tambahan, tanggal diajukan dan tanggal diproses, daftar berkas yang telah diunggah beserta tautan untuk membuka berkas tersebut, dan catatan dari staf apabila ada.

Terdapat pula pesan yang berbeda sesuai dengan status pengajuan:
- **Menunggu**: Pesan bahwa pengajuan sedang menunggu untuk ditinjau oleh petugas.
- **Diproses**: Pesan bahwa pengajuan sedang dalam proses penanganan.
- **Selesai**: Pesan bahwa surat sudah selesai, disertai tombol cetak apabila surat sudah diterbitkan.
- **Ditolak**: Pesan bahwa pengajuan ditolak beserta alasan penolakan.

### Jendela Hapus

Saat warga menekan tombol hapus, muncul jendela konfirmasi yang menampilkan nama jenis surat yang akan dihapus beserta peringatan bahwa berkas yang telah diunggah juga akan ikut terhapus. Penghapusan hanya dapat dilakukan untuk pengajuan yang berstatus menunggu atau ditolak.

---

## 28. Kata Sandi

Halaman ini digunakan untuk mengubah kata sandi akun. Pengguna harus mengisi kata sandi lama, kata sandi baru, dan konfirmasi kata sandi baru, kemudian menekan tombol "Perbarui Kata Sandi" untuk menyimpan perubahan.

---

## 29. Tampilan

Halaman ini memungkinkan pengguna untuk memilih tema tampilan aplikasi. Tersedia tiga pilihan, yaitu Terang (tema dengan warna cerah), Gelap (tema dengan warna gelap yang nyaman di mata), atau Sistem (mengikuti pengaturan tema dari perangkat yang digunakan). Tema baru akan langsung diterapkan setelah dipilih.

---

## 30. Autentikasi Dua Faktor

Halaman ini menyediakan fitur keamanan tambahan berupa verifikasi dua langkah. Apabila fitur ini diaktifkan, pengguna akan diminta untuk memasukkan kode keamanan dari aplikasi autentikasi di telepon genggam setiap kali akan masuk ke dalam sistem. Halaman ini menampilkan status apakah fitur autentikasi dua faktor sedang aktif atau tidak, tombol untuk mengaktifkan, tautan untuk melihat kode batang dan kode pemulihan cadangan, serta opsi untuk menonaktifkan fitur tersebut.

---

## 31. Cetak Surat

Halaman cetak surat menghasilkan dokumen surat resmi dalam bentuk PDF yang siap dicetak. Halaman ini dapat diakses oleh staf melalui halaman surat (tombol cetak pada surat berstatus diterbitkan) maupun oleh warga melalui halaman riwayat pengajuan (untuk surat yang sudah selesai).

Dokumen PDF yang dihasilkan mengikuti format surat resmi kelurahan yang memuat kop surat dengan logo dan nama instansi, nomor surat, perihal surat, data penduduk yang bersangkutan, isi surat sesuai dengan jenis yang diminta, tempat dan tanggal surat, serta nama dan jabatan penandatangan.

---

## Catatan Umum Tampilan

### Penyesuaian Ukuran Layar

Seluruh halaman pada aplikasi Gealin dirancang agar dapat digunakan dengan nyaman di berbagai ukuran layar, mulai dari telepon genggam hingga komputer. Pada layar yang lebih kecil, menu samping akan tersembunyi dan dapat dibuka melalui tombol di pojok kiri atas. Beberapa informasi pada tabel yang kurang penting akan disembunyikan pada layar kecil agar tabel tetap mudah dibaca.

### Pencarian dan Penyaringan

Seluruh halaman yang menampilkan tabel data dilengkapi dengan fasilitas pencarian yang berjalan secara otomatis saat pengguna mengetik. Pada beberapa halaman, tersedia pula penyaring berdasarkan kategori tertentu, seperti status penduduk, jenis mutasi, status pengajuan, atau jenis surat. Penyaring dapat direset kapan saja untuk menampilkan seluruh data.

### Formulir dalam Jendela

Seluruh formulir untuk menambah, mengubah, atau menghapus data kependudukan dan layanan surat ditampilkan dalam jendela di atas halaman utama. Pengguna tidak perlu berpindah halaman untuk mengisi formulir tersebut. Adapun halaman untuk mengelola konten seperti Berita, Kegiatan, Pengumuman, Berita Video, dan Artikel menggunakan halaman tersendiri karena dilengkapi dengan perangkat penyunting teks.

### Warna Penanda Status

| Warna | Keterangan |
|-------|------------|
| **Hijau** | Status positif, seperti aktif, selesai, berhasil, atau tetap |
| **Kuning** | Status menunggu atau perlu perhatian |
| **Biru** | Status sedang dalam proses |
| **Merah** | Status negatif, seperti ditolak, dibatalkan, atau meninggal |

### Pemberitahuan

Setiap kali pengguna berhasil atau gagal melakukan suatu tindakan, sistem akan menampilkan pemberitahuan singkat di bagian atas halaman yang menginformasikan bahwa tindakan tersebut berhasil atau gagal dilakukan. Pemberitahuan berhasil ditandai dengan warna hijau, sedangkan pemberitahuan gagal ditandai dengan warna merah.

### Tema Tampilan

Aplikasi mendukung dua tema tampilan, yaitu tema terang dengan nuansa hijau dan tema gelap dengan nuansa alam. Pengguna dapat mengubah tema melalui halaman Tampilan pada menu pengaturan akun. Tersedia pula pilihan "Sistem" yang akan mengikuti pengaturan tema dari perangkat yang digunakan.
