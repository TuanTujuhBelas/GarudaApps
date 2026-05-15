import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { User, Calendar } from 'lucide-react';

export default function Dashboard({ user }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Murid" />

            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#141c25]">Dashboard Murid</h1>
                <p className="text-sm text-[#585f67] mt-0.5">Selamat datang, {user.name}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                {/* Profil */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-[#ffebee] rounded flex items-center justify-center">
                            <User size={16} className="text-[#610000]" />
                        </div>
                        <h3 className="font-semibold text-[#141c25]">Profil Saya</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Nama</span>
                            <p className="text-[#141c25] font-medium mt-0.5">{user.name}</p>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Email</span>
                            <p className="text-[#585f67] mt-0.5">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Tingkatan */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-[#ffebee] rounded flex items-center justify-center">
                            <Calendar size={16} className="text-[#610000]" />
                        </div>
                        <h3 className="font-semibold text-[#141c25]">Tingkatan Saat Ini</h3>
                    </div>
                    <span className="inline-block bg-[#610000] text-white px-4 py-1.5 rounded text-sm font-medium">
                        {user.ranting?.nama_ranting || 'Belum ada tingkatan'}
                    </span>
                    {user.ranting?.keterangan && (
                        <p className="mt-2 text-sm text-[#585f67]">{user.ranting.keterangan}</p>
                    )}
                </div>
            </div>

            {/* Quick link */}
            <div className="mt-4 max-w-2xl">
                <Link
                    href={route('murid.events.index')}
                    className="inline-flex items-center gap-2 text-sm text-[#610000] hover:text-[#7a0000] font-medium transition-colors"
                >
                    Lihat Acara Mendatang →
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
