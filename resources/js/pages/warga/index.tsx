import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import WargaLayout from '@/layouts/WargaLayout';
import { Card, CardBody, CardTitle, Stat, Badge, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui';

interface WargaPenduduk {
    id: number;
    nik: string;
    nama_lengkap: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    alamat: string;
    rt: string;
    rw: string;
    status_penduduk: string;
}

interface WargaKK {
    id: number;
    nomor_kk: string;
    alamat: string;
}

interface PengajuanItem {
    id: number;
    jenis_surat: string;
    keperluan: string;
    status: string;
    created_at: string;
}

interface WargaDashboardProps extends PageProps {
    penduduk: WargaPenduduk | null;
    kartuKeluarga: WargaKK | null;
    pengajuanTerbaru: PengajuanItem[];
    totalPengajuan: number;
    pengajuanDiproses: number;
    pengajuanSelesai: number;
}

const statusColors: Record<string, 'warning' | 'info' | 'success' | 'error'> = {
    menunggu: 'warning',
    diproses: 'info',
    selesai: 'success',
    ditolak: 'error',
};

export default function WargaDashboard({ penduduk, kartuKeluarga, pengajuanTerbaru, totalPengajuan, pengajuanDiproses, pengajuanSelesai }: WargaDashboardProps) {
    const { auth } = usePage<WargaDashboardProps>().props;

    return (
        <>
            <Head title="Dashboard Warga" />
            <WargaLayout title="Dashboard Warga">
                <div className="space-y-6">
                    {/* Welcome Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-base-content">
                            Selamat datang, {auth?.user?.name || 'Warga'}
                        </h1>
                        <p className="text-base-content/60 mt-1">
                            Kelola data kependudukan dan ajukan surat secara online
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Stat
                            value={totalPengajuan}
                            title="Total Pengajuan"
                            desc="Semua waktu"
                            color="primary"
                            figure={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-8 w-8" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            }
                            className="bg-base-100"
                        />

                        <Stat
                            value={pengajuanDiproses}
                            title="Sedang Diproses"
                            desc="Menunggu atau diproses"
                            color="warning"
                            figure={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-8 w-8" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            className="bg-base-100"
                        />

                        <Stat
                            value={pengajuanSelesai}
                            title="Sudah Selesai"
                            desc="Siap diambil"
                            color="success"
                            figure={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-8 w-8" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            className="bg-base-100"
                        />
                    </div>

                    {/* Data Penduduk Card */}
                    <Card variant="bordered">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Data Kependudukan
                        </CardTitle>
                        <CardBody>
                            {penduduk ? (
                                <div className="overflow-x-auto">
                                    <Table size="sm">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-medium w-1/3">NIK</TableCell>
                                                <TableCell>{penduduk.nik}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">Nama Lengkap</TableCell>
                                                <TableCell>{penduduk.nama_lengkap}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">Tempat/Tanggal Lahir</TableCell>
                                                <TableCell>{penduduk.tempat_lahir}, {new Date(penduduk.tanggal_lahir).toLocaleDateString('id-ID')}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">Jenis Kelamin</TableCell>
                                                <TableCell>{penduduk.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">Alamat</TableCell>
                                                <TableCell>
                                                    {penduduk.alamat}, RT {penduduk.rt}/RW {penduduk.rw}
                                                </TableCell>
                                            </TableRow>
                                            {kartuKeluarga && (
                                                <TableRow>
                                                    <TableCell className="font-medium">Nomor KK</TableCell>
                                                    <TableCell>{kartuKeluarga.nomor_kk}</TableCell>
                                                </TableRow>
                                            )}
                                            <TableRow>
                                                <TableCell className="font-medium">Status Penduduk</TableCell>
                                                <TableCell>
                                                    <Badge color={penduduk.status_penduduk === 'Tetap' ? 'success' : 'warning'} size="sm" className="capitalize">
                                                        {penduduk.status_penduduk}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-base-content/60">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-12 w-12 mx-auto mb-3 opacity-50" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <p>Data kependudukan belum terhubung dengan akun Anda.</p>
                                    <p className="text-sm mt-1">Silakan hubungi admin kelurahan untuk verifikasi data.</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Pengajuan Terbaru */}
                    <Card variant="bordered">
                        <CardTitle className="text-lg font-semibold flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Pengajuan Terbaru
                            </span>
                            {pengajuanTerbaru.length > 0 && (
                                <a href="/warga/riwayat" className="btn btn-sm btn-ghost">
                                    Lihat Semua
                                </a>
                            )}
                        </CardTitle>
                        <CardBody className="p-0">
                            {pengajuanTerbaru.length === 0 ? (
                                <div className="p-8 text-center text-base-content/60">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-12 w-12 mx-auto mb-3 opacity-50" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p>Belum ada pengajuan surat.</p>
                                    <a href="/warga/pengajuan" className="btn btn-primary btn-sm mt-3">
                                        Buat Pengajuan
                                    </a>
                                </div>
                            ) : (
                                <Table size="sm">
                                    <TableHead>
                                        <TableRow>
                                            <TableHeaderCell>Jenis Surat</TableHeaderCell>
                                            <TableHeaderCell>Keperluan</TableHeaderCell>
                                            <TableHeaderCell>Status</TableHeaderCell>
                                            <TableHeaderCell>Tanggal</TableHeaderCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pengajuanTerbaru.map((item) => (
                                            <TableRow key={item.id} hover>
                                                <TableCell className="font-medium">{item.jenis_surat}</TableCell>
                                                <TableCell className="max-w-[200px] truncate">{item.keperluan}</TableCell>
                                                <TableCell>
                                                    <Badge color={statusColors[item.status]} size="sm" className="capitalize">
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-base-content/60">
                                                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </WargaLayout>
        </>
    );
}
