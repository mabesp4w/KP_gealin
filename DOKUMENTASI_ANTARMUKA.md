# Dokumentasi Antar Muka — Gealin

> Aplikasi Kependudukan Berbasis Web — Kelurahan Ardipura
>
> Dokumen ini menjelaskan tampilan dan fungsi setiap halaman pada aplikasi Gealin secara berurutan, mulai dari halaman masuk hingga seluruh fitur yang tersedia bagi Staf Kelurahan maupun Warga.

---

## Daftar Halaman

| No | Nama Halaman | Pengguna |
|----|--------------|----------|
| 1 | Halaman Masuk | Semua Pengguna |
| 2 | Beranda Staf | Staf Kelurahan |
| 3 | Data Penduduk | Staf Kelurahan |
| 4 | Kartu Keluarga | Staf Kelurahan |
| 5 | Mutasi Penduduk | Staf Kelurahan |
| 6 | Pengajuan Masuk | Staf Kelurahan |
| 7 | Kelola Surat | Staf Kelurahan |
| 8 | Jenis Surat | Staf Kelurahan |
| 9 | Persyaratan Surat | Staf Kelurahan |
| 10 | Laporan | Staf Kelurahan |
| 11 | Beranda Warga | Warga |
| 12 | Pengajuan Surat | Warga |
| 13 | Riwayat Pengajuan | Warga |
| 14 | Pengaturan Akun | Semua Pengguna |
| 15 | Cetak Surat | Staf / Warga |

---

## 1. Halaman Masuk

Halaman masuk adalah halaman pertama yang dilihat oleh pengguna saat membuka aplikasi. Halaman ini berfungsi sebagai gerbang utama untuk mengakses seluruh fitur aplikasi. Pengguna harus memasukkan alamat surel dan kata sandi yang telah terdaftar agar dapat masuk ke dalam sistem.

Tampilan halaman ini terbagi menjadi dua bagian. Pada sisi kiri, terdapat panel informasi yang menampilkan logo Kelurahan Ardipura beserta tiga keunggulan utama aplikasi, yaitu pengelolaan data kependudukan, pengajuan surat daring, dan statistik kependudukan. Panel ini hanya tampil pada layar lebar seperti komputer. Pada sisi kanan, terdapat formulir masuk yang selalu tampil di semua ukuran layar, termasuk telepon genggam.

Formulir masuk terdiri dari kolom isian surel, kolom isian kata sandi yang dilengkapi tombol untuk menampilkan atau menyembunyikan kata sandi, kotak centang "Ingat saya" agar pengguna tidak perlu masuk ulang, serta tombol "Masuk" untuk mengirimkan data. Apabila surel atau kata sandi salah, pesan kesalahan akan muncul di bawah kolom isian yang bersangkutan.

---

## 2. Beranda Staf

Beranda staf adalah halaman utama yang muncul setelah staf kelurahan berhasil masuk. Halaman ini menyajikan ringkasan seluruh data kependudukan dan aktivitas layanan surat dalam satu tampilan yang mudah dipahami.

Pada bagian atas, terdapat ucapan selamat datang beserta nama staf yang sedang menggunakan aplikasi dan tanggal hari ini. Di bawahnya, tersaji empat kotak ringkasan utama yang menampilkan jumlah total penduduk, jumlah kartu keluarga, jumlah surat yang diterbitkan pada bulan berjalan, dan jumlah pengajuan surat yang masih menunggu ditindaklanjuti.

Bagian selanjutnya menampilkan informasi yang lebih terperinci. Terdapat grafik perbandingan jumlah penduduk laki-laki dan perempuan, ringkasan mutasi penduduk bulan ini yang dibagi menjadi empat kategori (masuk, keluar, lahir, dan meninggal), ringkasan status penduduk (tetap, sementara, pindah, dan meninggal), serta ringkasan status pengajuan dan surat.

Di bagian bawah, terdapat dua tabel yang menampilkan daftar pengajuan surat terbaru dan daftar mutasi penduduk terbaru, sehingga staf dapat langsung mengetahui aktivitas yang baru terjadi.

### Navigasi Staf

Seluruh halaman staf menggunakan tata letak yang sama. Di sisi kiri terdapat menu samping yang memuat daftar seluruh fitur yang tersedia. Menu ini dikelompokkan menjadi tiga bagian: Data Kependudukan (Penduduk, Kartu Keluarga, Mutasi Penduduk), Layanan Surat (Pengajuan Masuk, Surat, Jenis Surat, Persyaratan Surat), dan Laporan. Di bagian atas terdapat bilah navigasi yang menampilkan nama halaman saat ini, nama pengguna, dan tombol keluar.

