import { Link, usePage } from '@inertiajs/react';
import gamaLogo from '../../../public/gama.png';
import { useState } from 'react';
import {
    LayoutDashboard, Users, CalendarDays, Wallet, BookOpen,
    ShieldCheck, Calendar, LogOut, User, Menu, Award,
} from 'lucide-react';

const NAV_LINKS = {
    'Super Admin': [
        { href: 'admin.users.index',    label: 'Kelola Pengguna',  icon: Users },
        { href: 'admin.events.index',   label: 'Kelola Acara',     icon: CalendarDays },
        { href: 'admin.keuangan.index', label: 'Laporan Kas',      icon: Wallet },
        { href: 'admin.sabuk.index',    label: 'Tingkatan Sabuk',  icon: Award },
    ],
    'Bendahara': [
        { href: 'bendahara.keuangan.index', label: 'Buku Kas', icon: BookOpen },
    ],
    'Pelatih': [
        { href: 'pelatih.keuangan.index',   label: 'Laporan Kas',      icon: Wallet },
        { href: 'pelatih.verifikasi.index', label: 'Verifikasi Berkas', icon: ShieldCheck },
    ],
    'Murid': [
        { href: 'murid.events.index', label: 'Acara Mendatang', icon: Calendar },
    ],
};

const DASHBOARD_ROUTE = 'dashboard';

function SidebarContent({ user, role, links, dashRoute }) {
    return (
        <>
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10 flex-shrink-0">
                <img src={gamaLogo} alt="Garuda Apps" className="w-9 h-9 object-contain flex-shrink-0" />
                <div>
                    <h1 className="text-sm font-bold text-white leading-tight">Garuda Apps</h1>
                    <p className="text-[10px] text-gray-400 leading-tight">Management Portal</p>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto py-3 px-2">
                <Link
                    href={route(dashRoute)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-colors ${
                        route().current(dashRoute)
                            ? 'bg-[#610000] text-white'
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <LayoutDashboard size={17} />
                    Dashboard
                </Link>

                {links.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={route(href)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-colors ${
                            route().current(href)
                                ? 'bg-[#610000] text-white'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <Icon size={17} />
                        {label}
                    </Link>
                ))}
            </nav>

            {/* User + Logout */}
            <div className="border-t border-white/10 p-3 flex-shrink-0 space-y-0.5">
                <Link
                    href={route('profile.edit')}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                    <div className="w-7 h-7 bg-[#610000]/40 rounded flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-gray-300" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-white text-xs truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{role}</p>
                    </div>
                </Link>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
                >
                    <LogOut size={15} />
                    Keluar
                </Link>
            </div>
        </>
    );
}

export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;
    const role = user?.role?.nama_role;
    const links = NAV_LINKS[role] ?? [];
    const dashRoute = DASHBOARD_ROUTE;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-[#2a2d2e] fixed inset-y-0 left-0 z-50">
                <SidebarContent user={user} role={role} links={links} dashRoute={dashRoute} />
            </aside>

            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2a2d2e] flex flex-col transform transition-transform duration-200 lg:hidden ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <SidebarContent user={user} role={role} links={links} dashRoute={dashRoute} />
            </aside>

            {/* Main */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Mobile topbar */}
                <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#2a2d2e] border-b border-white/10 flex-shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-300 hover:text-white transition-colors"
                    >
                        <Menu size={22} />
                    </button>
                    <img src={gamaLogo} alt="Garuda Apps" className="w-7 h-7 object-contain" />
                    <span className="text-sm font-semibold text-white">Garuda Apps</span>
                </div>

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
