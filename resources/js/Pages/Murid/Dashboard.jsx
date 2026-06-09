import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Clock, CheckCircle, User, Calendar, Award, LogOut } from 'lucide-react';

export default function Dashboard({ murid, pending }) {
    const handleLogout = () => {
        router.post(route('logout'));
    };

    if (pending) {
        return (
            <AuthenticatedLayout>
                <Head title="Menunggu Verifikasi" />

                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="max-w-lg w-full">
                        {/* Pending State Card */}
                        <div className="bg-white border border-orange-100 rounded-2xl shadow-sm overflow-hidden">
                            {/* Header */}
                            <div className="bg-orange-50 border-b border-orange-100 px-8 py-8 text-center">
                                <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Clock size={32} className="text-orange-500" />
                                </div>
                                <h1 className="text-xl font-bold text-[#141c25]">Pendaftaran Menunggu Verifikasi</h1>
                                <p className="mt-2 text-sm text-[#585f67] leading-relaxed">
                                    Data Anda sedang ditinjau oleh Pelatih. Anda akan mendapatkan akses penuh setelah disetujui.
                                </p>
                            </div>

                            {/* Data Pendaftaran */}
                            <div className="px-8 py-6 space-y-4">
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Data yang Sudah Diisi</h2>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#ffebee] rounded flex items-center justify-center flex-shrink-0">
                                            <User size={15} className="text-[#610000]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Nama</p>
                                            <p className="text-sm font-semibold text-[#141c25]">{murid.nama}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#ffebee] rounded flex items-center justify-center flex-shrink-0">
                                            <span className="text-[#610000] text-xs font-bold">@</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Email</p>
                                            <p className="text-sm font-semibold text-[#141c25]">{murid.email}</p>
                                        </div>
                                    </div>

                                    {murid.ranting && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#ffebee] rounded flex items-center justify-center flex-shrink-0">
                                                <Award size={15} className="text-[#610000]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Ranting yang Dipilih</p>
                                                <p className="text-sm font-semibold text-[#141c25]">{murid.ranting}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-xs text-orange-500">
                                        <Clock size={13} />
                                        <span>Status: Menunggu persetujuan Pelatih</span>
                                    </div>
                                </div>
                            </div>

                            {/* Logout */}
                            <div className="px-8 pb-6">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-[#585f67] text-sm font-medium rounded-lg hover:bg-gray-50 hover:text-[#141c25] transition-all"
                                >
                                    <LogOut size={15} />
                                    Keluar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Dashboard normal (sudah diverifikasi)
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Murid" />

            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#141c25]">Dashboard Murid</h1>
                <p className="text-sm text-[#585f67] mt-0.5">Selamat datang, {murid.nama}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                {/* Kartu Profil */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-[#ffebee] rounded flex items-center justify-center">
                            <User size={16} className="text-[#610000]" />
                        </div>
                        <h3 className="font-semibold text-[#141c25]">Profil Saya</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Nama</span>
                            <p className="text-[#141c25] font-medium mt-0.5">{murid.nama}</p>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Email</span>
                            <p className="text-[#585f67] mt-0.5">{murid.email}</p>
                        </div>
                        {murid.nomor_anggota && (
                            <div>
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">No. Anggota</span>
                                <p className="text-[#141c25] font-mono font-medium mt-0.5">{murid.nomor_anggota}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Kartu Ranting / Tingkatan */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-[#ffebee] rounded flex items-center justify-center">
                            <Award size={16} className="text-[#610000]" />
                        </div>
                        <h3 className="font-semibold text-[#141c25]">Ranting</h3>
                    </div>
                    <span className="inline-block bg-[#610000] text-white px-4 py-1.5 rounded text-sm font-medium">
                        {murid.ranting || 'Belum ada ranting'}
                    </span>
                </div>

                {/* Kartu Status Verifikasi */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-[#ffebee] rounded flex items-center justify-center">
                            <CheckCircle size={16} className="text-[#610000]" />
                        </div>
                        <h3 className="font-semibold text-[#141c25]">Status</h3>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                        murid.status_verifikasi === 'Aktif'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : murid.status_verifikasi === 'Ditolak'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}>
                        <CheckCircle size={13} />
                        {murid.status_verifikasi || 'Menunggu'}
                    </span>
                    {murid.disetujui_pada && (
                        <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                            <Calendar size={11} />
                            Disetujui: {new Date(murid.disetujui_pada).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    )}
                </div>
            </div>

            {/* Quick link */}
            <div className="mt-4 max-w-4xl">
                <Link
                    href={route('murid.events.index')}
                    className="inline-flex items-center gap-2 text-sm text-[#610000] hover:text-[#7a0000] font-medium transition-colors"
                >
                    <Calendar size={15} />
                    Lihat Acara Mendatang &rarr;
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
