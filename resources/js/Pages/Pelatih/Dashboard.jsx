import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import KartuAnggota from '@/Components/KartuAnggota';
import { Head, Link } from '@inertiajs/react';
import { Wallet, ShieldCheck, ArrowRight, CreditCard, Users } from 'lucide-react';

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
    {
        href: 'pelatih.murid-baru.index',
        icon: Users,
        label: 'Murid Baru',
        desc: 'Setujui atau tolak pendaftaran murid',
    },
];

export default function Dashboard({ pelatih }) {
    return (
        <AuthenticatedLayout>
            <Head title="Pelatih Dashboard" />

            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#141c25]">Dashboard Pelatih</h1>
                <p className="text-sm text-[#585f67] mt-0.5">
                    {pelatih ? `Selamat datang, ${pelatih.gelar ? pelatih.gelar + ' ' : ''}${pelatih.nama}.` : 'Pantau perkembangan murid dan ranting Anda.'}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl">
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

            {/* Kartu Anggota — hanya tampil jika pelatih punya nomor anggota */}
            {pelatih?.nomor_anggota && (
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-4">
                        <CreditCard size={18} className="text-[#610000]" />
                        <h2 className="text-lg font-semibold text-[#141c25]">Kartu Anggota</h2>
                    </div>
                    <KartuAnggota
                        nama={pelatih.nama}
                        nomor_anggota={pelatih.nomor_anggota}
                        ranting={pelatih.ranting}
                        role="Pelatih"
                        foto={pelatih.foto}
                        gelar={pelatih.gelar}
                        sabuk={pelatih.sabuk}
                    />
                </div>
            )}
        </AuthenticatedLayout>
    );
}
