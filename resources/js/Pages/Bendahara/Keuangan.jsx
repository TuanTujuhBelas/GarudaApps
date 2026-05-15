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

const selectClass = 'bg-white border border-gray-300 text-[#141c25] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#610000]/40 focus:border-[#610000]';
const inputClass  = 'mt-1 block w-full bg-white border-gray-300 text-[#141c25] placeholder-gray-400 rounded-lg';

export default function Keuangan({ cashflows, filters, saldo, routeNames }) {
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

    const indexRoute = routeNames.index;

    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        router.get(route(indexRoute),
            { bulan: filterBulan || undefined, tahun: filterTahun || undefined },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    }, [filterBulan, filterTahun, indexRoute]);

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
            patch(route(routeNames.update, editingItem.id), { onSuccess: closeModal });
        } else {
            post(route(routeNames.store), { onSuccess: closeModal });
        }
    };

    const handleDelete = () => {
        router.delete(route(routeNames.destroy, deletingItem.id), {
            onSuccess: () => setDeletingItem(null),
        });
    };

    const tahunOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <AuthenticatedLayout>
            <Head title="Buku Kas" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#141c25]">Buku Kas</h1>
                    <p className="text-[#585f67] text-sm mt-0.5">Pencatatan arus keuangan PS. Garuda Amarta</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 bg-[#610000] hover:bg-[#7a0000] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus size={16} />
                    Catat Transaksi
                </button>
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

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#2a2d2e]">
                            {['Tanggal', 'Tipe', 'Keterangan', 'Nominal', 'Aksi'].map((h) => (
                                <th key={h} className={`px-6 py-4 text-xs font-medium text-white uppercase tracking-wider ${h === 'Nominal' ? 'text-right' : h === 'Aksi' ? 'text-center' : 'text-left'}`}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {cashflows.data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-14 text-center text-[#585f67] text-sm">
                                    Belum ada transaksi tercatat.
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
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-1">
                                        <button
                                            onClick={() => openEdit(item)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#141c25] hover:bg-gray-100 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => setDeletingItem(item)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#b71c1c] hover:bg-[#ffebee] transition-colors"
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

            {/* Add / Edit Modal */}
            <Modal show={isAddOpen || !!editingItem} onClose={closeModal} maxWidth="md">
                <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg">
                    <h2 className="text-lg font-semibold text-[#141c25] mb-5">
                        {editingItem ? 'Edit Transaksi' : 'Catat Transaksi Baru'}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Tipe Transaksi" className="text-[#585f67] text-sm mb-1" />
                            <select value={data.tipe_transaksi} onChange={(e) => setData('tipe_transaksi', e.target.value)} className={`w-full ${selectClass}`}>
                                <option value="Pemasukan">Pemasukan</option>
                                <option value="Pengeluaran">Pengeluaran</option>
                            </select>
                            <InputError message={errors.tipe_transaksi} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Nominal (Rp)" className="text-[#585f67] text-sm mb-1" />
                            <TextInput
                                type="number"
                                value={data.nominal}
                                onChange={(e) => setData('nominal', e.target.value)}
                                min="1"
                                placeholder="150000"
                                className={inputClass}
                            />
                            <InputError message={errors.nominal} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Keterangan" className="text-[#585f67] text-sm mb-1" />
                            <textarea
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                rows={3}
                                placeholder="Contoh: Uang kas bulan Maret"
                                className="w-full bg-white border border-gray-300 text-[#141c25] placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#610000]/40 focus:border-[#610000] resize-none"
                            />
                            <InputError message={errors.keterangan} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Tanggal Transaksi" className="text-[#585f67] text-sm mb-1" />
                            <TextInput
                                type="date"
                                value={data.tanggal_transaksi}
                                onChange={(e) => setData('tanggal_transaksi', e.target.value)}
                                className={inputClass}
                            />
                            <InputError message={errors.tanggal_transaksi} className="mt-1" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <SecondaryButton type="button" onClick={closeModal}>Batal</SecondaryButton>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-4 py-2 bg-[#610000] hover:bg-[#7a0000] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal show={!!deletingItem} onClose={() => setDeletingItem(null)} maxWidth="sm">
                <div className="p-6 bg-white rounded-lg">
                    <h2 className="text-lg font-semibold text-[#141c25] mb-2">Hapus Transaksi?</h2>
                    <p className="text-[#585f67] text-sm mb-6">
                        Transaksi <span className="text-[#141c25] font-medium">"{deletingItem?.keterangan}"</span> akan dihapus secara permanen.
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
