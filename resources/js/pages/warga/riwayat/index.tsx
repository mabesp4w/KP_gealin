import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import WargaLayout from '@/layouts/WargaLayout';
import { Card, CardBody, CardTitle, Badge, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Button, Modal, Alert } from '@/components/ui';
import { useState } from 'react';

interface LampiranItem {
    id: number;
    nama_file: string;
    path_file: string;
    tipe_file: string;
    persyaratan_nama: string;
}

interface SuratItem {
    id: number;
    nomor_surat: string;
    tanggal_surat: string;
}

interface PengajuanItem {
    id: number;
    jenis_surat: string;
    keperluan: string;
    keterangan: string | null;
    status: string;
    catatan_staf: string | null;
    created_at: string;
    tanggal_diproses: string | null;
    lampiran: LampiranItem[];
    surat: SuratItem | null;
}

interface WargaRiwayatProps extends PageProps {
    pengajuan: {
        data: PengajuanItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const statusColors: Record<string, 'warning' | 'info' | 'success' | 'error'> = {
    menunggu: 'warning',
    diproses: 'info',
    selesai: 'success',
    ditolak: 'error',
};

const statusLabels: Record<string, string> = {
    menunggu: 'Menunggu Verifikasi',
    diproses: 'Sedang Diproses',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
};

const statusIcons: Record<string, string> = {
    menunggu: '⏳',
    diproses: '🔄',
    selesai: '✅',
    ditolak: '❌',
};

export default function WargaRiwayat({ pengajuan }: WargaRiwayatProps) {
    const [selectedItem, setSelectedItem] = useState<PengajuanItem | null>(null);
    const [deleteItem, setDeleteItem] = useState<PengajuanItem | null>(null);

    const handleDelete = () => {
        if (!deleteItem) return;

        router.delete(`/warga/pengajuan/${deleteItem.id}`, {
            onSuccess: () => {
                setDeleteItem(null);
            },
            onError: () => {
                setDeleteItem(null);
            },
        });
    };

    const canDelete = (status: string) => status === 'menunggu' || status === 'ditolak';
    return (
        <>
            <Head title="Riwayat Pengajuan" />
            <WargaLayout title="Riwayat Pengajuan">
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-base-content">Riwayat Pengajuan</h1>
                            <p className="text-base-content/60 mt-1">
                                Pantau status pengajuan surat Anda
                            </p>
                        </div>
                        <a href="/warga/pengajuan" className="btn btn-primary btn-sm">
                            Buat Pengajuan Baru
                        </a>
                    </div>

                    {/* Pengajuan List */}
                    <Card variant="bordered">
                        <CardBody className="p-0">
                            {pengajuan.data.length === 0 ? (
                                <div className="p-8 text-center text-base-content/60">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-12 w-12 mx-auto mb-3 opacity-50" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p>Belum ada riwayat pengajuan.</p>
                                    <a href="/warga/pengajuan" className="btn btn-primary btn-sm mt-3">
                                        Buat Pengajuan Pertama
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
                                            <TableHeaderCell className="text-right">Aksi</TableHeaderCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pengajuan.data.map((item) => (
                                            <TableRow key={item.id} hover>
                                                <TableCell>
                                                    <div className="font-medium">{item.jenis_surat}</div>
                                                    {item.catatan_staf && (
                                                        <div className="text-xs text-info mt-1">
                                                            📝 {item.catatan_staf}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-[200px]">{item.keperluan}</div>
                                                    {item.keterangan && (
                                                        <div className="text-xs text-base-content/60 mt-1 truncate max-w-[200px]">
                                                            {item.keterangan}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge color={statusColors[item.status]} size="sm">
                                                        {statusIcons[item.status]} {statusLabels[item.status] || item.status}
                                                    </Badge>
                                                    {item.tanggal_diproses && (
                                                        <div className="text-xs text-base-content/60 mt-1">
                                                            {new Date(item.tanggal_diproses).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="soft"
                                                            color="info"
                                                            onClick={() => setSelectedItem(item)}
                                                            title="Lihat Detail"
                                                        >
                                                            👁️
                                                        </Button>
                                                        {canDelete(item.status) && (
                                                            <Button
                                                                size="sm"
                                                                variant="soft"
                                                                color="error"
                                                                onClick={() => setDeleteItem(item)}
                                                                title="Hapus Pengajuan"
                                                            >
                                                                🗑️
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardBody>
                    </Card>

                    {/* Pagination */}
                    {pengajuan.last_page > 1 && (
                        <div className="flex justify-center">
                            <div className="join">
                                {pengajuan.links.map((link, index) => {
                                    if (!link.url) {
                                        return (
                                            <button
                                                key={index}
                                                className="join-item btn btn-sm btn-disabled"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }
                                    return (
                                        <a
                                            key={index}
                                            href={link.url}
                                            className={`join-item btn btn-sm ${link.active ? 'btn-active' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Detail Modal */}
                <Modal open={!!selectedItem} onClose={() => setSelectedItem(null)} position="middle">
                    {selectedItem && (
                        <>
                            <div className="flex items-center justify-between border-b border-base-300 pb-4 mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <span className="text-2xl">📄</span>
                                    Detail Pengajuan
                                </h3>
                                <Badge color={statusColors[selectedItem.status]} size="md">
                                    {statusIcons[selectedItem.status]} {statusLabels[selectedItem.status]}
                                </Badge>
                            </div>

                            <div className="space-y-4">
                                {/* Jenis Surat */}
                                <div className="flex items-start gap-3">
                                    <span className="text-base-content/60 w-24 shrink-0">Jenis Surat</span>
                                    <span className="font-medium">{selectedItem.jenis_surat}</span>
                                </div>

                                {/* Keperluan */}
                                <div className="flex items-start gap-3">
                                    <span className="text-base-content/60 w-24 shrink-0">Keperluan</span>
                                    <span>{selectedItem.keperluan}</span>
                                </div>

                                {/* Keterangan */}
                                {selectedItem.keterangan && (
                                    <div className="flex items-start gap-3">
                                        <span className="text-base-content/60 w-24 shrink-0">Keterangan</span>
                                        <span>{selectedItem.keterangan}</span>
                                    </div>
                                )}

                                <div className="border-t border-base-300 pt-4 space-y-3">
                                    {/* Tanggal Pengajuan */}
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="text-base-content/60">📅 Diajukan</span>
                                        <span>{new Date(selectedItem.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>

                                    {/* Tanggal Diproses */}
                                    {selectedItem.tanggal_diproses && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-base-content/60">🔄 Diproses</span>
                                            <span>{new Date(selectedItem.tanggal_diproses).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Dokumen Lampiran */}
                                {selectedItem.lampiran && selectedItem.lampiran.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                            </svg>
                                            Dokumen yang Diupload
                                            <span className="badge badge-sm badge-ghost">({selectedItem.lampiran.length})</span>
                                        </div>
                                        <div className="grid gap-2">
                                            {selectedItem.lampiran.map((file) => (
                                                <a
                                                    key={file.id}
                                                    href={`/storage/${file.path_file}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                                                >
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                                                        {file.tipe_file === 'KTP' && '🪪'}
                                                        {file.tipe_file === 'KK' && '👨‍👩‍👧‍👦'}
                                                        {file.tipe_file === 'Foto' && '📷'}
                                                        {file.tipe_file === 'pdf' && '📕'}
                                                        {!['KTP', 'KK', 'Foto', 'pdf'].includes(file.tipe_file) && '📄'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium truncate">{file.persyaratan_nama}</div>
                                                        <div className="text-xs text-base-content/60 truncate">{file.nama_file}</div>
                                                    </div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Catatan Staf */}
                                {selectedItem.catatan_staf && (
                                    <div className="alert alert-info">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <h4 className="font-bold text-sm">Catatan Staf</h4>
                                            <p className="text-xs">{selectedItem.catatan_staf}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Status Messages */}
                                {selectedItem.status === 'menunggu' && (
                                    <div className="alert alert-warning">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <span className="text-sm">Pengajuan Anda sedang ditinjau oleh staf kelurahan. Mohon tunggu informasi selanjutnya.</span>
                                    </div>
                                )}

                                {selectedItem.status === 'diproses' && (
                                    <div className="alert alert-info">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">Pengajuan Anda sedang diproses. Surat sedang disiapkan.</span>
                                    </div>
                                )}

                                {selectedItem.status === 'selesai' && (
                                    <>
                                        {selectedItem.surat ? (
                                            <div className="alert alert-success">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Surat Siap Diambil!</p>
                                                    <p className="text-xs">Nomor: {selectedItem.surat.nomor_surat}</p>
                                                </div>
                                                <a
                                                    href={`/warga/surat/${selectedItem.id}/cetak`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-success text-success-content"
                                                >
                                                    🖨️ Cetak
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="alert alert-success">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm">Pengajuan Anda telah selesai. Surat dapat diambil di kelurahan.</span>
                                            </div>
                                        )}
                                    </>
                                )}

                                {selectedItem.status === 'ditolak' && (
                                    <div className="alert alert-error">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">Maaf, pengajuan Anda ditolak. Silakan periksa catatan staf dan ajukan kembali jika perlu.</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end mt-6">
                                <Button onClick={() => setSelectedItem(null)} color="primary">
                                    Tutup
                                </Button>
                            </div>
                        </>
                    )}
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal open={!!deleteItem} onClose={() => setDeleteItem(null)} position="middle">
                    {deleteItem && (
                        <>
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-error/10 text-error mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-base-content mb-2">Hapus Pengajuan?</h3>
                                <p className="text-base-content/60 text-sm mb-4">
                                    Anda yakin ingin menghapus pengajuan <strong>{deleteItem.jenis_surat}</strong>?
                                </p>
                                <Alert variant="soft" color="warning" className="text-left mb-4">
                                    <span className="text-sm">
                                        Tindakan ini tidak dapat dibatalkan. Dokumen yang diupload akan ikut terhapus.
                                    </span>
                                </Alert>
                            </div>
                            <div className="flex justify-center gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteItem(null)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    color="error"
                                    onClick={handleDelete}
                                >
                                    Ya, Hapus
                                </Button>
                            </div>
                        </>
                    )}
                </Modal>
            </WargaLayout>
        </>
    );
}
