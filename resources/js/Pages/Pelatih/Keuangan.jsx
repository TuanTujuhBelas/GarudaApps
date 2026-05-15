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

const selectClass = 'bg-white border border-gray-300 text-[#141c25] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#610000]/40 focus:border-[#610000]';

export default function Keuangan({ cashflows, filters, saldo }) {
    const [filterBulan, setFilterBulan] = useState(filters?.bulan || '');
    const [filterTahun, setFilterTahun] = useState(filters?.tahun || '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        router.get(route('pelatih.keuangan.index'),
            { bulan: filterBulan || undefined, tahun: filterTahun || undefined },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    }, [filterBulan, filterTahun]);

    const tahunOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <AuthenticatedLayout>
            <Head title="Laporan Keuangan" />

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#141c25]">Laporan Keuangan</h1>
                <p className="text-[#585f67] text-sm mt-0.5">Transparansi arus kas PS. Garuda Amarta — hanya baca</p>
            </div>

            {/* Saldo Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={17} className="text-[#1b5e20]" />
                        <span className="text-xs text-[#585f67] uppercase tracking-wider font-medium">Total Pemasukan</span>
                    </div>
                    <p className="text-xl font-bold text-[#1b5e20]">{formatRupiah(saldo.pemasukan)}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown size={17} className="text-[#b71c1c]" />
                        <span className="text-xs text-[#585f67] uppercase tracking-wider font-medium">Total Pengeluaran</span>
                    </div>
                    <p className="text-xl font-bold text-[#b71c1c]">{formatRupiah(saldo.pengeluaran)}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Wallet size={17} className="text-[#141c25]" />
                        <span className="text-xs text-[#585f67] uppercase tracking-wider font-medium">Saldo Akhir</span>
                    </div>
                    <p className={`text-xl font-bold ${saldo.akhir >= 0 ? 'text-[#141c25]' : 'text-[#b71c1c]'}`}>
                        {formatRupiah(saldo.akhir)}
                    </p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-3 mb-5">
                <select value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)} className={selectClass}>
                    <option value="">Semua Bulan</option>
                    {BULAN.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} className={selectClass}>
                    <option value="">Semua Tahun</option>
                    {tahunOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {/* Table (read-only) */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#2a2d2e]">
                            {['Tanggal', 'Tipe', 'Keterangan', 'Nominal', 'Dicatat Oleh'].map((h) => (
                                <th key={h} className={`px-6 py-4 text-xs font-medium text-white uppercase tracking-wider ${h === 'Nominal' ? 'text-right' : 'text-left'}`}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {cashflows.data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-14 text-center text-[#585f67] text-sm">
                                    Belum ada data transaksi.
                                </td>
                            </tr>
                        )}
                        {cashflows.data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-[#585f67] whitespace-nowrap">{formatTanggal(item.tanggal_transaksi)}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        item.tipe_transaksi === 'Pemasukan'
                                            ? 'bg-[#e8f5e9] text-[#1b5e20]'
                                            : 'bg-[#ffebee] text-[#b71c1c]'
                                    }`}>
                                        {item.tipe_transaksi}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-[#585f67] max-w-xs">
                                    <span className="line-clamp-2">{item.keterangan}</span>
                                </td>
                                <td className={`px-6 py-4 text-sm font-semibold text-right whitespace-nowrap ${
                                    item.tipe_transaksi === 'Pemasukan' ? 'text-[#1b5e20]' : 'text-[#b71c1c]'
                                }`}>
                                    {item.tipe_transaksi === 'Pengeluaran' ? '−' : '+'}{formatRupiah(item.nominal)}
                                </td>
                                <td className="px-6 py-4 text-sm text-[#585f67]">{item.bendahara?.name ?? '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {cashflows.links && cashflows.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-center gap-1">
                        {cashflows.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                preserveScroll
                                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                                    link.active ? 'bg-[#610000] text-white'
                                        : link.url ? 'bg-gray-100 text-[#585f67] hover:bg-gray-200'
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