---

## 3. Data Penduduk

Halaman data penduduk digunakan oleh staf untuk mengelola seluruh data penduduk Kelurahan Ardipura. Staf dapat menambah penduduk baru, mengubah data yang sudah ada, melihat rincian data, serta menghapus data penduduk.

Pada bagian atas halaman, terdapat tombol "Tambah Penduduk" untuk menambahkan data penduduk baru. Di bawahnya, terdapat kotak pencarian yang memungkinkan staf mencari penduduk berdasarkan nama, NIK, atau informasi lainnya. Pencarian berjalan secara otomatis saat staf mengetik. Tersedia pula penyaring berdasarkan status penduduk (Tetap, Sementara, Pindah, atau Meninggal).

Data penduduk ditampilkan dalam bentuk tabel dengan kolom-kolom berupa nomor urut, Nomor Induk Kependudukan (NIK), nama lengkap beserta pekerjaan, jenis kelamin, alamat, nomor kartu keluarga, status penduduk, status akun, dan tombol-tombol tindakan. Setiap baris data dilengkapi tiga tombol: tombol mata untuk melihat rincian, tombol pensil untuk mengubah data, dan tombol tempat sampah untuk menghapus data. Apabila data terlalu banyak, tampilan tabel dibagi menjadi beberapa halaman yang dapat dinavigasi.

### Formulir Tambah dan Ubah Penduduk

Saat staf menekan tombol tambah atau ubah, muncul jendela formulir yang berisi kolom-kolom isian yang dikelompokkan menjadi beberapa bagian:

- **Identitas Utama**: NIK, nama lengkap, tempat lahir, tanggal lahir, jenis kelamin, dan agama.
- **Data Pribadi**: Status perkawinan, pendidikan terakhir, pekerjaan, kewarganegaraan, dan golongan darah.
- **Data Keluarga**: Hubungan dalam keluarga, kartu keluarga yang dipilih dari daftar, nama ayah, dan nama ibu.
- **Alamat**: Alamat lengkap, RT, dan RW.
- **Status dan Keterangan**: Status kependudukan, nomor telepon, tanggal masuk, dan catatan tambahan.
- **Akun Masuk** (hanya saat menambah baru): Pilihan untuk membuatkan akun masuk bagi penduduk tersebut, dengan mengisi surel dan kata sandi.

Seluruh kolom isian yang wajib diisi akan menampilkan pesan peringatan apabila dikosongkan.

### Jendela Rincian

Saat staf menekan tombol lihat rincian, muncul jendela yang menampilkan seluruh data penduduk dalam format baca saja. Apabila penduduk tersebut memiliki akun masuk, surel akun akan ditampilkan beserta tombol untuk mengatur ulang kata sandi.

### Jendela Hapus

Saat staf menekan tombol hapus, muncul jendela konfirmasi yang menampilkan nama dan NIK penduduk yang akan dihapus, disertai peringatan bahwa penghapusan bersifat permanen.

---

## 4. Kartu Keluarga

Halaman kartu keluarga digunakan oleh staf untuk mengelola data kartu keluarga. Staf dapat menambah, mengubah, melihat rincian, serta menghapus data kartu keluarga.

Tampilan utama berupa tabel yang menampilkan nomor kartu keluarga, nama kepala keluarga, alamat, RT/RW, jumlah anggota keluarga, dan tombol-tombol tindakan. Di atas tabel terdapat kotak pencarian dan tombol "Tambah KK".

### Formulir Tambah dan Ubah

Formulir terdiri dari dua bagian:

- **Identitas KK**: Nomor kartu keluarga (16 digit) dan tanggal dikeluarkan.
- **Alamat**: Alamat lengkap, RT, RW, kelurahan, kecamatan, kabupaten/kota, provinsi, dan kode pos.

### Jendela Rincian

Menampilkan seluruh informasi kartu keluarga beserta jumlah anggota yang terdaftar. Terdapat tombol untuk mengubah data kartu keluarga.

### Jendela Hapus

Menampilkan konfirmasi penghapusan. Apabila kartu keluarga masih memiliki anggota, sistem akan memberikan peringatan agar anggota dipindahkan atau dihapus terlebih dahulu.

