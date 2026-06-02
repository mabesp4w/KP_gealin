<?php

namespace Database\Seeders;

use App\Models\Postingan;
use Illuminate\Database\Seeder;

class PostinganSeeder extends Seeder
{
    public function run(): void
    {
        $userId = 1;

        $postingan = [

            // ── BERITA (5) ─────────────────────────────────────
            [
                'user_id' => $userId,
                'kategori' => 'berita',
                'judul' => 'Kegiatan Bakti Sosial RW 03 Berjalan Lancar',
                'ringkasan' => 'Bakti sosial di RW 03 meliputi pembagian sembako dan pelayanan kesehatan gratis bagi warga kurang mampu.',
                'isi' => '<h2>Kegiatan Bakti Sosial RW 03</h2><p>Pada hari Minggu, 12 Mei 2026, Kelurahan Ardipura mengadakan kegiatan bakti sosial di RW 03. Kegiatan ini berlangsung dari pukul 08.00 hingga 14.00 WIT dan dihadiri oleh <strong>Lurah Ardipura</strong> beserta jajaran perangkat kelurahan.</p><h3>Rangkaian Kegiatan</h3><ul><li>Pembagian 200 paket sembako untuk warga kurang mampu</li><li>Pelayanan kesehatan gratis (cek gula darah, tekanan darah, dan kolesterol)</li><li>Layanan sunatan massal untuk 30 anak</li><li>Bazar murah bahan pokok</li></ul><p>Warga sangat antusias mengikuti kegiatan ini. "Semoga kegiatan seperti ini rutin dilaksanakan," ujar Ibu Maria, salah satu warga RW 03.</p>',
                'is_published' => true,
                'published_at' => '2026-05-12 10:00:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'berita',
                'judul' => 'Pembangunan Drainase Jalan Boswezen Rampung',
                'ringkasan' => 'Pembangunan drainase sepanjang 500 meter telah selesai, mengatasi banjir langganan di kawasan tersebut.',
                'isi' => '<h2>Drainase Jalan Boswezen Selesai Dibangun</h2><p>Pemerintah Kelurahan Ardipura bersama Dinas Pekerjaan Umum Kota Jayapura telah merampungkan pembangunan drainase di Jalan Boswezen. Proyek yang memakan waktu 3 bulan ini bertujuan mengatasi genangan air yang sering terjadi saat hujan deras.</p><h3>Spesifikasi Pembangunan</h3><ul><li>Panjang drainase: 500 meter</li><li>Lebar: 60 cm</li><li>Kedalaman: 80 cm</li><li>Material: Beton bertulang</li></ul><p>Lurah Ardipura berharap pembangunan ini dapat memberikan kenyamanan bagi warga yang melintas dan bermukim di sekitar Jalan Boswezen.</p>',
                'is_published' => true,
                'published_at' => '2026-05-08 09:30:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'berita',
                'judul' => 'Posyandu Melati Gelar Imunisasi Campak',
                'ringkasan' => 'Posyandu Melati mengadakan imunisasi campak untuk balita se-Kelurahan Ardipura.',
                'isi' => '<h2>Imunisasi Campak di Posyandu Melati</h2><p>Posyandu Melati Kelurahan Ardipura menggelar imunisasi campak bagi balita pada Rabu, 24 April 2026. Kegiatan ini merupakan bagian dari program <em>Bulan Imunisasi Anak Nasional</em>.</p><p>Sebanyak 85 balita telah mengikuti imunisasi. Kegiatan ini didukung oleh Puskesmas Ardipura dan kader posyandu setempat.</p><h3>Jadwal Posyandu Selanjutnya</h3><ul><li>Posyandu Melati: Setiap Rabu, pukul 09.00–12.00 WIT</li><li>Posyandu Mawar: Setiap Kamis, pukul 09.00–12.00 WIT</li></ul>',
                'is_published' => true,
                'published_at' => '2026-04-25 08:00:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'berita',
                'judul' => 'Pelatihan UMKM bagi Ibu Rumah Tangga',
                'ringkasan' => 'Pelatihan pembuatan kerajinan tangan dan makanan ringan diikuti 50 ibu rumah tangga se-Ardipura.',
                'isi' => '<h2>Pelatihan UMKM: Tingkatkan Ekonomi Keluarga</h2><p>Kelurahan Ardipura bekerja sama dengan Dinas Koperasi dan UMKM Kota Jayapura mengadakan pelatihan keterampilan bagi ibu rumah tangga. Acara berlangsung di Aula Kantor Kelurahan pada 10–11 April 2026.</p><h3>Materi Pelatihan</h3><ol><li><strong>Hari 1:</strong> Pembuatan kerajinan tangan dari bahan daur ulang</li><li><strong>Hari 2:</strong> Teknik pengolahan makanan ringan dan pengemasan</li></ol><p>Setiap peserta mendapatkan modal awal Rp500.000 untuk memulai usaha. Diharapkan pelatihan ini dapat mendorong kemandirian ekonomi keluarga.</p>',
                'is_published' => true,
                'published_at' => '2026-04-12 07:45:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'berita',
                'judul' => 'Lomba 17 Agustusan Tingkat RW Digelar',
                'ringkasan' => 'Perayaan HUT RI ke-81 di Ardipura dimeriahkan dengan berbagai lomba antar RW.',
                'isi' => '<h2>Semarak HUT RI ke-81 di Ardipura</h2><p>Dalam rangka memperingati Hari Kemerdekaan Republik Indonesia ke-81, Kelurahan Ardipura menggelar berbagai perlombaan antar RW pada 16–17 Agustus 2026.</p><h3>Daftar Lomba</h3><ul><li>Lomba balap karung</li><li>Panjat pinang</li><li>Lomba makan kerupuk</li><li>Tarik tambang</li><li>Kostum kemerdekaan terbaik</li></ul><p>Pemenang lomba akan mendapatkan hadiah berupa uang tunai, sembako, dan piagam penghargaan yang akan diserahkan langsung oleh Lurah Ardipura pada upacara kemerdekaan.</p>',
                'is_published' => true,
                'published_at' => '2026-08-18 10:00:00',
            ],

            // ── KEGIATAN (5) ───────────────────────────────────
            [
                'user_id' => $userId,
                'kategori' => 'kegiatan',
                'judul' => 'Rapat Koordinasi Pembangunan Kelurahan',
                'ringkasan' => 'Rapat koordinasi triwulan antara perangkat kelurahan dan ketua RW membahas program pembangunan.',
                'isi' => '<h2>Rapat Koordinasi Pembangunan Triwulan III</h2><p>Bertempat di Aula Kantor Kelurahan Ardipura, rapat koordinasi pembangunan triwulan III Tahun 2026 dilaksanakan pada Senin, 5 Juni 2026. Rapat dihadiri oleh Lurah, sekretaris kelurahan, serta 12 ketua RW se-Ardipura.</p><h3>Agenda Rapat</h3><ol><li>Evaluasi program pembangunan triwulan sebelumnya</li><li>Perencanaan perbaikan jalan lingkungan di RW 05 dan RW 07</li><li>Program penghijauan dan kebersihan lingkungan</li><li>Pembahasan anggaran kegiatan HUT RI ke-81</li></ol><p>Hasil rapat akan ditindaklanjuti oleh masing-masing seksi terkait dalam waktu 1 minggu ke depan.</p>',
                'tanggal_kegiatan' => '2026-06-05',
                'lokasi' => 'Aula Kantor Kelurahan Ardipura',
                'is_published' => true,
                'published_at' => '2026-06-01 08:00:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'kegiatan',
                'judul' => 'Gotong Royong Bersihkan Saluran Air',
                'ringkasan' => 'Warga RW 02 bergotong royong membersihkan saluran air menjelang musim hujan.',
                'isi' => '<h2>Gotong Royong RW 02</h2><p>Menjelang musim hujan, warga RW 02 Kelurahan Ardipura melaksanakan gotong royong pembersihan saluran air pada Minggu, 21 Mei 2026. Kegiatan dimulai pukul 06.30 WIT dan diikuti oleh sekitar 70 warga.</p><h3>Hasil Kegiatan</h3><ul><li>Saluran air sepanjang 800 meter berhasil dibersihkan</li><li>10 kubik sampah lumpur dan ranting berhasil diangkut</li><li>3 titik sumbatan parah berhasil diatasi</li></ul><p>Lurah Ardipura mengapresiasi partisipasi aktif warga. "Gotong royong adalah budaya kita yang harus terus dilestarikan," ujarnya.</p>',
                'tanggal_kegiatan' => '2026-05-21',
                'lokasi' => 'RW 02 Kelurahan Ardipura',
                'is_published' => true,
                'published_at' => '2026-05-20 07:30:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'kegiatan',
                'judul' => 'Sosialisasi Bahaya Narkoba bagi Remaja',
                'ringkasan' => 'Sosialisasi narkoba digelar di SMP Negeri 2 Ardipura dengan narasumber dari BNN Kota Jayapura.',
                'isi' => '<h2>Sosialisasi Bahaya Narkoba</h2><p>Kelurahan Ardipura bekerja sama dengan Badan Narkotika Nasional (BNN) Kota Jayapura mengadakan sosialisasi bahaya narkoba bagi remaja. Kegiatan berlangsung di Aula SMP Negeri 2 Ardipura pada Kamis, 11 Mei 2026.</p><p>Acara diikuti oleh 150 siswa kelas VIII dan IX. Narasumber dari BNN menyampaikan materi mengenai jenis-jenis narkoba, dampak penyalahgunaan, dan cara menolak ajakan teman.</p><h3>Materi Sosialisasi</h3><ul><li>Pengenalan jenis narkoba dan dampaknya</li><li>Modus peredaran narkoba di kalangan remaja</li><li>Strategi menolak ajakan menggunakan narkoba</li><li>Sanksi hukum bagi pengguna dan pengedar</li></ul>',
                'tanggal_kegiatan' => '2026-05-11',
                'lokasi' => 'SMP Negeri 2 Ardipura',
                'is_published' => true,
                'published_at' => '2026-05-10 09:00:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'kegiatan',
                'judul' => 'Pelayanan KB Keliling',
                'ringkasan' => 'Pelayanan KB keliling diadakan di Posyandu Melati untuk akseptor KB baru dan lama.',
                'isi' => '<h2>Pelayanan KB Keliling</h2><p>Pemerintah Kelurahan Ardipura bekerja sama dengan Puskesmas Ardipura mengadakan pelayanan KB keliling pada Selasa, 25 April 2026 di Posyandu Melati. Layanan tersedia mulai pukul 09.00 hingga 15.00 WIT.</p><h3>Jenis Layanan</h3><ul><li>Konsultasi KB dan alat kontrasepsi</li><li>Pemasangan IUD dan implan</li><li>Pemberian pil KB dan suntik KB</li><li>Pemeriksaan kesehatan ibu</li></ul><p>Sebanyak 45 akseptor KB mengikuti kegiatan ini. Pelayanan KB keliling akan diadakan secara rutin setiap bulan di lokasi yang berbeda.</p>',
                'tanggal_kegiatan' => '2026-04-25',
                'lokasi' => 'Posyandu Melati',
                'is_published' => true,
                'published_at' => '2026-04-23 08:30:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'kegiatan',
                'judul' => 'Pelatihan Kader PKK Pembuatan Pupuk Organik',
                'ringkasan' => 'Kader PKK dilatih membuat pupuk organik dari sampah rumah tangga untuk mendukung program ketahanan pangan.',
                'isi' => '<h2>Pelatihan Pupuk Organik untuk Kader PKK</h2><p>TP PKK Kelurahan Ardipura menyelenggarakan pelatihan pembuatan pupuk organik bagi kader PKK dari 12 RW. Kegiatan berlangsung di Balai RW 06 pada Sabtu, 8 April 2026.</p><h3>Materi Pelatihan</h3><ol><li>Teknik pengomposan sederhana dari sampah dapur</li><li>Pembuatan pupuk cair dari limbah rumah tangga</li><li>Demonstrasi penggunaan pupuk organik pada tanaman</li></ol><p>Setiap peserta mendapatkan satu set alat pembuatan pupuk organik. Program ini diharapkan dapat mengurangi volume sampah rumah tangga sekaligus mendukung ketahanan pangan keluarga.</p>',
                'tanggal_kegiatan' => '2026-04-08',
                'lokasi' => 'Balai RW 06 Kelurahan Ardipura',
                'is_published' => true,
                'published_at' => '2026-04-06 07:00:00',
            ],

            // ── PENGUMUMAN (5) ─────────────────────────────────
            [
                'user_id' => $userId,
                'kategori' => 'pengumuman',
                'judul' => 'Pendaftaran BLT Dana Desa Tahap II',
                'ringkasan' => 'Pendaftaran Bantuan Langsung Tunai Dana Desa tahap II dibuka hingga 30 Juni 2026.',
                'isi' => '<h2>Pendaftaran BLT Dana Desa Tahap II Tahun 2026</h2><p>Diberitahukan kepada seluruh warga Kelurahan Ardipura bahwa pendaftaran Bantuan Langsung Tunai (BLT) Dana Desa tahap II Tahun 2026 telah dibuka.</p><h3>Ketentuan Pendaftaran</h3><ul><li>Warga miskin/rentan yang terdaftar di DTKS</li><li>Kehilangan pekerjaan akibat dampak ekonomi</li><li>Keluarga dengan anggota lansia, disabilitas, atau sakit kronis</li><li>Belum pernah menerima bantuan sosial lainnya</li></ul><h3>Persyaratan</h3><ol><li>Fotokopi KTP dan KK</li><li>Surat keterangan tidak mampu dari RT/RW</li><li>Mengisi formulir pendaftaran di kantor kelurahan</li></ol><p>Pendaftaran ditutup pada <strong>30 Juni 2026</strong>. Informasi lebih lanjut hubungi Kantor Kelurahan Ardipura.</p>',
                'is_published' => true,
                'published_at' => '2026-06-01 08:00:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'pengumuman',
                'judul' => 'Jadwal Vaksinasi Booster COVID-19',
                'ringkasan' => 'Vaksinasi booster untuk lansia dan masyarakat umum diadakan di Puskesmas Ardipura.',
                'isi' => '<h2>Vaksinasi Booster COVID-19</h2><p>Sehubungan dengan masih ditemukannya kasus COVID-19 varian baru, Pemerintah Kelurahan Ardipura bersama Puskesmas Ardipura mengadakan layanan vaksinasi booster.</p><h3>Jadwal Pelaksanaan</h3><ul><li><strong>Hari:</strong> Senin–Jumat</li><li><strong>Tanggal:</strong> 5–30 Juni 2026</li><li><strong>Waktu:</strong> 08.00–14.00 WIT</li><li><strong>Tempat:</strong> Puskesmas Ardipura</li></ul><h3>Sasaran</h3><ul><li>Lansia (usia 60 tahun ke atas)</li><li>Masyarakat umum usia 18 tahun ke atas (dosis ke-3)</li><li>Tenaga kesehatan dan pelayan publik</li></ul><p>Wajib membawa KTP dan kartu vaksin sebelumnya. Layanan gratis.</p>',
                'is_published' => true,
                'published_at' => '2026-06-03 09:00:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'pengumuman',
                'judul' => 'Pembayaran PBB-P2 Tahun 2026',
                'ringkasan' => 'Pembayaran Pajak Bumi dan Bangunan sektor P2 tahun 2026 telah dibuka di Kantor Kelurahan.',
                'isi' => '<h2>Pembayaran PBB-P2 Tahun 2026</h2><p>Diberitahukan kepada seluruh wajib pajak Kelurahan Ardipura bahwa pembayaran Pajak Bumi dan Bangunan sektor Pedesaan dan Perkotaan (PBB-P2) Tahun 2026 telah dibuka.</p><h3>Informasi Pembayaran</h3><ul><li><strong>Periode pembayaran:</strong> 1 Juni – 30 September 2026</li><li><strong>Tempat:</strong> Kantor Kelurahan Ardipura (loket pajak)</li><li><strong>Jam layanan:</strong> 08.00–15.00 WIT (hari kerja)</li></ul><p><em>Perhatian:</em> Pembayaran setelah 30 September 2026 akan dikenakan denda administrasi sebesar 2% per bulan. Hindari menumpuk di akhir bulan.</p>',
                'is_published' => true,
                'published_at' => '2026-06-02 08:30:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'pengumuman',
                'judul' => 'Penerimaan Calon Perangkat Kelurahan',
                'ringkasan' => 'Penerimaan calon perangkat kelurahan dibuka untuk 3 formasi. Pendaftaran hingga 15 Juli 2026.',
                'isi' => '<h2>Penerimaan Calon Perangkat Kelurahan Ardipura</h2><p>Pemerintah Kelurahan Ardipura membuka kesempatan bagi putra/putri terbaik untuk mengikuti seleksi penerimaan calon perangkat kelurahan.</p><h3>Formasi yang Dibutuhkan</h3><ol><li>Kepala Seksi Pemerintahan (1 orang)</li><li>Kepala Seksi Kesejahteraan (1 orang)</li><li>Staf Administrasi Umum (1 orang)</li></ol><h3>Persyaratan Umum</h3><ul><li>Warga Kelurahan Ardipura (dibuktikan dengan KTP)</li><li>Pendidikan minimal SLTA/sederajat</li><li>Usia 20–40 tahun</li><li>Sehat jasmani dan rohani</li><li>Tidak pernah terlibat tindak pidana</li></ul><p>Berkas dikirimkan ke Kantor Kelurahan Ardipura paling lambat <strong>15 Juli 2026</strong> pukul 15.00 WIT.</p>',
                'is_published' => true,
                'published_at' => '2026-06-15 08:00:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'pengumuman',
                'judul' => 'Pemutakhiran Data Warga Ardipura',
                'ringkasan' => 'Seluruh warga diminta memperbarui data kependudukan di kantor kelurahan mulai Juni 2026.',
                'isi' => '<h2>Pemutakhiran Data Kependudukan</h2><p>Dalam rangka mewujudkan data kependudukan yang akurat dan mutakhir, Kelurahan Ardipura mengadakan pemutakhiran data bagi seluruh warga.</p><h3>Jadwal Pemutakhiran</h3><ul><li><strong>Periode:</strong> 1 Juni – 31 Agustus 2026</li><li><strong>Waktu:</strong> 08.00–15.00 WIT (hari kerja)</li><li><strong>Tempat:</strong> Kantor Kelurahan Ardipura</li></ul><h3>Data yang Perlu Dibawa</h3><ul><li>KTP-el (asli dan fotokopi)</li><li>Kartu Keluarga (asli dan fotokopi)</li><li>Akta kelahiran (jika ada perubahan)</li><li>Ijazah terbaru (untuk update data pendidikan)</li><li>Surat nikah/cerai (jika ada perubahan status)</li></ul><p>Pemutakhiran data ini penting untuk pelayanan administrasi dan program pemerintah ke depannya.</p>',
                'is_published' => true,
                'published_at' => '2026-05-30 07:00:00',
            ],

            // ── BERITA VIDEO (5) ───────────────────────────────
            [
                'user_id' => $userId,
                'kategori' => 'berita_video',
                'judul' => 'Liputan Perayaan HUT Kota Jayapura',
                'ringkasan' => 'Video liputan perayaan HUT Kota Jayapura ke-116 yang digelar di Lapangan Upacara Kelurahan Ardipura.',
                'isi' => '<p>Warga Kelurahan Ardipura merayakan HUT Kota Jayapura ke-116 dengan penuh semangat. Berbagai kegiatan digelar mulai dari upacara bendera, pentas seni, hingga bazar kuliner khas Papua. Simak liputan lengkapnya dalam video berikut.</p>',
                'video_url' => 'https://www.youtube.com/watch?v=example1',
                'is_published' => true,
                'published_at' => '2026-03-15 10:00:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'berita_video',
                'judul' => 'Wawancara Lurah Mengenai Program Kerja 2026',
                'ringkasan' => 'Wawancara eksklusif dengan Lurah Ardipura mengenai program prioritas pembangunan tahun 2026.',
                'isi' => '<p>Dalam wawancara eksklusif ini, Lurah Ardipura memaparkan program prioritas pembangunan tahun 2026 yang meliputi perbaikan infrastruktur, pemberdayaan UMKM, dan peningkatan layanan publik. Banyak target ambisius yang dicanangkan untuk kemajuan kelurahan.</p>',
                'video_url' => 'https://www.youtube.com/watch?v=example2',
                'is_published' => true,
                'published_at' => '2026-01-20 09:00:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'berita_video',
                'judul' => 'Video Tutorial Pembuatan NPWZ (Online)',
                'ringkasan' => 'Tutorial lengkap cara pembuatan Nomor Pokok Wajib Zakat secara online untuk warga Ardipura.',
                'isi' => '<p>Kantor Urusan Agama (KUA) bekerja sama dengan Kelurahan Ardipura membuat video tutorial pembuatan Nomor Pokok Wajib Zakat (NPWZ) secara online. Video ini memandu warga langkah demi langkah mulai dari pendaftaran hingga mendapatkan NPWZ.</p>',
                'video_url' => 'https://www.youtube.com/watch?v=example3',
                'is_published' => true,
                'published_at' => '2026-04-10 08:30:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'berita_video',
                'judul' => 'Dokumentasi Pelatihan Kader Posyandu',
                'ringkasan' => 'Dokumentasi kegiatan pelatihan kader posyandu se-Ardipura di Aula Kantor Kelurahan.',
                'isi' => '<p>Dokumentasi lengkap pelatihan kader posyandu se-Kelurahan Ardipura yang digelar selama 2 hari. Pelatihan meliputi teknik penimbangan balita, pengisian KMS, dan deteksi dini gizi buruk. Kader posyandu dari 7 posyandu aktif mengikuti pelatihan ini.</p>',
                'video_url' => 'https://www.youtube.com/watch?v=example4',
                'is_published' => true,
                'published_at' => '2026-05-05 10:30:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'berita_video',
                'judul' => 'Senam Sehat Bersama Warga Ardipura',
                'ringkasan' => 'Kegiatan senam sehat rutin setiap Sabtu pagi di Lapangan Kelurahan Ardipura.',
                'isi' => '<p>Kegiatan senam sehat bersama warga Kelurahan Ardipura yang dilaksanakan setiap hari Sabtu pukul 06.30 WIT di Lapangan Kelurahan. Dipandu oleh instruktur senam profesional, kegiatan ini diikuti oleh puluhan warga dari berbagai kalangan usia. Yuk, jaga kesehatan bersama!</p>',
                'video_url' => 'https://www.youtube.com/watch?v=example5',
                'is_published' => true,
                'published_at' => '2026-06-08 07:00:00',
            ],

            // ── ARTIKEL (5) ────────────────────────────────────
            [
                'user_id' => $userId,
                'kategori' => 'artikel',
                'judul' => 'Tips Menjaga Kebersihan Lingkungan di Musim Hujan',
                'ringkasan' => 'Artikel ini membahas langkah-langkah praktis menjaga kebersihan lingkungan saat musim hujan.',
                'isi' => '<h2>Tips Menjaga Kebersihan Lingkungan Saat Musim Hujan</h2><p>Musim hujan telah tiba. Selain membawa berkah, musim hujan juga membawa risiko penyakit jika lingkungan tidak dijaga kebersihannya. Berikut adalah beberapa tips yang bisa diterapkan:</p><h3>1. Bersihkan Saluran Air</h3><p>Pastikan saluran air di sekitar rumah tidak tersumbat daun atau sampah. Saluran yang tersumbat dapat menyebabkan genangan air yang menjadi sarang nyamuk.</p><h3>2. Buang Sampah pada Tempatnya</h3><p>Jangan membuang sampah sembarangan, terutama ke sungai atau saluran air. Sampah yang menumpuk dapat menyumbat aliran air dan menyebabkan banjir.</p><h3>3. Tanam Pohon di Sekitar Rumah</h3><p>Pohon membantu menyerap air hujan dan mencegah erosi tanah. Tanam pohon di halaman rumah atau ikut serta dalam program penghijauan lingkungan.</p><h3>4. Siapkan Perlengkapan Hujan</h3><p>Selalu siapkan payung, jas hujan, dan senter untuk berjaga-jaga saat hujan deras. Pastikan juga kondisi atap rumah dalam keadaan baik.</p>',
                'is_published' => true,
                'published_at' => '2026-05-15 08:00:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'artikel',
                'judul' => 'Pentingnya Imunisasi Dasar Lengkap bagi Balita',
                'ringkasan' => 'Imunisasi dasar lengkap sangat penting untuk melindungi balita dari penyakit berbahaya.',
                'isi' => '<h2>Pentingnya Imunisasi Dasar Lengkap bagi Balita</h2><p>Imunisasi adalah salah satu upaya pencegahan penyakit yang paling efektif dan efisien. Pemerintah Indonesia mewajibkan setiap anak untuk mendapatkan imunisasi dasar lengkap sebelum usia 2 tahun.</p><h3>Jenis Imunisasi Dasar</h3><ul><li><strong>Hepatitis B:</strong> diberikan 0–7 hari setelah lahir</li><li><strong>BCG:</strong> diberikan saat usia 1 bulan</li><li><strong>DPT-HB-Hib:</strong> diberikan pada usia 2, 3, dan 4 bulan</li><li><strong>Polio:</strong> diberikan 4 kali (usia 1, 2, 3, dan 4 bulan)</li><li><strong>Campak-Rubela:</strong> diberikan pada usia 9 bulan</li></ul><p><em>Catatan:</em> Imunisasi dapat diperoleh di Posyandu, Puskesmas, atau rumah sakit secara gratis melalui program pemerintah. Jangan lupa membawa buku KIA setiap kali imunisasi.</p>',
                'is_published' => true,
                'published_at' => '2026-04-20 07:30:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'artikel',
                'judul' => 'Mengenal Tanaman Obat Keluarga (TOGA)',
                'ringkasan' => 'TOGA adalah tanaman hasil budidaya yang bermanfaat sebagai obat tradisional untuk keluarga.',
                'isi' => '<h2>Mengenal Tanaman Obat Keluarga (TOGA)</h2><p>Tanaman Obat Keluarga (TOGA) merupakan tanaman hasil budidaya yang berkhasiat sebagai obat tradisional. TOGA mudah ditanam di pekarangan rumah dan sangat bermanfaat untuk menjaga kesehatan keluarga.</p><h3>Jenis Tanaman TOGA dan Manfaatnya</h3><ul><li><strong>Jahe:</strong> menghangatkan tubuh, mengatasi mual, dan masuk angin</li><li><strong>Kunyit:</strong> anti-inflamasi, melancarkan pencernaan</li><li><strong>Serai:</strong> menurunkan tekanan darah, mengatasi kecemasan</li><li><strong>Daun Sirih:</strong> antiseptik alami, mengatasi keputihan</li><li><strong>Lidah Buaya:</strong> menyembuhkan luka bakar, melembapkan kulit</li></ul><p>Mulailah menanam TOGA di pekarangan rumah Anda. Selain mempercantik halaman, TOGA juga menjadi apotek hidup yang siap digunakan kapan saja.</p>',
                'is_published' => true,
                'published_at' => '2026-03-10 07:00:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'artikel',
                'judul' => 'Cara Mengurus Surat Keterangan Domisili',
                'ringkasan' => 'Panduan lengkap prosedur pembuatan Surat Keterangan Domisili di Kelurahan Ardipura.',
                'isi' => '<h2>Cara Mengurus Surat Keterangan Domisili</h2><p>Surat Keterangan Domisili (SK Domisili) adalah surat yang menerangkan bahwa seseorang berdomisili di suatu wilayah. Berikut prosedur pembuatannya di Kelurahan Ardipura:</p><h3>Persyaratan</h3><ol><li>Fotokopi KTP Elektronik</li><li>Fotokopi Kartu Keluarga</li><li>Surat pengantar dari ketua RT dan RW setempat</li><li>Mengisi formulir permohonan</li></ol><h3>Prosedur</h3><ul><li>Datang ke Kantor Kelurahan Ardipura dengan membawa persyaratan</li><li>Ambil nomor antrean di loket pelayanan</li><li>Serahkan berkas ke petugas loket untuk diverifikasi</li><li>Surat dapat diambil pada hari yang sama (maksimal 1 jam kerja)</li></ul><p>Biaya pembuatan SK Domisili <strong>GRATIS</strong> (tidak dipungut biaya). Pelayanan: Senin–Kamis pukul 08.00–15.00 WIT, Jumat pukul 08.00–14.00 WIT.</p>',
                'is_published' => true,
                'published_at' => '2026-02-18 08:00:00',
            ],
            [
                'user_id' => $userId,
                'kategori' => 'artikel',
                'judul' => 'Manfaat Posyandu bagi Ibu dan Anak',
                'ringkasan' => 'Posyandu memberikan layanan kesehatan ibu hamil, balita, dan lansia secara gratis.',
                'isi' => '<h2>Manfaat Posyandu bagi Ibu dan Anak</h2><p>Pos Pelayanan Terpadu (Posyandu) merupakan fasilitas kesehatan berbasis masyarakat yang dikelola oleh kader bersama tenaga kesehatan. Posyandu memberikan berbagai manfaat bagi ibu dan anak.</p><h3>Layanan Posyandu</h3><ul><li>Penimbangan dan pengukuran tinggi balita</li><li>Pemantauan tumbuh kembang anak</li><li>Imunisasi dasar lengkap</li><li>Pemberian vitamin A dan makanan tambahan</li><li>Penyuluhan kesehatan ibu dan anak</li></ul><h3>Jadwal Posyandu di Ardipura</h3><ul><li><strong>Posyandu Melati:</strong> Rabu, pukul 09.00–12.00 WIT</li><li><strong>Posyandu Mawar:</strong> Kamis, pukul 09.00–12.00 WIT</li><li><strong>Posyandu Anggrek:</strong> Jumat, pukul 09.00–12.00 WIT</li></ul><p>Semua layanan Posyandu <strong>gratis</strong>. Ibu hamil dan balita sangat dianjurkan untuk rutin mengunjungi Posyandu.</p>',
                'is_published' => true,
                'published_at' => '2026-01-25 07:00:00',
            ],
        ];

        foreach ($postingan as $data) {
            Postingan::create($data);
        }
    }
}
