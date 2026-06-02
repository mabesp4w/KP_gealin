import { Head, Link, usePage } from '@inertiajs/react';
import { type ReactNode, useEffect, useRef } from 'react';
import { showSuccess, showError } from '@/components/ui';
import {
    Navbar,
    NavbarStart,
    NavbarEnd,
    Breadcrumbs,
    type BreadcrumbItem,
} from '@/components/ui';

interface StafLayoutProps {
    children: ReactNode;
    title: string;
    breadcrumbs?: BreadcrumbItem[];
}

const SIDEBAR_ID = 'staf-drawer';

const menuItems = [
    {
        label: 'Dashboard',
        href: '/staf',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
            </svg>
        ),
    },
    { type: 'title' as const, label: 'Data Kependudukan' },
    {
        label: 'Penduduk',
        href: '/staf/penduduk',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
    {
        label: 'Kartu Keluarga',
        href: '/staf/kartu-keluarga',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
        ),
    },
    {
        label: 'Mutasi Penduduk',
        href: '/staf/mutasi',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
        ),
    },
    { type: 'title' as const, label: 'Layanan Surat' },
    {
        label: 'Pengajuan Masuk',
        href: '/staf/pengajuan',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
        ),
    },
    {
        label: 'Surat',
        href: '/staf/surat',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        label: 'Jenis Surat',
        href: '/staf/jenis-surat',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
    },
    {
        label: 'Persyaratan Surat',
        href: '/staf/persyaratan-surat',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
    },
    { type: 'title' as const, label: 'Konten & Informasi' },
    {
        label: 'Berita',
        href: '/staf/berita',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
        ),
    },
    {
        label: 'Kegiatan',
        href: '/staf/kegiatan',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        label: 'Pengumuman',
        href: '/staf/pengumuman',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
        ),
    },
    {
        label: 'Berita Video',
        href: '/staf/berita-video',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        label: 'Artikel',
        href: '/staf/artikel',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    { type: 'title' as const, label: 'Laporan' },
    {
        label: 'Laporan',
        href: '/staf/laporan',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
];

export default function StafLayout({ children, title, breadcrumbs }: StafLayoutProps) {
    const { auth } = usePage<{ auth: { user: { name: string; email: string } } }>().props;
    const currentUrl = usePage().url;
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const activeLink = sidebarRef.current?.querySelector<HTMLElement>('a.active');
        if (activeLink) {
            activeLink.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }, [currentUrl]);

    const isActive = (href: string) => {
        if (href === '/staf') return currentUrl === '/staf';
        return currentUrl === href || currentUrl.startsWith(href + '/') || currentUrl.startsWith(href + '?');
    };

    const sidebarContent = (
        <aside ref={sidebarRef} className="menu bg-base-200 text-base-content min-h-full w-64 p-4">
            {/* Logo */}
            <div className="mb-6 flex items-center gap-3 px-2">
                <img src="/logo.svg" alt="Logo Kelurahan Ardipura" className="w-10 h-10" />
                <div>
                    <p className="text-sm font-bold leading-tight">Kel. Ardipura</p>
                    <p className="text-xs opacity-60">Panel Staf</p>
                </div>
            </div>

            <ul className="menu gap-1">
                {menuItems.map((item, index) => {
                    if ('type' in item && item.type === 'title') {
                        return (
                            <li key={index} className="menu-title mt-4 first:mt-0">
                                {item.label}
                            </li>
                        );
                    }
                    if ('href' in item) {
                        const active = isActive(item.href!);
                        return (
                            <li key={index}>
                                <Link
                                    href={item.href!}
                                    className={
                                        active
                                            ? 'active bg-primary text-primary-content font-semibold'
                                            : 'hover:bg-base-300'
                                    }
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            </li>
                        );
                    }
                    return null;
                })}
            </ul>
        </aside>
    );

    // ── Flash message toasts ──────────────────────────────
    const flash = (usePage().props as any).flash as { success?: string; error?: string } | undefined;
    const lastFlash = useRef('');

    useEffect(() => {
        if (!flash) return;
        const key = JSON.stringify(flash);
        if (key === lastFlash.current) return;
        lastFlash.current = key;
        if (flash.success) showSuccess(flash.success);
        if (flash.error) showError(flash.error);
    }, [flash]);

    return (
        <>
            <Head title={title} />
            <div className="drawer lg:drawer-open">
                <input id={SIDEBAR_ID} type="checkbox" className="drawer-toggle" />

                {/* Main content */}
                <div className="drawer-content flex min-h-screen flex-col bg-base-200/50">
                    {/* Top Navbar */}
                    <Navbar className="sticky top-0 z-30 border-b border-base-300 bg-base-100 shadow-sm">
                        <NavbarStart>
                            <label htmlFor={SIDEBAR_ID} className="btn btn-ghost btn-square lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </label>
                            {breadcrumbs && breadcrumbs.length > 0 && (
                                <Breadcrumbs items={breadcrumbs} className="hidden sm:block" />
                            )}
                        </NavbarStart>
                        <NavbarEnd>
                            <div className="flex items-center gap-3">
                                <span className="hidden text-sm text-base-content/70 sm:inline">{auth.user.name}</span>
                                <Link href="/logout" method="post" as="button" className="btn btn-ghost btn-sm gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Keluar
                                </Link>
                            </div>
                        </NavbarEnd>
                    </Navbar>

                    {/* Page content */}
                    <main className="flex-1 p-4 lg:p-6">
                        {children}
                    </main>
                </div>

                {/* Sidebar */}
                <div className="drawer-side z-40">
                    <label htmlFor={SIDEBAR_ID} aria-label="close sidebar" className="drawer-overlay" />
                    {sidebarContent}
                </div>
            </div>
        </>
    );
}
