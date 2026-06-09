import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Search, Activity, Filter } from 'lucide-react';

const formatWaktu = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}`;
};

const getActionBadgeClass = (action) => {
    if (!action) return 'bg-gray-100 text-gray-700';
    const a = action.toLowerCase();
    if (a === 'login' || a === 'logout') return 'bg-blue-100 text-blue-700';
    if (a === 'register') return 'bg-purple-100 text-purple-700';
    if (a === 'approve_murid') return 'bg-green-100 text-green-700';
    if (a === 'reject_murid') return 'bg-red-100 text-red-700';
    if (a.startsWith('create_')) return 'bg-emerald-100 text-emerald-700';
    if (a.startsWith('update_')) return 'bg-orange-100 text-orange-700';
    if (a.startsWith('delete_')) return 'bg-red-100 text-red-700';
    if (a === 'verify_berkas' || a === 'upload_berkas') return 'bg-sky-100 text-sky-700';
    return 'bg-gray-100 text-gray-700';
};

export default function Index({ logs, filters, actions }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [filterAction, setFilterAction] = useState(filters?.action || '');
    const [filterDate, setFilterDate] = useState(filters?.date || '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            router.get(
                route('admin.logs.index'),
                {
                    search: search || undefined,
                    action: filterAction || undefined,
                    date: filterDate || undefined,
                },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const handleActionChange = (value) => {
        setFilterAction(value);
        router.get(
            route('admin.logs.index'),
            {
                search: search || undefined,
                action: value || undefined,
                date: filterDate || undefined,
            },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const handleDateChange = (value) => {
        setFilterDate(value);
        router.get(
            route('admin.logs.index'),
            {
                search: search || undefined,
                action: filterAction || undefined,
                date: value || undefined,
            },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const logList = logs?.data ?? [];

    return (
        <AuthenticatedLayout>
            <Head title="Log Aktivitas" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-0.5">
                    <Activity size={22} className="text-[#610000]" />
                    <h1 className="text-2xl font-semibold text-[#141c25]">Log Aktivitas</h1>
                </div>
                <p className="text-[#585f67] text-sm mt-0.5">Rekam jejak seluruh aktivitas pada sistem</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-5">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Search size={17} />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 bg-white border border-gray-300 text-[#141c25] rounded-lg focus:ring-2 focus:ring-[#610000]/40 focus:border-[#610000] transition-all placeholder:text-gray-400 text-sm"
                        placeholder="Cari nama pengguna atau deskripsi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Action filter */}
                <div className="flex items-center gap-2">
                    <Filter size={15} className="text-gray-400 flex-shrink-0" />
                    <select
                        value={filterAction}
                        onChange={(e) => handleActionChange(e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-300 text-[#141c25] rounded-lg focus:ring-2 focus:ring-[#610000]/40 focus:border-[#610000] appearance-none text-sm min-w-[160px]"
                    >
                        <option value="">Semua Aksi</option>
                        {(actions ?? []).map((a) => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </div>

                {/* Date filter */}
                <div>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-300 text-[#141c25] rounded-lg focus:ring-2 focus:ring-[#610000]/40 focus:border-[#610000] text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#2a2d2e]">
                                {['Waktu', 'Pengguna', 'Aksi', 'Deskripsi', 'IP Address'].map((h) => (
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
                            {logList.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-14 text-center text-[#585f67] text-sm">
                                        Tidak ada log aktivitas yang sesuai dengan filter yang dipilih.
                                    </td>
                                </tr>
                            )}
                            {logList.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-[#585f67] whitespace-nowrap font-mono text-xs">
                                        {formatWaktu(log.created_at)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.user ? (
                                            <div>
                                                <p className="text-sm font-medium text-[#141c25]">{log.user.name}</p>
                                                <p className="text-xs text-[#585f67]">{log.user.role?.nama_role ?? ''}</p>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-[#585f67] italic">Sistem</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getActionBadgeClass(log.action)}`}
                                        >
                                            {log.action ?? '—'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#585f67] max-w-sm">
                                        <span className="line-clamp-2">{log.description ?? '—'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-[#585f67] font-mono">
                                        {log.ip_address ?? '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs?.links && logs.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-center gap-1">
                        {logs.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                preserveState
                                preserveScroll
                                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                                    link.active
                                        ? 'bg-[#610000] text-white'
                                        : link.url
                                        ? 'bg-gray-100 text-[#585f67] hover:bg-gray-200'
                                        : 'bg-gray-100 text-gray-300 cursor-not-allowed pointer-events-none'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