---

## 5. Mutasi Penduduk

Halaman mutasi penduduk digunakan oleh staf untuk mencatat perpindahan atau perubahan status penduduk. Terdapat empat jenis mutasi yang dapat dicatat: penduduk masuk, penduduk keluar, kelahiran, dan kematian.

Pada bagian atas, terdapat kotak pencarian dan penyaring berdasarkan jenis mutasi. Tabel utama menampilkan nama penduduk beserta NIK, jenis mutasi yang ditandai dengan label berwarna, tanggal mutasi, asal atau tujuan, alasan, dan tombol-tombol tindakan untuk mengubah atau menghapus data.

### Formulir Tambah dan Ubah

Formulir berisi kolom isian untuk memilih penduduk dari daftar yang tersedia, memilih jenis mutasi, menentukan tanggal mutasi, serta mengisi keterangan tambahan. Kolom asal atau tujuan hanya muncul apabila jenis mutasi yang dipilih adalah "masuk" atau "keluar". Apabila jenis mutasi adalah "masuk", label kolom berubah menjadi "Asal"; apabila "keluar", label berubah menjadi "Tujuan".

---

## 6. Pengajuan Masuk

Halaman pengajuan masuk digunakan oleh staf untuk mengelola seluruh pengajuan surat yang dikirimkan oleh warga. Staf dapat melihat daftar pengajuan, memperbarui status pengajuan, mengubah data pengajuan, serta menghapus pengajuan.

Pada bagian atas, terdapat kotak pencarian dan dua penyaring: berdasarkan status pengajuan (Menunggu, Diproses, Selesai, atau Ditolak) dan berdasarkan jenis surat. Tabel utama menampilkan nama pemohon beserta NIK, jenis surat, keperluan, status pengajuan yang ditandai dengan label berwarna, tanggal pengajuan, dan tombol-tombol tindakan.

Setiap baris pengajuan memiliki tiga tombol tindakan: tombol untuk memperbarui status, tombol untuk mengubah data pengajuan, dan tombol untuk menghapus pengajuan.

### Jendela Perbarui Status

Saat staf menekan tombol perbarui status, muncul jendela yang menampilkan ringkasan pengajuan (nama pemohon, jenis surat, dan keperluan). Apabila warga mengunggah berkas persyaratan, daftar berkas tersebut ditampilkan dan dapat dibuka untuk diperiksa. Staf kemudian dapat mengubah status pengajuan menjadi Menunggu, Diproses, Selesai, atau Ditolak, serta menambahkan catatan untuk pemohon.

### Formulir Buat dan Ubah Pengajuan

Staf juga dapat membuat pengajuan secara langsung atas nama warga. Formulir berisi kolom untuk memilih penduduk, memilih jenis surat, mengisi keperluan, dan menambahkan keterangan tambahan.

---

## 7. Kelola Surat

Halaman kelola surat digunakan oleh staf untuk membuat, menerbitkan, membatalkan, dan mencetak surat resmi kelurahan. Surat yang dibuat di halaman ini merupakan dokumen resmi yang dapat dicetak dalam format PDF.

Pada bagian atas, terdapat kotak pencarian dan dua penyaring: berdasarkan status surat (Draf, Diterbitkan, atau Dibatalkan) dan berdasarkan jenis surat. Tabel utama menampilkan nomor surat, jenis surat, nama penduduk yang bersangkutan, perihal surat, tanggal, status surat, dan tombol-tombol tindakan.

Tombol tindakan yang tersedia berbeda-beda tergantung status surat:

- **Surat berstatus Draf**: Dapat diterbitkan, diubah, atau dihapus.
- **Surat berstatus Diterbitkan**: Dapat dicetak dalam format PDF atau dibatalkan.
- **Surat berstatus Dibatalkan**: Tidak ada tindakan yang tersedia.

### Formulir Buat dan Ubah Surat

Formulir terdiri dari tiga bagian:

- **Identitas Surat**: Jenis surat, tanggal surat, dan perihal surat.
- **Penduduk**: Memilih penduduk yang bersangkutan dari daftar.
- **Keterangan dan Penandatangan**: Keterangan tambahan, nama penandatangan, dan jabatan penandatangan.

### Jendela Konfirmasi

Terdapat jendela konfirmasi terpisah untuk tindakan menerbitkan, membatalkan, dan menghapus surat, masing-masing dilengkapi pesan peringatan yang sesuai.

