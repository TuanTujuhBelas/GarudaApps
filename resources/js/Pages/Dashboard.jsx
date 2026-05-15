import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <p className="text-[#141c25]">Selamat datang!</p>
            </div>
        </AuthenticatedLayout>
    );
}
