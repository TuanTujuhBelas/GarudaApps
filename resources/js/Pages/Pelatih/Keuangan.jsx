import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const formatRupiah = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const formatTanggal = (d) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

const BULAN = [
    ['1','Januari'],['2','Februari'],['3','Maret'],['4','April'],
    ['5','Mei'],['6','Juni'],['7','Juli'],['8','Agustus'],
    ['9','September'],['10','Oktober'],['11','November'],['12','Desember'],
];

const selectClass = 'bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50';

export default function Keuangan({ cashflows, filters, saldo }) {
    const [filterBulan, setFilterBulan] = useState(filters?.bulan || '');
    const [filterTahun, setFilterTahun] = useState(filters?.tahun || '');
    const isFirstRender = useRef(true);

    const routeName = route().current()?.startsWith('admin') ? 'admin.keuangan.index' : 'pelatih.keuangan.index';

    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        router.get(route(routeName),
            { bulan: filterBulan || undefined, tahun: filterTahun || undefined },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    }, [filterBulan, filterTahun]);

    const tahunOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <AuthenticatedLayout>
            <Head title="Laporan Keuangan" />
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
                        <p className="text-gray-400 text-sm mt-1">Transparansi arus kas PS. Garuda Amarta — hanya baca</p>
                    </div>

                    {/* Saldo Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp size={18} className="text-emerald-400" />
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Total Pemasukan</span>
                            </div>
                            <p className="text-xl font-bold text-emerald-400">{formatRupiah(saldo.pemasukan)}</p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingDown size={18} className="text-red-400" />
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Total Pengeluaran</span>
                            </div>
                            <p className="text-xl font-bold text-red-400">{formatRupiah(saldo.pengeluaran)}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Wallet size={18} className="text-white" />
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Saldo Akhir</span>
                            </div>
                            <p className={`text-xl font-bold ${saldo.akhir >= 0 ? 'text-white' : 'text-red-400'}`}>
                                {formatRupiah(saldo.akhir)}
                            </p>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <select value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)} className={selectClass}>
                            <option value="" className="bg-[#1a1a1a]">Semua Bulan</option>
                            {BULAN.map(([v, l]) => <option key={v} value={v} className="bg-[#1a1a1a]">{l}</option>)}
                        </select>
                        <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} className={selectClass}>
                            <option value="" className="bg-[#1a1a1a]">Semua Tahun</option>
                            {tahunOptions.map(t => <option key={t} value={t} className="bg-[#1a1a1a]">{t}</option>)}
                        </select>
                    </div>

                    {/* Table (read-only) */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    {['Tanggal', 'Tipe', 'Keterangan', 'Nominal', 'Dicatat Oleh'].map((h) => (
                                        <th key={h} className={`px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider ${h === 'Nominal' ? 'text-right' : 'text-left'}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {cashflows.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-14 text-center text-gray-500 text-sm">
                                            Belum ada data transaksi.
                                        </td>
                                    </tr>
                                )}
                                {cashflows.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">{formatTanggal(item.tanggal_transaksi)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                item.tipe_transaksi === 'Pemasukan'
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : 'bg-red-500/20 text-red-400'
                                            }`}>
                                                {item.tipe_transaksi}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">
                                            <span className="line-clamp-2">{item.keterangan}</span>
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-semibold text-right whitespace-nowrap ${
                                            item.tipe_transaksi === 'Pemasukan' ? 'text-emerald-400' : 'text-red-400'
                                        }`}>
                                            {item.tipe_transaksi === 'Pengeluaran' ? '−' : '+'}{formatRupiah(item.nominal)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{item.bendahara?.name ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {cashflows.links && cashflows.links.length > 3 && (
                            <div className="px-6 py-4 border-t border-white/10 flex flex-wrap justify-center gap-1">
                                {cashflows.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                            link.active ? 'bg-red-600 text-white'
                                                : link.url ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                : 'bg-white/5 text-gray-600 cursor-not-allowed pointer-events-none'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
