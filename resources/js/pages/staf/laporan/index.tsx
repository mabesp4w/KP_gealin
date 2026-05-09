import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import StafLayout from '@/layouts/StafLayout';
import { Card, CardBody, CardTitle, Badge, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Progress, NativeSelect, type BadgeColor } from '@/components/ui';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface LaporanData {
    filters: {
        bulan: number;
        tahun: number;
        tahunTersedia: number[];
    };
    penduduk: {
        total: number;
        perJenisKelamin: { L: number; P: number };
        perStatus: { [key: string]: number };
        distribusiUsia: { [key: string]: number };
        perPendidikan: { [key: string]: number };
        perPekerjaan: { [key: string]: number };
    };
    kartuKeluarga: {
        total: number;
        rataRataAnggota: number;
    };
    surat: {
        perJenis: { [key: string]: number };
        perBulan: { [key: string]: number };
        totalTahunIni: number;
    };
    pengajuan: {
        perStatus: { [key: string]: number };
        perJenis: { [key: string]: number };
        perBulan: { [key: string]: number };
        totalTahunIni: number;
    };
    mutasi: {
        perJenis: { [key: string]: number };
        perBulan: { [key: string]: { [key: string]: number } };
    };
}

interface LaporanProps extends PageProps {
    laporan: LaporanData;
}

const bulanNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const mutasiColors: Record<string, BadgeColor> = {
    masuk: 'success',
    keluar: 'error',
    lahir: 'info',
    meninggal: 'neutral',
};

const statusColors: Record<string, BadgeColor> = {
    menunggu: 'warning',
    diproses: 'info',
    selesai: 'success',
    ditolak: 'error',
};

