import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit2, Trash2, Award } from 'lucide-react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

const BELT_COLORS = {
    'Sabuk Putih':                  { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' },
    'Sabuk Kuning':                 { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
    'Sabuk Merah':                  { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    'Sabuk Hijau':                  { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    'Sabuk Biru':                   { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    'Sabuk Coklat':                 { bg: '#fef3c7', text: '#78350f', border: '#d97706' },
};

function BeltBadge({ nama }) {
    const color = BELT_COLORS[nama];
    if (color) {
        return (
            <span
                className="inline-block px-2.5 py-0.5 rounded text-xs font-medium border"
                style={{ background: color.bg, color: color.text, borderColor: color.border }}
            >
                {nama}
            </span>
        );
    }
    // Sabuk hitam dan variannya
    return (
        <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-[#1f2937] text-white border border-[#374151]">
            {nama}
        </span>
    );
}

export default function Index({ sabuk }) {
    const [isAddOpen, setIsAddOpen]   = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        urutan:     '',
        nama_sabuk: '',
    });

    const openEdit = (item) => {
        setEditingItem(item);
        setData({ urutan: item.urutan, nama_sabuk: item.nama_sabuk });
    };

    const closeModal = () => { setIsAddOpen(false); setEditingItem(null); reset(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            patch(route('admin.sabuk.update', editingItem.id), { onSuccess: closeModal });
        } else {
            post(route('admin.sabuk.store'), { onSuccess: closeModal });
        }
    };

    const handleDelete = () => {
        router.delete(route('admin.sabuk.destroy', deletingItem.id), {
            onSuccess: () => setDeletingItem(null),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tingkatan Sabuk" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#141c25]">Tingkatan Sabuk</h1>
                    <p className="text-[#585f67] text-sm mt-0.5">Kelola level sabuk pencak silat PS. Garuda Amarta</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 bg-[#610000] hover:bg-[#7a0000] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus size={16} />
                    Tambah Tingkatan
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden max-w-2xl">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#2a2d2e]">
                            <th className="px-6 py-4 text-xs font-medium text-white uppercase tracking-wider text-center w-20">Tingkat</th>
                            <th className="px-6 py-4 text-xs font-medium text-white uppercase tracking-wider text-left">Nama Sabuk</th>
                            <th className="px-6 py-4 text-xs font-medium text-white uppercase tracking-wider text-center w-24">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sabuk.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-14 text-center text-[#585f67] text-sm">
                                    Belum ada tingkatan sabuk. Klik "Tambah Tingkatan" untuk menambahkan.
                                </td>
                            </tr>
                        )}
                        {sabuk.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#610000] text-white text-xs font-bold">
                                        {item.urutan}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <BeltBadge nama={item.nama_sabuk} />
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
            </div>

            {/* Add / Edit Modal */}
            <Modal show={isAddOpen || !!editingItem} onClose={closeModal} maxWidth="sm">
                <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg">
                    <h2 className="text-lg font-semibold text-[#141c25] mb-5 flex items-center gap-2">
                        <Award size={18} className="text-[#610000]" />
                        {editingItem ? 'Edit Tingkatan' : 'Tambah Tingkatan Baru'}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Nomor Urutan" className="text-[#585f67] text-sm mb-1" />
                            <TextInput
                                type="number"
                                value={data.urutan}
                                onChange={(e) => setData('urutan', e.target.value)}
                                min="1"
                                placeholder="Contoh: 1"
                                className="mt-1 block w-full bg-white border-gray-300 text-[#141c25] placeholder-gray-400 rounded-lg"
                            />
                            <InputError message={errors.urutan} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Nama Sabuk" className="text-[#585f67] text-sm mb-1" />
                            <TextInput
                                value={data.nama_sabuk}
                                onChange={(e) => setData('nama_sabuk', e.target.value)}
                                placeholder="Contoh: Sabuk Putih"
                                className="mt-1 block w-full bg-white border-gray-300 text-[#141c25] placeholder-gray-400 rounded-lg"
                            />
                            <InputError message={errors.nama_sabuk} className="mt-1" />
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
                    <h2 className="text-lg font-semibold text-[#141c25] mb-2">Hapus Tingkatan?</h2>
                    <p className="text-[#585f67] text-sm mb-6">
                        Tingkatan <span className="font-medium text-[#141c25]">"{deletingItem?.nama_sabuk}"</span> akan dihapus permanen.
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