---

## 8. Jenis Surat

Halaman jenis surat digunakan oleh staf untuk mengelola daftar jenis-jenis surat yang tersedia di kelurahan. Setiap jenis surat memiliki kode unik, nama, dan pengaturan apakah jenis surat tersebut aktif serta apakah warga dapat mengajukannya secara daring.

Tabel utama menampilkan kode surat, nama jenis surat, deskripsi, urutan tampil, status aktif atau nonaktif, keterangan apakah dapat diajukan oleh warga, dan tombol-tombol tindakan. Setiap baris data dilengkapi tombol untuk mengaktifkan atau menonaktifkan jenis surat, tombol untuk mengubah data, dan tombol untuk menghapus.

### Formulir Tambah dan Ubah

Formulir terdiri dari dua bagian:

- **Identitas**: Kode surat, urutan tampil, nama jenis surat, dan deskripsi.
- **Pengaturan**: Kotak centang untuk menentukan apakah jenis surat aktif dan apakah jenis surat dapat diajukan oleh warga secara daring.

---

## 9. Persyaratan Surat

Halaman persyaratan surat digunakan oleh staf untuk mengelola daftar berkas yang harus dilampirkan oleh warga saat mengajukan surat. Setiap persyaratan terkait dengan jenis surat tertentu.

Pada bagian atas, terdapat penyaring berdasarkan jenis surat untuk melihat persyaratan dari jenis surat yang dipilih. Tabel menampilkan nama persyaratan, jenis berkas yang diterima, keterangan wajib atau opsional, dan urutan tampil.

### Formulir Tambah dan Ubah

Formulir berisi kolom isian untuk nama persyaratan, jenis berkas yang diterima (gambar, PDF, atau dokumen), kotak centang wajib atau tidak, keterangan tambahan, dan urutan tampil.

---

## 10. Laporan

Halaman laporan menyajikan seluruh data statistik kependudukan dan layanan surat dalam satu tampilan yang lengkap dan terstruktur. Halaman ini bersifat hanya baca dan tidak memiliki fungsi penambahan atau pengubahan data.

Pada bagian atas, terdapat penyaring berdasarkan tahun. Staf dapat memilih tahun yang ingin dilihat laporannya. Di bawah penyaring, terdapat empat kotak ringkasan yang menampilkan jumlah total penduduk, jumlah kartu keluarga, jumlah surat yang diterbitkan pada tahun yang dipilih, dan jumlah pengajuan pada tahun yang dipilih.

Bagian selanjutnya menyajikan berbagai informasi statistik yang dikelompokkan sebagai berikut:

- **Demografi Penduduk**: Perbandingan jumlah penduduk laki-laki dan perempuan, serta sebaran status penduduk.
- **Distribusi Usia**: Sebaran penduduk berdasarkan kelompok usia.
- **Pendidikan Terakhir**: Sebaran penduduk berdasarkan tingkat pendidikan.
- **Pekerjaan**: Sepuluh jenis pekerjaan terbanyak.
- **Statistik Kartu Keluarga**: Jumlah total kartu keluarga dan rata-rata jumlah anggota per kartu keluarga.
- **Surat per Jenis**: Jumlah surat yang diterbitkan berdasarkan jenis surat.
- **Pengajuan per Status dan Jenis**: Jumlah pengajuan berdasarkan status dan jenis surat.
- **Tren Bulanan**: Tabel yang menampilkan jumlah surat dan pengajuan per bulan selama satu tahun.
- **Mutasi Penduduk**: Jumlah mutasi berdasarkan jenis (masuk, keluar, lahir, meninggal).

---

## 11. Beranda Warga

Beranda warga adalah halaman utama yang muncul setelah warga berhasil masuk ke dalam aplikasi. Halaman ini menyajikan ringkasan data kependudukan pribadi dan aktivitas pengajuan surat.

Pada bagian atas, terdapat ucapan selamat datang beserta nama warga. Di bawahnya, tersaji tiga kotak ringkasan yang menampilkan jumlah total pengajuan surat, jumlah pengajuan yang sedang diproses, dan jumlah pengajuan yang sudah selesai.

Bagian data kependudukan menampilkan informasi pribadi warga dalam format tabel dua kolom, meliputi NIK, nama lengkap, tempat dan tanggal lahir, jenis kelamin, alamat lengkap beserta RT dan RW, nomor kartu keluarga, serta status penduduk. Apabila data kependudukan warga belum terhubung dengan sistem, akan muncul pesan yang menyarankan warga untuk menghubungi petugas kelurahan.

