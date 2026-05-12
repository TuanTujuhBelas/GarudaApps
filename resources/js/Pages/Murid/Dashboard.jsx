import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ user }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Murid
                </h2>
            }
        >
            <Head title="Dashboard Murid" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h3 className="mb-4 text-lg font-bold">Profil Saya</h3>
                                <p>Nama: {user.name}</p>
                                <p>Email: {user.email}</p>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h3 className="mb-4 text-lg font-bold">Tingkatan Saat Ini</h3>
                                <div className="inline-block rounded-full bg-red-100 px-4 py-2 text-red-800">
                                    {user.ranting?.nama_ranting || 'Belum ada tingkatan'}
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    {user.ranting?.keterangan}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
