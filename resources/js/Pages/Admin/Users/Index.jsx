import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { User, Mail, Shield, Trash2, Edit2, Search, X, Check } from 'lucide-react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';

export default function Index({ users, roles, rantings, filters, stats }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const isFirstRender = useRef(true);

    const isSuperAdmin = (user) => user?.role?.nama_role === 'Super Admin';

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            router.get(route('admin.users.index'),
                { search: search || undefined },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const { data, setData, patch, processing, reset, delete: destroy } = useForm({
        role_id: '',
        ranting_id: '',
        is_aktif: true,
    });

    const openEditModal = (user) => {
        setEditingUser(user);
        setData({
            role_id: user.role_id,
            ranting_id: user.ranting_id || '',
            is_aktif: !!user.is_aktif,
        });
    };

    const closeEditModal = () => {
        setEditingUser(null);
        reset();
    };

    const submitUpdate = (e) => {
        e.preventDefault();
        patch(route('admin.users.update', editingUser.id), {
            onSuccess: () => closeEditModal(),
        });
    };

    const openDeleteModal = (user) => setDeletingUser(user);
    const closeDeleteModal = () => setDeletingUser(null);

    const submitDelete = (e) => {
        e.preventDefault();
        destroy(route('admin.users.destroy', deletingUser.id), {
            onSuccess: () => closeDeleteModal(),
        });
    };

    const userList = users.data;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-white italic">
                    Manajemen Pengguna
                </h2>
            }
        >
            <Head title="Manajemen Pengguna" />

            <div className="py-12 bg-[#0a0a0a] min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* Search & Stats */}
                    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-gray-600"
                                placeholder="Cari nama atau email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-center">
                                <p className="text-xs text-gray-500 uppercase font-bold">Total User</p>
                                <p className="text-xl font-black text-white">{stats.total}</p>
                            </div>
                            <div className="bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 text-center">
                                <p className="text-xs text-red-500 uppercase font-bold">Aktif</p>
                                <p className="text-xl font-black text-red-500">{stats.aktif}</p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest font-bold">
                                        <th className="px-6 py-4">Pengguna</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Tingkatan</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {userList.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-black italic">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                                                            {user.name} {user.gelar && <span className="text-xs text-gray-500">({user.gelar})</span>}
                                                        </p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Mail size={12} /> {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                    user.role?.nama_role === 'Super Admin' ? 'bg-purple-500/20 text-purple-400' :
                                                    user.role?.nama_role === 'Pelatih'     ? 'bg-blue-500/20 text-blue-400' :
                                                                                             'bg-orange-500/20 text-orange-400'
                                                }`}>
                                                    <Shield size={12} /> {user.role?.nama_role ?? '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-300">
                                                    {user.ranting?.nama_ranting || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.is_aktif ? (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                                                        <Check size={14} /> Aktif
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-gray-500">
                                                        <X size={14} /> Nonaktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(user)}
                                                        disabled={isSuperAdmin(user)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="flex justify-center gap-1 py-4 border-t border-white/5">
                                {users.links.map((link, i) =>
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            preserveState
                                            preserveScroll
                                            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                                                link.active
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className="px-3 py-1.5 rounded-lg text-xs font-mono text-gray-600"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal show={!!editingUser} onClose={closeEditModal} maxWidth="md">
                <form onSubmit={submitUpdate} className="p-6 bg-[#1a1a1a] border border-white/10 rounded-3xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 italic">
                        <Edit2 size={20} className="text-red-500" /> Edit Pengguna
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Nama Pengguna" className="text-gray-400" />
                            <p className="text-white font-bold">{editingUser?.name}</p>
                        </div>

                        <div>
                            <InputLabel htmlFor="role_id" value="Role" className="text-gray-400" />
                            <select
                                id="role_id"
                                value={data.role_id}
                                className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 appearance-none disabled:opacity-50"
                                onChange={(e) => setData('role_id', e.target.value)}
                                disabled={isSuperAdmin(editingUser)}
                            >
                                {roles.map(r => (
                                    <option key={r.id} value={r.id} className="bg-black">{r.nama_role}</option>
                                ))}
                            </select>
                            {isSuperAdmin(editingUser) && (
                                <p className="mt-1 text-xs text-red-500 italic">Role Super Admin tidak dapat diubah.</p>
                            )}
                        </div>

                        <div>
                            <InputLabel htmlFor="ranting_id" value="Tingkatan Sabuk" className="text-gray-400" />
                            <select
                                id="ranting_id"
                                value={data.ranting_id}
                                className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 appearance-none"
                                onChange={(e) => setData('ranting_id', e.target.value)}
                            >
                                <option value="" className="bg-black text-white">- Pilih Tingkatan -</option>
                                {rantings.map(r => (
                                    <option key={r.id} value={r.id} className="bg-black">{r.nama_ranting}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.is_aktif}
                                disabled={isSuperAdmin(editingUser)}
                                onChange={(e) => setData('is_aktif', e.target.checked)}
                                className="w-4 h-4 rounded border-white/20 bg-white/5 text-red-600 focus:ring-red-500 disabled:opacity-50"
                            />
                            <span className="text-sm text-gray-300 italic">User Aktif</span>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={closeEditModal} className="border-white/10 text-gray-400 hover:text-white">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="bg-red-600 hover:bg-red-700">
                            Simpan Perubahan
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal show={!!deletingUser} onClose={closeDeleteModal} maxWidth="md">
                <div className="p-6 bg-[#1a1a1a] border border-white/10 rounded-3xl">
                    <h2 className="text-xl font-bold text-white mb-4 italic flex items-center gap-2">
                        <Trash2 size={20} className="text-red-500" /> Konfirmasi Hapus
                    </h2>
                    <p className="text-gray-400">
                        Apakah Anda yakin ingin menghapus akun <span className="text-white font-bold">{deletingUser?.name}</span>?
                        Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={closeDeleteModal} className="border-white/10 text-gray-400">
                            Batal
                        </SecondaryButton>
                        <DangerButton onClick={submitDelete} disabled={processing} className="bg-red-600 hover:bg-red-700">
                            Hapus Permanen
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