Di bagian bawah, terdapat tabel pengajuan terbaru yang menampilkan beberapa pengajuan surat terakhir beserta statusnya. Terdapat pula tautan untuk melihat seluruh riwayat pengajuan.

### Navigasi Warga

Seluruh halaman warga menggunakan tata letak yang sama. Di bagian atas terdapat bilah navigasi yang menampilkan logo kelurahan dan tombol keluar. Di sisi kiri terdapat menu samping yang memuat tiga pilihan: Beranda, Pengajuan Surat, dan Riwayat Pengajuan.

---

## 12. Pengajuan Surat

Halaman pengajuan surat digunakan oleh warga untuk mengajukan permohonan surat secara daring. Warga dapat memilih jenis surat yang diinginkan, mengunggah berkas persyaratan, dan mengirimkan pengajuan tanpa perlu datang ke kantor kelurahan.

Formulir pengajuan dimulai dengan memilih jenis surat dari daftar yang tersedia. Setelah jenis surat dipilih, sistem secara otomatis menampilkan daftar berkas persyaratan yang harus diunggah. Setiap persyaratan dilengkapi keterangan jenis berkas yang diterima (gambar, PDF, atau dokumen) serta tanda apakah persyaratan tersebut wajib atau opsional.

Selanjutnya, warga mengisi kolom keperluan untuk menjelaskan alasan pengajuan surat, serta kolom keterangan tambahan yang bersifat opsional. Di bagian bawah formulir, terdapat informasi bahwa pengajuan akan dibuat atas nama warga yang sedang masuk.

Warga menekan tombol "Ajukan Surat" untuk mengirimkan pengajuan. Apabila ada persyaratan wajib yang belum diunggah atau kolom wajib yang belum diisi, sistem akan menampilkan pesan peringatan.

Di bawah formulir, terdapat tabel referensi yang menampilkan seluruh jenis surat beserta daftar persyaratan dokumen yang dibutuhkan untuk setiap jenis surat. Tabel ini dapat dicari untuk memudahkan warga menemukan informasi yang dibutuhkan.

---

## 13. Riwayat Pengajuan

Halaman riwayat pengajuan menampilkan seluruh pengajuan surat yang pernah diajukan oleh warga. Warga dapat melihat perkembangan status pengajuan, melihat rincian pengajuan, serta menghapus pengajuan yang masih berstatus menunggu atau ditolak.

Tabel riwayat menampilkan jenis surat beserta catatan dari staf (jika ada), keperluan pengajuan, status pengajuan yang ditandai dengan label berwarna dan simbol, tanggal pengajuan, serta tombol-tombol tindakan. Terdapat empat warna status: kuning untuk menunggu, biru untuk sedang diproses, hijau untuk selesai, dan merah untuk ditolak.

### Jendela Rincian

Saat warga menekan tombol lihat rincian, muncul jendela yang menampilkan informasi lengkap pengajuan. Jendela ini berisi jenis surat, keperluan, keterangan tambahan, riwayat waktu (tanggal diajukan dan tanggal diproses), daftar berkas yang telah diunggah beserta tautan untuk membuka berkas tersebut, dan catatan dari staf apabila ada.

Di bagian bawah jendela rincian, terdapat pesan yang berbeda sesuai status pengajuan:

- **Menunggu**: Pesan bahwa pengajuan sedang menunggu ditinjau oleh petugas.
- **Diproses**: Pesan bahwa pengajuan sedang dalam proses penanganan.
- **Selesai**: Pesan bahwa surat sudah selesai, disertai tombol cetak apabila surat sudah diterbitkan.
- **Ditolak**: Pesan bahwa pengajuan ditolak beserta alasan penolakan.

### Jendela Hapus

Saat warga menekan tombol hapus, muncul jendela konfirmasi yang menampilkan nama jenis surat yang akan dihapus beserta peringatan bahwa berkas yang telah diunggah juga akan ikut terhapus. Penghapusan hanya dimungkinkan untuk pengajuan berstatus menunggu atau ditolak.

---

## 14. Pengaturan Akun

Halaman pengaturan akun tersedia bagi seluruh pengguna, baik staf maupun warga. Halaman ini terbagi menjadi empat bagian:

### 14a. Profil

