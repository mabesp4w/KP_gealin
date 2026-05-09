<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page {
            margin-top: 2cm;
            margin-bottom: 2cm;
            margin-left: 2.5cm;
            margin-right: 2.5cm;
        }
        body {
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 1.5;
        }
        .kop {
            text-align: center;
            border-bottom: 3px double #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
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
            font-size: 12pt;
            font-weight: bold;
            text-transform: uppercase;
            text-decoration: underline;
            margin: 0;
        }
        .judul p {
            margin: 5px 0 0;
        }
        .nomor {
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            text-align: justify;
            margin-bottom: 30px;
        }
        .content p {
            margin: 5px 0;
            text-indent: 30px;
        }
        .data-table {
            margin: 15px auto;
            width: 100%;
            max-width: 600px;
        }
        .data-table table {
            width: 100%;
            border-collapse: collapse;
        }
        .data-table td {
            padding: 4px 8px;
            vertical-align: top;
        }
        .data-table td.label {
            width: 35%;
            font-weight: normal;
        }
        .data-table td.value {
            width: 5%;
            text-align: center;
        }
        .data-table td.data {
            width: 60%;
        }
        .keterangan-box {
            margin: 15px 30px;
            padding: 10px;
            border: 1px solid #000;
        }
        .keterangan-box p {
            margin: 5px 0;
            text-indent: 0;
        }
        .ttd {
            margin-top: 50px;
            text-align: right;
        }
        .ttd p {
            margin: 5px 0;
        }
        .ttd-space {
            height: 70px;
        }
    </style>
</head>
<body>
    <div class="kop">
        <h1>Pemerintah Kota Jayapura</h1>
        <h2>Kelurahan Ardipura</h2>
        <p>Jl. Dokter Soetomo No. 1, Jayapura Selatan</p>
        <p>Kota Jayapura, Papua</p>
    </div>

    <div class="nomor">
        <p>Nomor: {{ $surat->nomor_surat ?? '...' }}</p>
    </div>

    <div class="judul">
        <h2>{{ $surat->jenisSurat->nama ?? 'SURAT KETERANGAN' }}</h2>
    </div>

    <div class="content">
        <p>Yang bertanda tangan di bawah ini Lurah Ardipura, Kecamatan Jayapura Selatan, Kota Jayapura, Provinsi Papua, menerangkan dengan sebenarnya bahwa:</p>

        <div class="data-table">
            <table>
                <tr>
                    <td class="label">Nama Lengkap</td>
                    <td class="value">:</td>
                    <td class="data"><strong>{{ $surat->penduduk->nama_lengkap ?? '-' }}</strong></td>
                </tr>
                <tr>
                    <td class="label">NIK</td>
                    <td class="value">:</td>
                    <td class="data">{{ $surat->penduduk->nik ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Tempat/Tanggal Lahir</td>
                    <td class="value">:</td>
                    <td class="data">{{ $surat->penduduk->tempat_lahir ?? '-' }}, {{ \Carbon\Carbon::parse($surat->penduduk->tanggal_lahir)->format('d F Y') }}</td>
                </tr>
                <tr>
                    <td class="label">Jenis Kelamin</td>
                    <td class="value">:</td>
                    <td class="data">{{ $surat->penduduk->jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
                </tr>
                <tr>
                    <td class="label">Agama</td>
                    <td class="value">:</td>
                    <td class="data">{{ $surat->penduduk->agama ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Pekerjaan</td>
                    <td class="value">:</td>
                    <td class="data">{{ $surat->penduduk->pekerjaan ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Alamat</td>
                    <td class="value">:</td>
                    <td class="data">{{ $surat->penduduk->alamat ?? '-' }}, RT {{ $surat->penduduk->rt ?? '-' }}/RW {{ $surat->penduduk->rw ?? '-' }}</td>
                </tr>
            </table>
        </div>

        @if($surat->perihal || $surat->keterangan)
        <div class="keterangan-box">
            @if($surat->perihal)
            <p><strong>Perihal:</strong> {{ $surat->perihal }}</p>
            @endif

            @if($surat->keterangan)
            <p><strong>Keterangan:</strong></p>
            <p>{{ $surat->keterangan }}</p>
            @endif
        </div>
        @endif

        <p>Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
    </div>

    <div class="ttd">
        <p>{{ \Carbon\Carbon::parse($surat->tanggal_surat)->locale('id')->translatedFormat('d F Y') }}</p>
        <p>Lurah Ardipura</p>

        <div class="ttd-space"></div>

        <p><strong>PHILIPUS WAMEA</strong></p>
        @if($surat->jabatan_penandatangan)
        <p>{{ $surat->jabatan_penandatangan }}</p>
        @else
        <p>Pembina Utama Muda</p>
        @endif
    </div>
</body>
</html>
