import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import StafLayout from '@/layouts/StafLayout';
import { Stat, Card, CardBody, CardTitle, Badge, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, type BadgeColor } from '@/components/ui';
import { formatDateTime } from '@/lib/date';

interface DashboardStats {
    totalPenduduk: number;
    totalKK: number;
    suratBulanIni: number;
    pengajuanMenunggu: number;
    pendudukPerJenisKelamin: { L: number; P: number };
    pendudukPerStatus: { Tetap: number; Sementara: number; Pindah: number; Meninggal: number };
    mutasiBulanIni: { masuk: number; keluar: number; lahir: number; meninggal: number };
    pengajuanPerStatus: { menunggu: number; diproses: number; selesai: number; ditolak: number };
    suratPerStatus: { draft: number; diterbitkan: number; dibatalkan: number };
}

interface PengajuanItem {
    id: number;
    nama_penduduk: string;
    jenis_surat: string;
    keperluan: string;
    status: string;
    created_at: string;
}

interface MutasiItem {
    id: number;
    nama_penduduk: string;
    jenis_mutasi: string;
    tanggal_mutasi: string;
    alasan: string;
    created_at: string;
}

interface DashboardProps extends PageProps {
    stats: DashboardStats;
    pengajuanTerbaru: PengajuanItem[];
    mutasiTerbaru: MutasiItem[];
}

const statusColors: Record<string, BadgeColor> = {
    menunggu: 'warning',
    diproses: 'info',
    selesai: 'success',
    ditolak: 'error',
    draft: 'neutral',
    diterbitkan: 'success',
    dibatalkan: 'error',
};

const mutasiColors: Record<string, BadgeColor> = {
    masuk: 'success',
    keluar: 'error',
    lahir: 'info',
    meninggal: 'neutral',
};

