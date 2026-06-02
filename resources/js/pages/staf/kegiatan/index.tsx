import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalAction,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableHeaderCell,
    TableCell,
    Badge,
    LaravelPagination,
    showError,
    Tooltip,
} from '@/components/ui';
import StafLayout from '@/layouts/StafLayout';
import { formatDateTime } from '@/lib/date';

interface User { id: number; name: string; }

interface Item {
    id: number; user_id: number; kategori: string; judul: string; slug: string | null;
    ringkasan: string | null; isi: string; gambar: string | null; video_url: string | null;
    tanggal_kegiatan: string | null; lokasi: string | null; is_published: boolean;
    published_at: string | null; created_at: string; updated_at: string; user?: User | null;
}

interface PaginatedData { data: Item[]; current_page: number; last_page: number; per_page: number; total: number; from: number | null; to: number | null; links: { url: string | null; label: string; active: boolean }[]; }

interface Props { items: PaginatedData; filters: { search: string }; }

export default function KegiatanIndex({ items, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [deletingItem, setDeletingItem] = useState<Item | null>(null);
    const [detailItem, setDetailItem] = useState<Item | null>(null);

    useEffect(() => { setSearch(filters.search); }, [filters.search]);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const doSearch = useCallback((keyword: string) => { router.get('/staf/kegiatan', { search: keyword.trim() || undefined }, { preserveState: true, preserveScroll: true, replace: true }); }, []);
    const handleSearchChange = (value: string) => { setSearch(value); if (debounceRef.current) clearTimeout(debounceRef.current); debounceRef.current = setTimeout(() => doSearch(value), 300); };

    const openCreate = () => router.visit('/staf/kegiatan/create');
    const openEdit = (item: Item) => router.visit(`/staf/kegiatan/${item.id}/edit`);
    const openDelete = (item: Item) => { setDeletingItem(item); setIsDeleteOpen(true); };
    const openDetail = (item: Item) => { setDetailItem(item); setIsDetailOpen(true); };
    const handleTogglePublish = (item: Item) => { router.post(`/staf/kegiatan/${item.id}/toggle-publish`, {}, { preserveScroll: true, onError: () => showError('Gagal mengubah status publikasi.') }); };

    const handleDelete = () => { if (!deletingItem) return; router.delete(`/staf/kegiatan/${deletingItem.id}`, { preserveScroll: true, onSuccess: () => { setIsDeleteOpen(false); setDeletingItem(null); }, onError: () => showError('Gagal menghapus kegiatan.') }); };

    return (
        <StafLayout title="Kegiatan" breadcrumbs={[{ label: 'Dashboard', href: '/staf' }, { label: 'Kegiatan' }]}>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div><h1 className="text-2xl font-bold">Kegiatan</h1><p className="text-base-content/60 mt-1">Kelola kegiatan Kelurahan Ardipura</p></div>
                    <Button color="primary" onClick={openCreate}>+ Tambah Kegiatan</Button>
                </div>

                <div className="card bg-base-100 shadow">
                    <div className="card-body p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <label className="input flex-1 min-w-0 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <input type="text" className="grow bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0" placeholder="Cari judul kegiatan..." value={search} onChange={(e) => handleSearchChange(e.target.value)} />
                                {search && <button type="button" className="btn btn-ghost btn-xs btn-circle" onClick={() => handleSearchChange('')}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>}
                            </label>
                        </div>
                        <p className="text-xs text-base-content/50 mt-2">Menampilkan {items.from ?? 0}–{items.to ?? 0} dari {items.total} kegiatan</p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow overflow-x-auto">
                    <Table className="table-sm">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>No</TableHeaderCell>
                                <TableHeaderCell>Judul</TableHeaderCell>
                                <TableHeaderCell className="hidden lg:table-cell">Penulis</TableHeaderCell>
                                <TableHeaderCell>Status</TableHeaderCell>
                                <TableHeaderCell className="hidden md:table-cell">Tgl Publikasi</TableHeaderCell>
                                <TableHeaderCell className="text-center">Aksi</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.data.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-12 text-base-content/50">Belum ada kegiatan.</TableCell></TableRow>
                            ) : items.data.map((item, i) => (
                                <TableRow key={item.id} className="hover">
                                    <TableCell>{(items.from ?? 1) + i}</TableCell>
                                    <TableCell><div className="font-medium">{item.judul}</div>{item.ringkasan && <div className="text-xs text-base-content/50 line-clamp-1">{item.ringkasan}</div>}</TableCell>
                                    <TableCell className="hidden lg:table-cell text-xs">{item.user?.name ?? '—'}</TableCell>
                                    <TableCell>{item.is_published ? <Badge color="success" size="sm">Published</Badge> : <Badge color="ghost" size="sm">Draft</Badge>}</TableCell>
                                    <TableCell className="hidden md:table-cell text-xs">{item.published_at ? formatDateTime(item.published_at) : '—'}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-1">
                                            <Tooltip tip="Detail"><Button size="sm" color="info" variant="soft" circle onClick={() => openDetail(item)} title="Lihat Detail">👁️</Button></Tooltip>
                                            <Tooltip tip={item.is_published ? 'Sembunyikan' : 'Publikasikan'}><Button size="sm" color={item.is_published ? 'warning' : 'success'} variant="soft" circle onClick={() => handleTogglePublish(item)} title={item.is_published ? 'Sembunyikan' : 'Publikasikan'}>{item.is_published ? '🙈' : '🌐'}</Button></Tooltip>
                                            <Tooltip tip="Edit"><Button size="sm" color="warning" variant="soft" circle onClick={() => openEdit(item)} title="Edit Kegiatan">✏️</Button></Tooltip>
                                            <Tooltip tip="Hapus"><Button size="sm" color="error" variant="soft" circle onClick={() => openDelete(item)} title="Hapus Kegiatan">🗑️</Button></Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <LaravelPagination data={items} />
            </div>

            <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
                <ModalHeader>Hapus Kegiatan</ModalHeader>
                <ModalBody><p>Yakin ingin menghapus kegiatan <strong>{deletingItem?.judul}</strong>?</p><p className="text-sm text-error mt-2">Tindakan ini tidak dapat dibatalkan.</p></ModalBody>
                <ModalAction><Button color="ghost" onClick={() => setIsDeleteOpen(false)}>Batal</Button><Button color="error" onClick={handleDelete}>Hapus</Button></ModalAction>
            </Modal>

            <Modal open={isDetailOpen} onClose={() => setIsDetailOpen(false)} boxClassName="max-w-3xl w-full">
                <ModalHeader>Detail Kegiatan</ModalHeader>
                <ModalBody className="max-h-[70vh] overflow-y-auto">
                    {detailItem && (
                        <article className="space-y-4">
                            <div><h4 className="text-sm font-semibold text-primary mb-2">Informasi Kegiatan</h4><div className="grid grid-cols-2 gap-2 text-sm"><div><span className="text-base-content/60">Judul:</span> {detailItem.judul}</div><div><span className="text-base-content/60">Slug:</span> <span className="font-mono text-xs">{detailItem.slug || '—'}</span></div><div><span className="text-base-content/60">Penulis:</span> {detailItem.user?.name || '—'}</div></div></div>
                            {detailItem.ringkasan && (<> <div className="divider my-2" /><div><h4 className="text-sm font-semibold text-primary mb-2">Ringkasan</h4><p className="text-sm">{detailItem.ringkasan}</p></div></>)}
                            <div className="divider my-2" /><div><h4 className="text-sm font-semibold text-primary mb-2">Isi Kegiatan</h4><article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: detailItem.isi }} /></div>
                            {detailItem.gambar && (<> <div className="divider my-2" /><div><h4 className="text-sm font-semibold text-primary mb-2">Gambar</h4><img src={`/storage/${detailItem.gambar}`} alt={detailItem.judul} className="max-h-64 w-auto rounded object-cover" /></div></>)}
                            {(detailItem.tanggal_kegiatan || detailItem.lokasi) && (<> <div className="divider my-2" /><div><h4 className="text-sm font-semibold text-primary mb-2">Detail Kegiatan</h4><div className="grid grid-cols-2 gap-2 text-sm">{detailItem.tanggal_kegiatan && <div><span className="text-base-content/60">Tanggal:</span> {formatDateTime(detailItem.tanggal_kegiatan)}</div>}{detailItem.lokasi && <div><span className="text-base-content/60">Lokasi:</span> {detailItem.lokasi}</div>}</div></div></>)}
                            <div className="divider my-2" />
                            <div><h4 className="text-sm font-semibold text-primary mb-2">Publikasi</h4><div className="grid grid-cols-2 gap-2 text-sm"><div><span className="text-base-content/60">Status:</span> {detailItem.is_published ? <Badge color="success" size="sm">Published</Badge> : <Badge color="ghost" size="sm">Draft</Badge>}</div><div><span className="text-base-content/60">Tgl Publikasi:</span> {detailItem.published_at ? formatDateTime(detailItem.published_at) : '—'}</div><div><span className="text-base-content/60">Dibuat:</span> {formatDateTime(detailItem.created_at)}</div><div><span className="text-base-content/60">Diupdate:</span> {formatDateTime(detailItem.updated_at)}</div></div></div>
                        </article>
                    )}
                </ModalBody>
                <ModalAction><Button color="primary" onClick={() => setIsDetailOpen(false)}>Tutup</Button></ModalAction>
            </Modal>
        </StafLayout>
    );
}
