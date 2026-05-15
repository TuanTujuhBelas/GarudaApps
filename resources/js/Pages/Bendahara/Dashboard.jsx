import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Bendahara Dashboard" />

            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#141c25]">Bendahara Dashboard</h1>
                <p className="text-sm text-[#585f67] mt-0.5">Kelola keuangan PS. Garuda Amarta.</p>
            </div>

            <div className="max-w-sm">
                <Link
                    href={route('bendahara.keuangan.index')}
                    className="group flex items-center justify-between bg-white border border-gray-200 rounded-lg p-5 hover:border-[#610000] transition-colors shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#ffebee] rounded flex items-center justify-center group-hover:bg-[#610000] transition-colors">
                            <BookOpen size={20} className="text-[#610000] group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <p className="font-semibold text-[#141c25]">Buku Kas</p>
                            <p className="text-sm text-[#585f67]">Catat dan kelola transaksi</p>
                        </div>
                    </div>
                    <ArrowRight size={18} className="text-gray-300 group-hover:text-[#610000] transition-colors" />
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
