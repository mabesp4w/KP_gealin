import { Head, Link, usePage } from '@inertiajs/react';
import { type ReactNode, useEffect, useRef } from 'react';
import { showSuccess, showError, Navbar, NavbarStart, NavbarEnd } from '@/components/ui';

interface WargaLayoutProps {
    children: ReactNode;
    title: string;
}

export default function WargaLayout({ children, title }: WargaLayoutProps) {
    const { auth } = usePage<{ auth?: { user: { name: string; email: string } } }>().props;
    const currentUrl = usePage().url;

    const menuItems = [
        {
            label: 'Dashboard',
            href: '/warga',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
                </svg>
            ),
        },
        {
            label: 'Pengajuan Surat',
            href: '/warga/pengajuan',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            ),
        },
        {
            label: 'Riwayat Pengajuan',
            href: '/warga/riwayat',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    const isActive = (href: string) => {
        if (href === '/warga') return currentUrl === '/warga';
        return currentUrl.startsWith(href);
    };

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
            <div className="min-h-screen bg-base-200/50">
                {/* Top Navbar */}
                <Navbar className="sticky top-0 z-30 border-b border-base-300 bg-base-100 shadow-sm">
                    <NavbarStart>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary-content" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold leading-tight">Kel. Ardipura</p>
                                <p className="text-xs opacity-60">Layanan Warga</p>
                            </div>
                        </div>
                    </NavbarStart>
                    <NavbarEnd>
                        <div className="flex items-center gap-3">
                            <Link href="/logout" method="post" as="button" className="btn btn-ghost btn-sm gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Keluar
                            </Link>
                        </div>
                    </NavbarEnd>
                </Navbar>

                <div className="flex flex-col md:flex-row">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 bg-base-100 border-r border-base-300 md:sticky md:top-16 md:h-[calc(100vh-64px)] md:overflow-y-auto">
                        <nav className="menu p-4 gap-1">
                            {menuItems.map((item) => {
                                const active = isActive(item.href!);
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href!}
                                            className={
                                                active
                                                    ? 'active bg-primary text-primary-content font-semibold'
                                                    : 'hover:bg-base-200'
                                            }
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 p-4 md:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
