<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Kartu Keluarga - Kelurahan Ardipura</title>
    <style>
        @page {
            margin: 1.5cm;
        }
        body {
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 1.5;
        }
        .kop {
            position: relative;
            text-align: center;
            border-bottom: 3px double #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .kop-logo {
            position: absolute;
            left: 0;
            top: 5px;
            width: 65px;
            height: auto;
        }
        .kop-text {
            text-align: center;
        }
        .kop h1 {
            font-size: 14pt;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
        }
        .kop h2 {
            font-size: 12pt;
            font-weight: bold;
            margin: 0;
        }
        .kop p {
            font-size: 10pt;
            margin: 2px 0;
        }
        .judul {
            text-align: center;
            margin: 20px 0;
        }
        .judul h2 {
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            text-decoration: underline;
            margin: 0;
        }
        .info {
            margin: 20px 0;
        }
        .info table {
            width: 100%;
            border-collapse: collapse;
        }
        .info td {
            padding: 4px 8px;
            vertical-align: top;
        }
        .info td.label {
            width: 30%;
        }
        .info td.value {
            width: 3%;
            text-align: center;
        }
        .info td.data {
            width: 67%;
        }
        .anggota {
            margin-top: 30px;
        }
        .anggota h3 {
            font-size: 12pt;
            text-align: center;
            text-decoration: underline;
            margin-bottom: 10px;
        }
        .anggota table {
            width: 100%;
            border-collapse: collapse;
        }
        .anggota th, .anggota td {
            border: 1px solid #000;
            padding: 6px 8px;
            text-align: left;
            font-size: 11pt;
        }
        .anggota th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
        }
        .anggota td.nik {
            font-family: "Courier New", monospace;
            font-size: 10pt;
        }
        .no-anggota {
            text-align: center !important;
        }
        .footer {
            margin-top: 30px;
        }
        .footer table {
            width: 100%;
        }
        .footer td {
            width: 50%;
            vertical-align: top;
        }
        .footer .mengetahui {
            text-align: center;
        }
        .footer .ttd {
            text-align: center;
        }
        .ttd-space {
            height: 80px;
        }
    </style>
</head>
<body>
    <div class="kop">
        @if(file_exists($logoPath))
        <img src="{{ $logoPath }}" alt="Logo Pemerintah Kota Jayapura" class="kop-logo">
        @endif
        <div class="kop-text">
            <h1>Pemerintah Kota Jayapura</h1>
            <h2>Kelurahan Ardipura</h2>
            <p>Jl. Dokter Soetomo No. 1, Jayapura Selatan</p>
            <p>Kota Jayapura, Papua</p>
        </div>
    </div>

    <div class="judul">
        <h2>Kartu Keluarga</h2>
        <p>Nomor: {{ $kk->nomor_kk }}</p>
    </div>

    <div class="info">
        <table>
            <tr>
                <td class="label">Nomor Kartu Keluarga</td>
                <td class="value">:</td>
                <td class="data"><strong>{{ $kk->nomor_kk }}</strong></td>
            </tr>
            @if($kk->tanggal_dikeluarkan)
            <tr>
                <td class="label">Tanggal Dikeluarkan</td>
                <td class="value">:</td>
                <td class="data">{{ \Carbon\Carbon::parse($kk->tanggal_dikeluarkan)->locale('id')->translatedFormat('d F Y') }}</td>
            </tr>
            @endif
            <tr>
                <td class="label">Alamat</td>
                <td class="value">:</td>
                <td class="data">{{ $kk->alamat }}</td>
            </tr>
            <tr>
                <td class="label">RT / RW</td>
                <td class="value">:</td>
                <td class="data">{{ $kk->rt }} / {{ $kk->rw }}</td>
            </tr>
            <tr>
                <td class="label">Kelurahan / Desa</td>
                <td class="value">:</td>
                <td class="data">{{ $kk->kelurahan ?? 'Ardipura' }}</td>
            </tr>
            <tr>
                <td class="label">Kecamatan</td>
                <td class="value">:</td>
                <td class="data">{{ $kk->kecamatan ?? 'Jayapura Selatan' }}</td>
            </tr>
            <tr>
                <td class="label">Kabupaten / Kota</td>
                <td class="value">:</td>
                <td class="data">{{ $kk->kabupaten_kota ?? 'Kota Jayapura' }}</td>
            </tr>
            <tr>
                <td class="label">Provinsi</td>
                <td class="value">:</td>
                <td class="data">{{ $kk->provinsi ?? 'Papua' }}</td>
            </tr>
            @if($kk->kode_pos)
            <tr>
                <td class="label">Kode Pos</td>
                <td class="value">:</td>
                <td class="data">{{ $kk->kode_pos }}</td>
            </tr>
            @endif
        </table>
    </div>

    <div class="anggota">
        <h3>Daftar Anggota Keluarga</h3>
        <table>
            <thead>
                <tr>
                    <th width="5%">No</th>
                    <th width="18%">NIK</th>
                    <th width="30%">Nama Lengkap</th>
                    <th width="10%">JK</th>
                    <th width="12%">Tempat Lahir</th>
                    <th width="12%">Tanggal Lahir</th>
                    <th width="13%">Status Hubungan</th>
                </tr>
            </thead>
            <tbody>
                @forelse($kk->anggota as $index => $anggota)
                <tr>
                    <td class="no-anggota">{{ $index + 1 }}</td>
                    <td class="nik">{{ $anggota->nik ?? '-' }}</td>
                    <td>{{ $anggota->nama_lengkap ?? '-' }}</td>
                    <td class="no-anggota">{{ $anggota->jenis_kelamin === 'L' ? 'L' : 'P' }}</td>
                    <td>{{ $anggota->tempat_lahir ?? '-' }}</td>
                    <td>{{ $anggota->tanggal_lahir ? \Carbon\Carbon::parse($anggota->tanggal_lahir)->locale('id')->translatedFormat('d/m/Y') : '-' }}</td>
                    <td>{{ $anggota->status_hubungan_keluarga ?? '-' }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="7" style="text-align: center;">Tidak ada anggota keluarga.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="footer">
        <table>
            <tr>
                <td class="mengetahui">
                    <p>Mengetahui,</p>
                    <p>Lurah Ardipura</p>
                    <div class="ttd-space"></div>
                    <p><strong>PHILIPUS WAMEA</strong></p>
                </td>
                <td class="ttd">
                    <p>Jayapura, {{ now()->locale('id')->translatedFormat('d F Y') }}</p>
                    <p>Kepala Keluarga,</p>
                    <div class="ttd-space"></div>
                    <p><strong>{{ $kepalaKeluarga ?? '-' }}</strong></p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
