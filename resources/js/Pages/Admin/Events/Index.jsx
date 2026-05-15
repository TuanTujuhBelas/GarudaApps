import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Users } from 'lucide-react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

const formatTanggal = (d) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

const inputClass = 'mt-1 block w-full bg-white border-gray-300 text-[#141c25] placeholder-gray-400 rounded-lg';

export default function Index({ events }) {
    const [isAddOpen, setIsAddOpen]     = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        nama_acara:          '',
        tanggal_pelaksanaan: '',
        deskripsi:           '',
    });

    const openEdit = (item) => {
        setEditingItem(item);
        setData({
            nama_acara:          item.nama_acara,
            tanggal_pelaksanaan: item.tanggal_pelaksanaan,
            deskripsi:           item.deskripsi ?? '',
        });
    };

    const closeModal = () => { setIsAddOpen(false); setEditingItem(null); reset(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            patch(route('admin.events.update', editingItem.id), { onSuccess: closeModal });
        } else {
            post(route('admin.events.store'), { onSuccess: closeModal });
        }
    };

    const handleDelete = () => {
        router.delete(route('admin.events.destroy', deletingItem.id), {
            onSuccess: () => setDeletingItem(null),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kelola Acara" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#141c25]">Kelola Acara</h1>
                    <p className="text-[#585f67] text-sm mt-0.5">Buat dan kelola acara kejuaraan</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 bg-[#610000] hover:bg-[#7a0000] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus size={16} />
                    Buat Acara
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#2a2d2e]">
                            {['Nama Acara', 'Tanggal', 'Deskripsi', 'Pendaftar', 'Aksi'].map(h => (
                                <th key={h} className={`px-6 py-4 text-xs font-medium text-white uppercase tracking-wider ${h === 'Pendaftar' || h === 'Aksi' ? 'text-center' : 'text-left'}`}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {events.data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-14 text-center text-[#585f67] text-sm">
                                    Belum ada acara. Klik "Buat Acara" untuk menambahkan.
                                </td>
                            </tr>
                        )}
                        {events.data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-[#141c25]">{item.nama_acara}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-sm text-[#585f67]">
                                        <Calendar size={13} className="text-gray-400" />
                                        {formatTanggal(item.tanggal_pelaksanaan)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-[#585f67] max-w-xs">
                                    <span className="line-clamp-2">{item.deskripsi || '—'}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="inline-flex items-center gap-1 text-sm text-[#585f67]">
                                        <Users size={13} className="text-gray-400" />
                                        {item.registrations_count}
                                    </div>
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

                {events.links && events.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-center gap-1">
                        {events.links.map((link, i) => (
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
                        {editingItem ? 'Edit Acara' : 'Buat Acara Baru'}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Nama Acara" className="text-[#585f67] text-sm mb-1" />
                            <TextInput
                                value={data.nama_acara}
                                onChange={(e) => setData('nama_acara', e.target.value)}
                                placeholder="Contoh: Kejuaraan Kota 2026"
                                className={inputClass}
                            />
                            <InputError message={errors.nama_acara} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Tanggal Pelaksanaan" className="text-[#585f67] text-sm mb-1" />
                            <TextInput
                                type="date"
                                value={data.tanggal_pelaksanaan}
                                onChange={(e) => setData('tanggal_pelaksanaan', e.target.value)}
                                className={inputClass}
                            />
                            <InputError message={errors.tanggal_pelaksanaan} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Deskripsi Persyaratan" className="text-[#585f67] text-sm mb-1" />
                            <textarea
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                rows={4}
                                placeholder="Contoh: Wajib upload Akta Kelahiran dan Surat Keterangan Sehat"
                                className="w-full bg-white border border-gray-300 text-[#141c25] placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#610000]/40 focus:border-[#610000] resize-none"
                            />
                            <InputError message={errors.deskripsi} className="mt-1" />
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
                    <h2 className="text-lg font-semibold text-[#141c25] mb-2">Hapus Acara?</h2>
                    <p className="text-[#585f67] text-sm mb-1">
                        Acara <span className="text-[#141c25] font-medium">"{deletingItem?.nama_acara}"</span> akan dihapus.
                    </p>
                    <p className="text-orange-600 text-xs mb-6">Semua data pendaftaran murid di acara ini juga akan terhapus.</p>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setDeletingItem(null)}>Batal</SecondaryButton>
                        <DangerButton onClick={handleDelete}>Hapus</DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
