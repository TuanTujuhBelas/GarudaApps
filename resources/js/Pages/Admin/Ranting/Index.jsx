import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, MapPin, ExternalLink } from 'lucide-react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const inputClass = 'mt-1 block w-full bg-white border-gray-300 text-[#141c25] placeholder-gray-400 rounded-lg';

const formatRupiah = (val) =>
    val != null
        ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
        : '—';

export default function Index({ rantings, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        const timer = setTimeout(() => {
            router.get(
                route('admin.ranting.index'),
                { search: search || undefined },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        nama_ranting: '',
        keterangan: '',
        maps: '',
        status: 'Aktif',
        honor: '',
    });

    const openEdit = (item) => {
        setEditingItem(item);
        setData({
            nama_ranting: item.nama_ranting,
            keterangan: item.keterangan ?? '',
            maps: item.maps ?? '',
            status: item.status ?? 'Aktif',
            honor: item.honor ?? '',
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
            patch(route('admin.ranting.update', { ranting: editingItem.id }), { onSuccess: closeModal });
        } else {
            post(route('admin.ranting.store'), { onSuccess: closeModal });
        }
    };

    const handleDelete = () => {
        router.delete(route('admin.ranting.destroy', { ranting: deletingItem.id }), {
            onSuccess: () => setDeletingItem(null),
        });
    };

    const rantingList = rantings.data ?? [];

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Ranting" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#141c25]">Manajemen Ranting</h1>
                    <p className="text-[#585f67] text-sm mt-0.5">Kelola cabang/ranting PS. Garuda Amarta</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 bg-[#610000] hover:bg-[#7a0000] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors self-start md:self-auto"
                >
                    <Plus size={16} />
                    Tambah Ranting
                </button>
            </div>

            {/* Search */}
            <div className="mb-5">
                <div className="relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Search size={17} />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 bg-white border border-gray-300 text-[#141c25] rounded-lg focus:ring-2 focus:ring-[#610000]/40 focus:border-[#610000] transition-all placeholder:text-gray-400 text-sm"
                        placeholder="Cari kode atau nama ranting..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#2a2d2e]">
                                {['Kode', 'Nama Ranting', 'Status', 'Honor', 'Maps', 'Murid', 'Pelatih', 'Aksi'].map((h) => (
                                    <th
                                        key={h}
                                        className={`px-5 py-4 text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap ${
                                            h === 'Aksi' ? 'text-right' : 'text-left'
                                        }`}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rantingList.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-14 text-center text-[#585f67] text-sm">
                                        {search
                                            ? `Tidak ada ranting yang cocok dengan "${search}".`
                                            : 'Belum ada data ranting. Klik "Tambah Ranting" untuk menambahkan.'}
                                    </td>
                                </tr>
                            )}
                            {rantingList.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-[#f3e5f5] text-[#6a1b9a]">
                                            {item.kode}
                                        </span>
                                        {item.kode === '001' && (
                                            <span className="ml-1.5 text-[10px] text-gray-400">Pusat</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="text-sm font-medium text-[#141c25] group-hover:text-[#610000] transition-colors">
                                            {item.nama_ranting}
                                        </p>
                                        {item.keterangan && (
                                            <p className="text-xs text-[#585f67] mt-0.5 line-clamp-1">{item.keterangan}</p>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            item.status === 'Aktif'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {item.status ?? 'Aktif'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-[#585f67] whitespace-nowrap">
                                        {item.honor != null ? formatRupiah(item.honor) : '—'}
                                    </td>
                                    <td className="px-5 py-4">
                                        {item.maps ? (
                                            <a
                                                href={item.maps}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-[#610000] hover:underline"
                                            >
                                                <MapPin size={12} />
                                                Lihat
                                                <ExternalLink size={10} />
                                            </a>
                                        ) : (
                                            <span className="text-xs text-gray-300">—</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-[#585f67] text-center">
                                        {item.murid_count ?? 0}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-[#585f67] text-center">
                                        {item.pelatih_count ?? 0}
                                    </td>
                                    <td className="px-5 py-4 text-right">
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
                                                disabled={item.kode === '001'}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-[#b71c1c] hover:bg-[#ffebee] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                title={item.kode === '001' ? 'Ranting Pusat tidak dapat dihapus' : 'Hapus'}
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
                {rantings.links && rantings.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-center gap-1">
                        {rantings.links.map((link, i) => (
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
                            <><Edit2 size={18} className="text-[#610000]" /> Edit Ranting</>
                        ) : (
                            <><Plus size={18} className="text-[#610000]" /> Tambah Ranting Baru</>
                        )}
                    </h2>

                    {editingItem && (
                        <div className="mb-4 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-xs text-gray-500">Kode Ranting</p>
                            <p className="text-sm font-mono font-semibold text-[#6a1b9a]">{editingItem.kode}</p>
                        </div>
                    )}

                    {!editingItem && (
                        <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs text-blue-600">Kode ranting akan di-generate otomatis (001, 002, 003...)</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Nama Ranting" className="text-[#585f67] text-sm mb-1" />
                            <TextInput
                                value={data.nama_ranting}
                                onChange={(e) => setData('nama_ranting', e.target.value)}
                                placeholder="Contoh: Ranting Sleman"
                                className={inputClass}
                            />
                            <InputError message={errors.nama_ranting} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel value="Status" className="text-[#585f67] text-sm mb-1" />
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 block w-full px-3 py-2.5 bg-white border border-gray-300 text-[#141c25] rounded-lg focus:ring-2 focus:ring-[#610000]/40 focus:border-[#610000] text-sm"
                            >
                                <option value="Aktif">Aktif</option>
                                <option value="Nonaktif">Nonaktif</option>
                            </select>
                            <InputError message={errors.status} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel value="Honor (opsional)" className="text-[#585f67] text-sm mb-1" />
                            <TextInput
                                type="number"
                                value={data.honor}
                                onChange={(e) => setData('honor', e.target.value)}
                                placeholder="Contoh: 500000"
                                min="0"
                                className={inputClass}
                            />
                            <p className="text-xs text-gray-400 mt-1">Nominal honor dalam Rupiah, kosongkan jika tidak ada</p>
                            <InputError message={errors.honor} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel value="Link Google Maps (opsional)" className="text-[#585f67] text-sm mb-1" />
                            <TextInput
                                value={data.maps}
                                onChange={(e) => setData('maps', e.target.value)}
                                placeholder="https://maps.google.com/..."
                                className={inputClass}
                            />
                            <InputError message={errors.maps} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel value="Keterangan (opsional)" className="text-[#585f67] text-sm mb-1" />
                            <textarea
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                rows={3}
                                placeholder="Deskripsi singkat tentang ranting ini..."
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
                        <Trash2 size={18} className="text-[#b71c1c]" /> Hapus Ranting?
                    </h2>
                    <p className="text-[#585f67] text-sm mb-6">
                        Ranting <span className="font-medium text-[#141c25]">"{deletingItem?.nama_ranting}"</span> akan
                        dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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
