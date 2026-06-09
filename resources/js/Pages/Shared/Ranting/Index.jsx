import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ rantings }) {
    const rantingList = Array.isArray(rantings) ? rantings : (rantings?.data ?? []);

    return (
        <AuthenticatedLayout>
            <Head title="Daftar Ranting" />

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#141c25]">Daftar Ranting</h1>
                <p className="text-[#585f67] text-sm mt-0.5">Informasi cabang/ranting PS. Garuda Amarta</p>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden max-w-4xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#2a2d2e]">
                                {['Kode', 'Nama Ranting', 'Keterangan', 'Jumlah Murid', 'Jumlah Pelatih'].map((h) => (
                                    <th
                                        key={h}
                                        className="px-6 py-4 text-xs font-medium text-white uppercase tracking-wider text-left"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rantingList.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-14 text-center text-[#585f67] text-sm">
                                        Belum ada data ranting yang tersedia.
                                    </td>
                                </tr>
                            )}
                            {rantingList.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-[#f3e5f5] text-[#6a1b9a]">
                                            {item.kode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-[#141c25]">{item.nama_ranting}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#585f67] max-w-xs">
                                        <span className="line-clamp-2">{item.keterangan || '—'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#585f67]">
                                        {item.murid_count ?? 0}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#585f67]">
                                        {item.pelatih_count ?? 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