export default function StafDashboard({ stats, pengajuanTerbaru, mutasiTerbaru }: DashboardProps) {
    const { auth } = usePage<DashboardProps>().props;
    const userName = auth?.user?.name || 'Staf';

    return (
        <>
            <Head title="Dashboard Staf" />
            <StafLayout title="Dashboard Staf">
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-base-content">Dashboard</h1>
                            <p className="text-base-content/60 mt-1">
                                Selamat datang, <span className="font-semibold text-primary">{userName}</span>
                            </p>
                        </div>
                        <div className="text-sm text-base-content/60">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    {/* Stats Cards Utama */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <Stat
                            value={stats.totalPenduduk}
                            title="Total Penduduk"
                            desc="Terdaftar di kelurahan"
                            color="primary"
                            figure={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-8 w-8" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            }
                            className="bg-base-100"
                        />

                        <Stat
                            value={stats.totalKK}
                            title="Kartu Keluarga"
                            desc="Total KK terdaftar"
                            color="secondary"
                            figure={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-8 w-8" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            }
                            className="bg-base-100"
                        />

                        <Stat
                            value={stats.suratBulanIni}
                            title="Surat Terbit"
                            desc="Bulan ini"
                            color="accent"
                            figure={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-8 w-8" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            }
                            className="bg-base-100"
                        />

                        <Stat
                            value={stats.pengajuanMenunggu}
                            title="Pengajuan Masuk"
                            desc="Menunggu diproses"
                            color="warning"
                            figure={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-8 w-8" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            }
                            className="bg-base-100"
                        />
                    </div>

                    {/* Statistik Penduduk & Mutasi */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Penduduk per Jenis Kelamin */}
                        <Card variant="bordered">
                            <CardBody className="space-y-4">
                                <CardTitle className="text-lg font-semibold mb-2">Penduduk per Jenis Kelamin</CardTitle>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <span className="text-blue-500">♂</span> Laki-laki
                                    </span>
                                    <Badge color="primary" size="lg">{stats.pendudukPerJenisKelamin.L}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <span className="text-pink-500">♀</span> Perempuan
                                    </span>
                                    <Badge color="secondary" size="lg">{stats.pendudukPerJenisKelamin.P}</Badge>
                                </div>
                                <progress
                                    className="progress progress-primary w-full"
                                    value={stats.pendudukPerJenisKelamin.L}
                                    max={stats.pendudukPerJenisKelamin.L + stats.pendudukPerJenisKelamin.P}
                                />
                            </CardBody>
                        </Card>

                        {/* Mutasi Bulan Ini */}
                        <Card variant="bordered">
                            <CardBody className="grid grid-cols-2 gap-4">
                                <CardTitle className="col-span-2 text-lg font-semibold mb-2">Mutasi Bulan Ini</CardTitle>
                                <div className="text-center p-3 bg-base-200 rounded-lg">
                                    <div className="text-2xl font-bold text-success">{stats.mutasiBulanIni.masuk}</div>
                                    <div className="text-xs text-base-content/60">Masuk</div>
                                </div>
                                <div className="text-center p-3 bg-base-200 rounded-lg">
                                    <div className="text-2xl font-bold text-error">{stats.mutasiBulanIni.keluar}</div>
                                    <div className="text-xs text-base-content/60">Keluar</div>
                                </div>
                                <div className="text-center p-3 bg-base-200 rounded-lg">
                                    <div className="text-2xl font-bold text-info">{stats.mutasiBulanIni.lahir}</div>
                                    <div className="text-xs text-base-content/60">Lahir</div>
                                </div>
                                <div className="text-center p-3 bg-base-200 rounded-lg">
                                    <div className="text-2xl font-bold text-neutral">{stats.mutasiBulanIni.meninggal}</div>
                                    <div className="text-xs text-base-content/60">Meninggal</div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Statistik Status Penduduk */}
                    <Card variant="bordered">
                        <CardBody>
                            <CardTitle className="text-lg font-semibold mb-4">Status Penduduk</CardTitle>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(stats.pendudukPerStatus).map(([status, count]) => (
                                    <div key={status} className="text-center p-4 bg-base-200 rounded-lg">
                                        <div className="text-2xl font-bold">{count}</div>
                                        <div className="text-sm text-base-content/60 capitalize">{status}</div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Pengajuan & Surat per Status */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Pengajuan per Status */}
                        <Card variant="bordered">
                            <CardBody className="space-y-3">
                                <CardTitle className="text-lg font-semibold mb-3">Status Pengajuan</CardTitle>
                                {Object.entries(stats.pengajuanPerStatus).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between">
                                        <Badge color={statusColors[status]} size="sm" className="capitalize">{status}</Badge>
                                        <span className="font-semibold">{count}</span>
                                    </div>
                                ))}
                            </CardBody>
                        </Card>

                        {/* Surat per Status */}
                        <Card variant="bordered">
                            <CardBody className="space-y-3">
                                <CardTitle className="text-lg font-semibold mb-3">Status Surat</CardTitle>
                                {Object.entries(stats.suratPerStatus).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between">
                                        <Badge color={statusColors[status]} size="sm" className="capitalize">{status}</Badge>
                                        <span className="font-semibold">{count}</span>
                                    </div>
                                ))}
                            </CardBody>
                        </Card>
                    </div>

                    {/* Aktivitas Terbaru */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Pengajuan Terbaru */}
                        <Card variant="bordered">
                            <CardBody className="p-0">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2 px-6 pt-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    Pengajuan Terbaru
                                </CardTitle>
                                {pengajuanTerbaru.length === 0 ? (
                                    <div className="p-4 text-center text-base-content/60">Belum ada pengajuan</div>
                                ) : (
                                    <Table size="sm" className="table-compact">
                                        <TableHead>
                                            <TableRow>
                                                <TableHeaderCell>Penduduk</TableHeaderCell>
                                                <TableHeaderCell>Jenis Surat</TableHeaderCell>
                                                <TableHeaderCell>Status</TableHeaderCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {pengajuanTerbaru.map((item) => (
                                                <TableRow key={item.id} hover>
                                                    <TableCell>
                                                        <div className="font-medium">{item.nama_penduduk}</div>
                                                        <div className="text-xs text-base-content/60">{formatDateTime(item.created_at)}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">{item.jenis_surat}</div>
                                                        <div className="text-xs text-base-content/60 truncate max-w-[150px]">{item.keperluan}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge color={statusColors[item.status]} size="xs" className="capitalize">
                                                            {item.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardBody>
                        </Card>

                        {/* Mutasi Terbaru */}
                        <Card variant="bordered">
                            <CardBody className="p-0">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2 px-6 pt-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                    Mutasi Terbaru
                                </CardTitle>
                                {mutasiTerbaru.length === 0 ? (
                                    <div className="p-4 text-center text-base-content/60">Belum ada mutasi</div>
                                ) : (
                                    <Table size="sm" className="table-compact">
                                        <TableHead>
                                            <TableRow>
                                                <TableHeaderCell>Penduduk</TableHeaderCell>
                                                <TableHeaderCell>Mutasi</TableHeaderCell>
                                                <TableHeaderCell>Tanggal</TableHeaderCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {mutasiTerbaru.map((item) => (
                                                <TableRow key={item.id} hover>
                                                    <TableCell>
                                                        <div className="font-medium">{item.nama_penduduk}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge color={mutasiColors[item.jenis_mutasi]} size="xs" className="capitalize">
                                                            {item.jenis_mutasi}
                                                        </Badge>
                                                        <div className="text-xs text-base-content/60 truncate max-w-[120px]">{item.alasan}</div>
                                                    </TableCell>
                                                    <TableCell className="text-sm">{item.tanggal_mutasi}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </StafLayout>
        </>
    );
}
