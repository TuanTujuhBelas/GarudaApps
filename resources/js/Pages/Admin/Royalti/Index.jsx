import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit2, Trash2, DollarSign } from 'lucide-react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

const BULAN = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
];

const TAHUN_OPTIONS = Array.from({ length: 7 }, (_, i) => 2024 + i);

const formatRupiah = (angka) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

const formatTanggal = (d) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

const inputClass = 'mt-1 block w-full bg-white border-gray-300 text-[#141c25] placeholder-gray-400 rounded-lg';
const selectClass =
    'mt-1 block w-full px-3 py-2.5 bg-white border border-gray-300 text-[#141c25] rounded-lg focus:ring-2 focus:ring-[#610000]/40 focus:border-[#610000] appearance-none text-sm';

export default function Index({ royaltis, filters, total, pelatihList }) {
    const now = new Date();
    const [filterBulan, setFilterBulan] = useState(filters?.bulan || '');
    const [filterTahun, setFilterTahun] = useState(filters?.tahun || '');
    const [filterPelatih, setFilterPelatih] = useState(filters?.pelatih_id || '');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);

    const applyFilter = (bulan, tahun, pelatihId) => {
        router.get(
            route('admin.royalti.index'),
            {
                bulan: bulan || undefined,
                tahun: tahun || undefined,
                pelatih_id: pelatihId || undefined,
            },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const handleFilterChange = (key, value) => {
        const next = { bulan: filterBulan, tahun: filterTahun, pelatih_id: filterPelatih, [key]: value };
        if (key === 'bulan') setFilterBulan(value);
        if (key === 'tahun') setFilterTahun(value);
        if (key === 'pelatih_id') setFilterPelatih(value);
        applyFilter(next.bulan, next.tahun, next.pelatih_id);
    };

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        pelatih_id: '',
        nominal: '',
        keterangan: '',
        tanggal_pembayaran: '',
    });

    const openEdit = (item) => {
        setEditingItem(item);
        setData({
            pelatih_id: item.pelatih_id,
            nominal: item.nominal,
            keterangan: item.keterangan ?? '',
            tanggal_pembayaran: item.tanggal_pembayaran,
        });
    };

    const closeModal = () => {
        setIsAddOpen(false);
        setEditingItem(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            patch(route('admin.royalti.update', editingItem.id), { onSuccess: closeModal });
        } else {
            post(route('admin.royalti.store'), { onSuccess: closeModal });
        }
    };

    const handleDelete = () => {
        router.delete(route('admin.royalti.destroy', deletingItem.id), {
            onSuccess: () => setDeletingItem(null),
        });
    };

    const royaltiList = royaltis?.data ?? royaltis ?? [];

    return (
        <AuthenticatedLayout>
            <Head title="Pembayaran Royalti" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#141c25]">Pembayaran Royalti</h1>
                    <p className="text-[#585f67] text-sm mt-0.5">Catatan pembayaran royalti kepada pelatih</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 bg-[#610000] hover:bg-[#7a0000] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors self-start md:self-auto"
                >
                    <Plus size={16} />
                    Catat Royalti
                </button>
            </div>

            {/* Summary + Filter row */}
            <div className="flex flex-col md:flex-row gap-4 mb-5">
                {/* Summary Card */}
                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-5 py-3 shadow-sm">
                    <div className="h-9 w-9 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                        <DollarSign size={18} className="text-[#1b5e20]" />
                    </div>
                    <div>
                        <p className="text-xs text-[#585f67] uppercase font-medium tracking-wider">Total Royalti</p>
                        <p className="text-lg font-bold text-[#141c25]">{formatRupiah(total ?? 0)}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="block text-xs text-[#585f67] mb-1 font-medium">Bulan</label>
                        <select
                            value={filterBulan}
                            onChange={(e) => handleFilterChange('bulan', e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-300 text-[#141c25] rounded-lg focus:ring-2 focus:ring-[#610000]/40 focus:border-[#610000] appearance-none text-sm min-w-[130px]"
                        >
                            <option value="">Semua Bulan</option>
                            {BULAN.map((b) => (
                                <option key={b.value} value={b.value}>{b.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[#585f67] mb-1 font-medium">Tahun</label>
                        <select
                            value={filterTahun}
                            onChange={(e) => handleFilterChange('tahun', e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-300 text-[#141c25] rounded-lg focus:ring-2 focus:ring-[#610000]/40 focus:border-[#610000] appearance-none text-sm min-w-[110px]"
                        >
                            <option value="">Semua Tahun</option>
                            {TAHUN_OPTIONS.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[#585f67] mb-1 font-medium">Pelatih</label>
                        <select
                            value={filterPelatih}
                            onChange={(e) => handleFilterChange('pelatih_id', e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-300 text-[#141c25] rounded-lg focus:ring-2 focus:ring-[#610000]/40 focus:border-[#610000] appearance-none text-sm min-w-[160px]"
                        >
                            <option value="">Semua Pelatih</option>
                            {(pelatihList ?? []).map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#2a2d2e]">
                                {['Tanggal', 'Pelatih', 'Nominal', 'Keterangan', 'Dicatat Oleh', 'Aksi'].map((h) => (
                                    <th
                                        key={h}
                                        className={`px-6 py-4 text-xs font-medium text-white uppercase tracking-wider ${
                                            h === 'Aksi' ? 'text-right' : 'text-left'
                                        }`}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {royaltiList.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-14 text-center text-[#585f67] text-sm">
                                        Belum ada data royalti yang tercatat.
                                    </td>
                                </tr>
                            )}
                            {royaltiList.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-[#585f67] whitespace-nowrap">
                                        {formatTanggal(item.tanggal_pembayaran)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-[#141c25]">
                                            {item.pelatih?.name ?? '—'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-[#1b5e20]">
                                            {formatRupiah(item.nominal)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#585f67] max-w-xs">
                                        <span className="line-clamp-2">{item.keterangan || '—'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#585f67]">
                                        {item.pencatat?.name ?? '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
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
                </div>

                {/* Pagination */}
                {royaltis?.links && royaltis.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-center gap-1">
                        {royaltis.links.map((link, i) => (
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

            {/* Add / Edit Modal */}
            <Modal show={isAddOpen || !!editingItem} onClose={closeModal} maxWidth="md">
                <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg">
                    <h2 className="text-lg font-semibold text-[#141c25] mb-5 flex items-center gap-2">
                        {editingItem ? (
                            <><Edit2 size={18} className="text-[#610000]" /> Edit Catatan Royalti</>
                        ) : (
                            <><Plus size={18} className="text-[#610000]" /> Catat Royalti Baru</>
                        )}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Pelatih" className="text-[#585f67] text-sm mb-1" />
                            <select
                                value={data.pelatih_id}
                                onChange={(e) => setData('pelatih_id', e.target.value)}
                                className={selectClass}
                            >
                                <option value="">— Pilih Pelatih —</option>
                                {(pelatihList ?? []).map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.pelatih_id} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Nominal (Rp)" className="text-[#585f67] text-sm mb-1" />
                            <TextInput
                                type="number"
                                value={data.nominal}
                                onChange={(e) => setData('nominal', e.target.value)}
                                placeholder="Contoh: 500000"
                                min="0"
                                className={inputClass}
                            />
                            <InputError message={errors.nominal} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Tanggal Pembayaran" className="text-[#585f67] text-sm mb-1" />
                            <TextInput
                                type="date"
                                value={data.tanggal_pembayaran}
                                onChange={(e) => setData('tanggal_pembayaran', e.target.value)}
                                className={inputClass}
                            />
                            <InputError message={errors.tanggal_pembayaran} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Keterangan (opsional)" className="text-[#585f67] text-sm mb-1" />
                            <textarea
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                rows={3}
                                placeholder="Catatan tambahan mengenai pembayaran ini..."
                                className="w-full bg-white border border-gray-300 text-[#141c25] placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#610000]/40 focus:border-[#610000] resize-none"
                            />
                            <InputError message={errors.keterangan} className="mt-1" />
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
                    <h2 className="text-lg font-semibold text-[#141c25] mb-2 flex items-center gap-2">
                        <Trash2 size={18} className="text-[#b71c1c]" /> Hapus Catatan Royalti?
                    </h2>
                    <p className="text-[#585f67] text-sm mb-6">
                        Catatan royalti senilai{' '}
                        <span className="font-medium text-[#141c25]">{formatRupiah(deletingItem?.nominal ?? 0)}</span>{' '}
                        untuk pelatih <span className="font-medium text-[#141c25]">{deletingItem?.pelatih?.name}</span>{' '}
                        akan dihapus permanen.
                    </p>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setDeletingItem(null)}>Batal</SecondaryButton>
                        <DangerButton onClick={handleDelete}>Hapus Permanen</DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
