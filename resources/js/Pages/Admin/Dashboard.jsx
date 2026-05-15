import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Users, CalendarDays, Wallet, Award } from 'lucide-react';

const quickLinks = [
    {
        href: 'admin.users.index',
        icon: Users,
        label: 'Kelola Pengguna',
        desc: 'Manajemen akun, role, dan status pengguna sistem',
    },
    {
        href: 'admin.events.index',
        icon: CalendarDays,
        label: 'Kelola Acara',
        desc: 'Buat dan pantau acara serta pendaftaran murid',
    },
    {
        href: 'admin.keuangan.index',
        icon: Wallet,
        label: 'Laporan Kas',
        desc: 'Lihat arus keuangan PS. Garuda Amarta',
    },
    {
        href: 'admin.sabuk.index',
        icon: Award,
        label: 'Tingkatan Sabuk',
        desc: 'Kelola level sabuk pencak silat',
    },
];

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#141c25]">Admin Overview</h1>
                <p className="text-sm text-[#585f67] mt-0.5">Selamat datang, Super Admin. Kelola seluruh sistem PS. Garuda Amarta.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickLinks.map(({ href, icon: Icon, label, desc }) => (
                    <Link
                        key={href}
                        href={route(href)}
                        className="group bg-white border border-gray-200 rounded-lg p-5 hover:border-[#610000] transition-colors shadow-sm"
                    >
                        <div className="w-10 h-10 bg-[#ffebee] rounded flex items-center justify-center mb-4 group-hover:bg-[#610000] transition-colors">
                            <Icon size={20} className="text-[#610000] group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="font-semibold text-[#141c25] mb-1">{label}</h3>
                        <p className="text-sm text-[#585f67]">{desc}</p>
                    </Link>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