Halaman profil digunakan untuk mengubah nama dan alamat surel pengguna. Pengguna mengisi kolom nama dan surel yang baru, kemudian menekan tombol "Simpan Profil" untuk menyimpan perubahan.

### 14b. Kata Sandi

Halaman kata sandi digunakan untuk mengubah kata sandi akun. Pengguna harus mengisi kata sandi lama, kata sandi baru, dan konfirmasi kata sandi baru. Tombol "Perbarui Kata Sandi" digunakan untuk menyimpan perubahan.

### 14c. Tampilan

Halaman tampilan memungkinkan pengguna memilih tema tampilan aplikasi. Tersedia tiga pilihan: Terang (warna cerah), Gelap (warna gelap yang nyaman untuk mata), dan Sistem (mengikuti pengaturan perangkat pengguna). Perubahan tema langsung diterapkan setelah dipilih.

### 14d. Keamanan Dua Langkah

Halaman ini menyediakan fitur keamanan tambahan berupa verifikasi dua langkah. Saat diaktifkan, pengguna akan diminta memasukkan kode keamanan tambahan dari aplikasi autentikasi di telepon genggam setiap kali masuk. Halaman ini menampilkan kode batang untuk dipindai menggunakan aplikasi autentikasi, kolom isian untuk memasukkan kode verifikasi, serta kode pemulihan cadangan yang dapat digunakan apabila telepon genggam tidak tersedia.

---

## 15. Cetak Surat

Halaman cetak surat menghasilkan dokumen surat resmi dalam format PDF yang siap dicetak. Halaman ini dapat diakses oleh staf melalui halaman kelola surat, maupun oleh warga melalui halaman riwayat pengajuan (untuk surat yang sudah selesai).

Dokumen PDF yang dihasilkan mengikuti format surat resmi kelurahan yang terdiri dari: kop surat dengan logo dan nama instansi, nomor surat, perihal surat, data penduduk yang bersangkutan (nama, NIK, tempat dan tanggal lahir, alamat, dan sebagainya), isi surat sesuai jenis yang diminta, tempat dan tanggal surat, serta nama dan jabatan penandatangan.

---

## Catatan Umum Tampilan

### Tampilan Responsif

Seluruh halaman pada aplikasi Gealin dirancang agar dapat digunakan dengan nyaman di berbagai ukuran layar, mulai dari telepon genggam, tablet, hingga komputer. Pada layar kecil, menu samping akan tersembunyi dan dapat dibuka melalui tombol menu di pojok kiri atas. Beberapa kolom tabel yang kurang penting juga akan disembunyikan pada layar kecil agar tabel tetap mudah dibaca.

### Pencarian dan Penyaringan

Seluruh halaman yang menampilkan tabel data dilengkapi fitur pencarian yang bekerja secara otomatis saat pengguna mengetik. Pada beberapa halaman, tersedia pula penyaring berdasarkan kategori tertentu, seperti status penduduk, jenis mutasi, status pengajuan, atau jenis surat. Penyaring dapat direset kapan saja untuk menampilkan seluruh data.

### Formulir dalam Jendela

Seluruh formulir untuk menambah, mengubah, atau menghapus data ditampilkan dalam jendela timbul di atas halaman utama. Pengguna tidak perlu berpindah halaman untuk mengisi formulir. Setiap kolom isian yang wajib diisi akan menampilkan pesan peringatan apabila dikosongkan atau diisi dengan format yang salah.

### Warna Penanda Status

Aplikasi menggunakan warna yang konsisten untuk menandai status pada seluruh halaman:

| Warna | Keterangan |
|-------|------------|
| **Hijau** | Status positif (aktif, selesai, berhasil) |
| **Kuning** | Status menunggu atau perlu perhatian |
| **Biru** | Status sedang dalam proses atau informasi |
| **Merah** | Status negatif (ditolak, dibatalkan, kesalahan) |

### Pemberitahuan

Setiap kali pengguna berhasil melakukan suatu tindakan (seperti menyimpan data atau menghapus data), sistem akan menampilkan pemberitahuan singkat di bagian atas halaman yang menginformasikan bahwa tindakan tersebut berhasil atau gagal dilakukan.

### Tema Tampilan

Aplikasi mendukung dua tema tampilan: tema terang dengan warna dasar putih dan hijau, serta tema gelap dengan warna dasar gelap yang nyaman untuk digunakan pada malam hari. Pengguna dapat mengubah tema melalui halaman pengaturan akun.
