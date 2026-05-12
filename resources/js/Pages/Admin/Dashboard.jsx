import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Selamat Datang, Super Admin! Anda memiliki akses penuh ke sistem.
                            <div className="mt-6">
                                <Link
                                    href={route('admin.users.index')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                                >
                                    Kelola Pengguna
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
