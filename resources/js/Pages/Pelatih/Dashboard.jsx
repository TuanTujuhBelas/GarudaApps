import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Wallet, ShieldCheck, ArrowRight } from 'lucide-react';

const quickLinks = [
    {
        href: 'pelatih.keuangan.index',
        icon: Wallet,
        label: 'Laporan Kas',
        desc: 'Lihat transparansi arus keuangan',
    },
    {
        href: 'pelatih.verifikasi.index',
        icon: ShieldCheck,
        label: 'Verifikasi Berkas',
        desc: 'Periksa dan validasi berkas murid',
    },
];

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Pelatih Dashboard" />

            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#141c25]">Pelatih Dashboard</h1>
                <p className="text-sm text-[#585f67] mt-0.5">Pantau perkembangan murid dan ranting Anda.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                {quickLinks.map(({ href, icon: Icon, label, desc }) => (
                    <Link
                        key={href}
                        href={route(href)}
                        className="group flex items-center justify-between bg-white border border-gray-200 rounded-lg p-5 hover:border-[#610000] transition-colors shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#ffebee] rounded flex items-center justify-center group-hover:bg-[#610000] transition-colors">
                                <Icon size={20} className="text-[#610000] group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p className="font-semibold text-[#141c25]">{label}</p>
                                <p className="text-sm text-[#585f67]">{desc}</p>
                            </div>
                        </div>
                        <ArrowRight size={18} className="text-gray-300 group-hover:text-[#610000] transition-colors" />
                    </Link>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
