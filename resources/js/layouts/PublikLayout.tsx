import { Head, Link, usePage } from '@inertiajs/react';
import { type ReactNode, useState, useRef, useEffect } from 'react';

interface PublikLayoutProps {
    children: ReactNode;
    title: string;
}

type MenuItem = {
    label: string;
    href?: string;
    children?: { label: string; href: string }[];
};

const menuItems: MenuItem[] = [
    { label: 'Beranda', href: '/' },
    {
        label: 'Profil',
        children: [
            { label: 'Visi Misi', href: '/profil/visi-misi' },
            { label: 'Struktur Organisasi', href: '/profil/struktur-organisasi' },
            { label: 'Peta', href: '/profil/peta' },
        ],
    },
    { label: 'Informasi & Layanan', href: '/informasi' },
    {
        label: 'Berita',
        children: [
            { label: 'Berita', href: '/berita' },
            { label: 'Artikel', href: '/artikel' },
            { label: 'Pengumuman', href: '/pengumuman' },
            { label: 'Kegiatan', href: '/kegiatan' },
            { label: 'Berita Video', href: '/berita-video' },
        ],
    },
];

function isActiveRoute(currentPath: string, href?: string, children?: { href: string }[]): boolean {
    if (href) {
        if (href === '/') return currentPath === '/';
        return currentPath === href || currentPath.startsWith(href + '/') || currentPath.startsWith(href + '?');
    }
    if (children) {
        return children.some((c) => currentPath === c.href || currentPath.startsWith(c.href + '/') || currentPath.startsWith(c.href + '?'));
    }
    return false;
}

export default function PublikLayout({ children, title }: PublikLayoutProps) {
    const { name, auth } = usePage<{ name?: string; auth?: { user: { name: string; email: string; role: string } | null } }>().props;
    const user = auth?.user ?? null;
    const currentUrl = usePage().url;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleDropdownEnter = (label: string) => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        setOpenDropdown(label);
    };

    const handleDropdownLeave = (label: string) => {
        closeTimerRef.current = setTimeout(() => {
            setOpenDropdown((current) => (current === label ? null : current));
        }, 150);
    };

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        };
    }, []);

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
                {/* Navbar */}
                <nav className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-base-200">
                    <div className="navbar-start">
                        <Link href="/" className="btn btn-ghost px-2">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/logo.png"
                                    alt="Logo Kota Jayapura"
                                    className="h-10 w-auto"
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="navbar-center hidden lg:flex">
                        <div className="flex items-center gap-1">
                            {menuItems.map((item) => {
                                if (item.children) {
                                    const parentActive = isActiveRoute(currentUrl, undefined, item.children);
                                    const isOpen = openDropdown === item.label;
                                    return (
                                        <div
                                            key={item.label}
                                            ref={(el) => {
                                                if (el) dropdownRefs.current.set(item.label, el);
                                                else dropdownRefs.current.delete(item.label);
                                            }}
                                            className="relative"
                                            onMouseEnter={() => handleDropdownEnter(item.label)}
                                            onMouseLeave={() => handleDropdownLeave(item.label)}
                                        >
                                            <div
                                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                                                    parentActive || isOpen
                                                        ? 'bg-primary text-primary-content shadow-md'
                                                        : 'text-base-content hover:bg-base-200'
                                                }`}
                                            >
                                                {item.label}
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                            {isOpen && (
                                                <ul className="absolute left-0 top-full mt-2 menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg">
                                                    {item.children.map((child) => {
                                                        const childActive = isActiveRoute(currentUrl, child.href);
                                                        return (
                                                            <li key={child.href}>
                                                                <Link
                                                                    href={child.href}
                                                                    className={childActive ? 'active bg-primary text-primary-content' : ''}
                                                                >
                                                                    {child.label}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </div>
                                    );
                                }
                                const active = isActiveRoute(currentUrl, item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href!}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                            active
                                                ? 'bg-primary text-primary-content shadow-md'
                                                : 'text-base-content hover:bg-base-200'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="navbar-end gap-2">
                        {user ? (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                    <li className="menu-title">{user.name}</li>
                                    <li><Link href={`/${user.role}`}>Dashboard</Link></li>
                                    <li><Link href="/logout" method="post" as="button" className="text-error">Keluar</Link></li>
                                </ul>
                            </div>
                        ) : (
                            <Link href="/login" className="btn btn-primary btn-sm">Masuk</Link>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            className="btn btn-ghost btn-square lg:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-base-100 border-b border-base-200 shadow-lg">
                        <div className="px-4 py-2 space-y-1">
                            {menuItems.map((item) => {
                                if (item.children) {
                                    return (
                                        <div key={item.label} className="space-y-1">
                                            <div className="px-4 py-2 text-sm font-semibold text-base-content/60 uppercase tracking-wider">
                                                {item.label}
                                            </div>
                                            {item.children.map((child) => {
                                                const childActive = isActiveRoute(currentUrl, child.href);
                                                return (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-4 ${
                                                            childActive
                                                                ? 'bg-primary text-primary-content'
                                                                : 'text-base-content hover:bg-base-200'
                                                        }`}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    );
                                }
                                const active = isActiveRoute(currentUrl, item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href!}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            active
                                                ? 'bg-primary text-primary-content'
                                                : 'text-base-content hover:bg-base-200'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Page Content */}
                {children}

                {/* Footer */}
                <footer className="bg-base-300 text-base-content">
                    <div className="max-w-6xl mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    {name ?? 'SIAKAD'}
                                </h3>
                                <p className="text-base-content/70 text-sm leading-relaxed">
                                    Sistem Informasi Kependudukan Kelurahan Ardipura.
                                    Solusi modern untuk layanan administrasi kependudukan
                                    yang cepat, transparan, dan terintegrasi.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">Menu Cepat</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/" className="text-base-content/70 hover:text-primary transition-colors">Beranda</Link></li>
                                    <li><Link href="/informasi" className="text-base-content/70 hover:text-primary transition-colors">Informasi & Layanan</Link></li>
                                    <li><Link href="/berita" className="text-base-content/70 hover:text-primary transition-colors">Berita</Link></li>
                                    <li><Link href="/profil/visi-misi" className="text-base-content/70 hover:text-primary transition-colors">Profil</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">Kontak Kelurahan</h4>
                                <ul className="space-y-2 text-sm text-base-content/70">
                                    <li className="flex items-start gap-2">
                                        <span>📍</span>
                                        <span>Jl. Ardipura, Distrik Jayapura Selatan, Kota Jayapura, Papua</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>📞</span>
                                        <span>(0967) 123456</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>✉️</span>
                                        <span>kelurahan.ardipura@example.com</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-base-content/10 mt-10 pt-6 text-center text-sm text-base-content/50">
                            <p>© {new Date().getFullYear()} {name ?? 'SIAKAD'} — Kelurahan Ardipura. Hak Cipta Dilindungi.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
