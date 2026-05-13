import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

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
const inputDarkClass = 'mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-gray-600 rounded-lg';

export default function Keuangan({ cashflows, filters, saldo }) {
    const [isAddOpen, setIsAddOpen]     = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [filterBulan, setFilterBulan] = useState(filters?.bulan || '');
    const [filterTahun, setFilterTahun] = useState(filters?.tahun || '');
    const isFirstRender = useRef(true);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        tipe_transaksi:    'Pemasukan',
        nominal:           '',
        keterangan:        '',
        tanggal_transaksi: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        router.get(route('bendahara.keuangan.index'),
            { bulan: filterBulan || undefined, tahun: filterTahun || undefined },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    }, [filterBulan, filterTahun]);

    const openEdit = (item) => {
        setEditingItem(item);
        setData({
            tipe_transaksi:    item.tipe_transaksi,
            nominal:           item.nominal,
            keterangan:        item.keterangan,
            tanggal_transaksi: item.tanggal_transaksi,
        });
    };

    const closeModal = () => { setIsAddOpen(false); setEditingItem(null); reset(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            patch(route('bendahara.keuangan.update', editingItem.id), { onSuccess: closeModal });
        } else {
            post(route('bendahara.keuangan.store'), { onSuccess: closeModal });
        }
    };

    const handleDelete = () => {
        router.delete(route('bendahara.keuangan.destroy', deletingItem.id), {
            onSuccess: () => setDeletingItem(null),
        });
    };

    const tahunOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <AuthenticatedLayout>
            <Head title="Buku Kas" />
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold">Buku Kas</h1>
                            <p className="text-gray-400 text-sm mt-1">Pencatatan arus keuangan PS. Garuda Amarta</p>
                        </div>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                        >
                            <Plus size={16} />
                            Catat Transaksi
                        </button>
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

                    {/* Table */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    {['Tanggal', 'Tipe', 'Keterangan', 'Nominal', 'Aksi'].map((h) => (
                                        <th key={h} className={`px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider ${h === 'Nominal' ? 'text-right' : h === 'Aksi' ? 'text-center' : 'text-left'}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {cashflows.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-14 text-center text-gray-500 text-sm">
                                            Belum ada transaksi tercatat.
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
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => openEdit(item)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingItem(item)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
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

            {/* Add / Edit Modal */}
            <Modal show={isAddOpen || !!editingItem} onClose={closeModal} maxWidth="md">
                <form onSubmit={handleSubmit} className="p-6 bg-[#1a1a1a] rounded-2xl">
                    <h2 className="text-lg font-semibold text-white mb-5">
                        {editingItem ? 'Edit Transaksi' : 'Catat Transaksi Baru'}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Tipe Transaksi" className="text-gray-400 text-sm mb-1" />
                            <select value={data.tipe_transaksi} onChange={(e) => setData('tipe_transaksi', e.target.value)} className={`w-full ${selectClass}`}>
                                <option value="Pemasukan" className="bg-[#1a1a1a]">Pemasukan</option>
                                <option value="Pengeluaran" className="bg-[#1a1a1a]">Pengeluaran</option>
                            </select>
                            <InputError message={errors.tipe_transaksi} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Nominal (Rp)" className="text-gray-400 text-sm mb-1" />
                            <TextInput
                                type="number"
                                value={data.nominal}
                                onChange={(e) => setData('nominal', e.target.value)}
                                min="1"
                                placeholder="150000"
                                className={inputDarkClass}
                            />
                            <InputError message={errors.nominal} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Keterangan" className="text-gray-400 text-sm mb-1" />
                            <textarea
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                rows={3}
                                placeholder="Contoh: Uang kas bulan Maret"
                                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
                            />
                            <InputError message={errors.keterangan} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Tanggal Transaksi" className="text-gray-400 text-sm mb-1" />
                            <TextInput
                                type="date"
                                value={data.tanggal_transaksi}
                                onChange={(e) => setData('tanggal_transaksi', e.target.value)}
                                className={inputDarkClass}
                            />
                            <InputError message={errors.tanggal_transaksi} className="mt-1" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <SecondaryButton type="button" onClick={closeModal}>Batal</SecondaryButton>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal show={!!deletingItem} onClose={() => setDeletingItem(null)} maxWidth="sm">
                <div className="p-6 bg-[#1a1a1a] rounded-2xl">
                    <h2 className="text-lg font-semibold text-white mb-2">Hapus Transaksi?</h2>
                    <p className="text-gray-400 text-sm mb-6">
                        Transaksi <span className="text-white font-medium">"{deletingItem?.keterangan}"</span> akan dihapus secara permanen.
                    </p>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setDeletingItem(null)}>Batal</SecondaryButton>
                        <DangerButton onClick={handleDelete}>Hapus</DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