export default function Laporan({ laporan }: LaporanProps) {
    const [tahun, setTahun] = useState(laporan.filters.tahun);

    const handleTahunChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTahun(Number(e.target.value));
        router.get('/staf/laporan', { tahun: e.target.value }, { preserveState: true });
    };

    const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);

    const renderProgressBar = (data: { [key: string]: number }, total: number) => {
        const max = Math.max(...Object.values(data));
        return (
            <div className="space-y-2">
                {Object.entries(data).sort((a, b) => b[1] - a[1]).map(([label, value]) => (
                    <div key={label} className="flex items-center gap-2">
                        <div className="w-24 text-sm truncate">{label}</div>
                        <div className="flex-1">
                            <progress
                                className="progress progress-primary w-full"
                                value={value}
                                max={max}
                            />
                        </div>
                        <div className="w-12 text-right text-sm">{formatNumber(value)}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <Head title="Laporan" />
            <StafLayout
                title="Laporan"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/staf' },
                    { label: 'Laporan' },
                ]}
            >
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-base-content">Laporan</h1>
                            <p className="text-base-content/60 mt-1">
                                Statistik dan laporan kependudukan serta layanan surat
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-base-content/60">Tahun:</label>
                            <NativeSelect
                                options={laporan.filters.tahunTersedia.map(t => ({ value: String(t), label: String(t) }))}
                                value={String(tahun)}
                                onChange={handleTahunChange}
                                className="select-sm"
                            />
                        </div>
                    </div>

                    {/* Ringkasan Cepat */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card variant="bordered" className="stat-bg">
                            <CardBody className="text-center py-4">
                                <div className="text-3xl font-bold text-primary">{formatNumber(laporan.penduduk.total)}</div>
                                <div className="text-sm text-base-content/60">Total Penduduk</div>
                            </CardBody>
                        </Card>
                        <Card variant="bordered">
                            <CardBody className="text-center py-4">
                                <div className="text-3xl font-bold text-secondary">{formatNumber(laporan.kartuKeluarga.total)}</div>
                                <div className="text-sm text-base-content/60">Total KK</div>
                            </CardBody>
                        </Card>
                        <Card variant="bordered">
                            <CardBody className="text-center py-4">
                                <div className="text-3xl font-bold text-accent">{formatNumber(laporan.surat.totalTahunIni)}</div>
                                <div className="text-sm text-base-content/60">Surat Tahun {tahun}</div>
                            </CardBody>
                        </Card>
                        <Card variant="bordered">
                            <CardBody className="text-center py-4">
                                <div className="text-3xl font-bold text-info">{formatNumber(laporan.pengajuan.totalTahunIni)}</div>
                                <div className="text-sm text-base-content/60">Pengajuan Tahun {tahun}</div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Laporan Penduduk */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Jenis Kelamin & Status */}
                        <Card variant="bordered">
                            <CardBody className="space-y-4">
                                <CardTitle className="text-lg mb-2">Demografi Penduduk</CardTitle>
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Jenis Kelamin</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Laki-laki</span>
                                                <span className="font-semibold">{formatNumber(laporan.penduduk.perJenisKelamin.L)}</span>
                                            </div>
                                            <Progress value={laporan.penduduk.perJenisKelamin.L} max={laporan.penduduk.total} color="primary" className="h-2" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Perempuan</span>
                                                <span className="font-semibold">{formatNumber(laporan.penduduk.perJenisKelamin.P)}</span>
                                            </div>
                                            <Progress value={laporan.penduduk.perJenisKelamin.P} max={laporan.penduduk.total} color="secondary" className="h-2" />
                                        </div>
                                    </div>
                                </div>
                                <div className="divider my-2"></div>
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Status Penduduk</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(laporan.penduduk.perStatus).map(([status, count]) => (
                                            <div key={status} className="flex justify-between p-2 bg-base-200 rounded">
                                                <span className="capitalize text-sm">{status}</span>
                                                <span className="font-semibold text-sm">{formatNumber(count)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Distribusi Usia */}
                        <Card variant="bordered">
                            <CardBody>
                                <CardTitle className="text-lg mb-4">Distribusi Usia</CardTitle>
                                {renderProgressBar(laporan.penduduk.distribusiUsia, laporan.penduduk.total)}
                            </CardBody>
                        </Card>
                    </div>

                    {/* Pendidikan & Pekerjaan */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card variant="bordered">
                            <CardBody>
                                <CardTitle className="text-lg mb-4">Pendidikan Terakhir</CardTitle>
                                {renderProgressBar(laporan.penduduk.perPendidikan, laporan.penduduk.total)}
                            </CardBody>
                        </Card>
                        <Card variant="bordered">
                            <CardBody>
                                <CardTitle className="text-lg mb-4">Pekerjaan (Top 10)</CardTitle>
                                {renderProgressBar(laporan.penduduk.perPekerjaan, laporan.penduduk.total)}
                            </CardBody>
                        </Card>
                    </div>

                    {/* Kartu Keluarga */}
                    <Card variant="bordered">
                        <CardBody>
                            <CardTitle className="text-lg mb-4">Statistik Kartu Keluarga</CardTitle>
                            <div className="flex items-center justify-around">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-secondary">{formatNumber(laporan.kartuKeluarga.total)}</div>
                                    <div className="text-sm text-base-content/60">Total KK</div>
                                </div>
                                <div className="divider divider-horizontal"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">{laporan.kartuKeluarga.rataRataAnggota}</div>
                                    <div className="text-sm text-base-content/60">Rata-rata Anggota/KK</div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Laporan Surat & Pengajuan */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Surat per Jenis */}
                        <Card variant="bordered">
                            <CardBody>
                                <CardTitle className="text-lg mb-4">Surat per Jenis</CardTitle>
                                {renderProgressBar(laporan.surat.perJenis, laporan.surat.totalTahunIni)}
                            </CardBody>
                        </Card>

                        {/* Pengajuan per Status */}
                        <Card variant="bordered">
                            <CardBody>
                                <CardTitle className="text-lg mb-4">Pengajuan per Status</CardTitle>
                                <div className="space-y-2">
                                    {Object.entries(laporan.pengajuan.perStatus).map(([status, count]) => (
                                        <div key={status} className="flex items-center justify-between p-2 bg-base-200 rounded">
                                            <Badge color={statusColors[status]} size="sm" className="capitalize">{status}</Badge>
                                            <span className="font-semibold">{formatNumber(count)}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Pengajuan per Jenis */}
                    <Card variant="bordered">
                        <CardBody>
                            <CardTitle className="text-lg mb-4">Pengajuan per Jenis Surat</CardTitle>
                            {renderProgressBar(laporan.pengajuan.perJenis, laporan.pengajuan.totalTahunIni)}
                        </CardBody>
                    </Card>

                    {/* Tren Bulanan */}
                    <Card variant="bordered">
                        <CardBody className="p-0">
                            <CardTitle className="text-lg px-6 pt-6">Tren Bulanan Tahun {tahun}</CardTitle>
                            <Table size="sm">
                                <TableHead>
                                    <TableRow>
                                        <TableHeaderCell>Bulan</TableHeaderCell>
                                        <TableHeaderCell className="text-right">Surat</TableHeaderCell>
                                        <TableHeaderCell className="text-right">Pengajuan</TableHeaderCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(laporan.surat.perBulan).map(([bulan, count], i) => (
                                        <TableRow key={bulan}>
                                            <TableCell>{bulanNames[parseInt(bulan)]}</TableCell>
                                            <TableCell className="text-right">{formatNumber(count)}</TableCell>
                                            <TableCell className="text-right">{formatNumber(laporan.pengajuan.perBulan[bulan] || 0)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>

                    {/* Mutasi Penduduk */}
                    <Card variant="bordered">
                        <CardBody>
                            <CardTitle className="text-lg mb-4">Mutasi Penduduk Tahun {tahun}</CardTitle>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {Object.entries(laporan.mutasi.perJenis).map(([jenis, count]) => (
                                    <div key={jenis} className="text-center p-3 bg-base-200 rounded-lg">
                                        <Badge color={mutasiColors[jenis]} size="sm" className="capitalize mb-1">{jenis}</Badge>
                                        <div className="text-xl font-bold">{formatNumber(count)}</div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </StafLayout>
        </>
    );
}
