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
        <AuthenticatedLayout>
            <Head title="Manajemen Pengguna" />

            {/* Page Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-[#141c25]">Manajemen Pengguna</h1>
                    <p className="text-sm text-[#585f67] mt-0.5">Kelola akun, role, dan status pengguna</p>
                </div>

                {/* Stats */}
                <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded border border-gray-200 text-center">
                        <p className="text-xs text-gray-500 uppercase font-medium tracking-wider">Total User</p>
                        <p className="text-xl font-bold text-[#141c25]">{stats.total}</p>
                    </div>
                    <div className="bg-[#ffebee] px-4 py-2 rounded border border-red-200 text-center">
                        <p className="text-xs text-[#b71c1c] uppercase font-medium tracking-wider">Aktif</p>
                        <p className="text-xl font-bold text-[#b71c1c]">{stats.aktif}</p>
                    </div>
                </div>
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
                        placeholder="Cari nama atau email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#2a2d2e] text-white text-xs uppercase tracking-wider font-medium">
                                <th className="px-6 py-4">Pengguna</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Tingkatan</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {userList.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-[#610000] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-[#141c25] group-hover:text-[#610000] transition-colors">
                                                    {user.name} {user.gelar && <span className="text-xs text-gray-400 font-normal">({user.gelar})</span>}
                                                </p>
                                                <p className="text-xs text-[#585f67] flex items-center gap-1 mt-0.5">
                                                    <Mail size={11} /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                                            user.role?.nama_role === 'Super Admin' ? 'bg-[#f3e5f5] text-[#6a1b9a]' :
                                            user.role?.nama_role === 'Pelatih'     ? 'bg-[#e3f2fd] text-[#0d47a1]' :
                                                                                     'bg-[#fff3e0] text-[#e65100]'
                                        }`}>
                                            <Shield size={11} /> {user.role?.nama_role ?? '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-[#585f67]">
                                            {user.ranting?.nama_ranting || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.is_aktif ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1b5e20]">
                                                <Check size={13} /> Aktif
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
                                                <X size={13} /> Nonaktif
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-1.5 text-gray-400 hover:text-[#141c25] hover:bg-gray-100 rounded-lg transition-all"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(user)}
                                                disabled={isSuperAdmin(user)}
                                                className="p-1.5 text-gray-400 hover:text-[#b71c1c] hover:bg-[#ffebee] rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <Trash2 size={15} />
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
                    <div className="flex justify-center gap-1 py-4 border-t border-gray-100">
                        {users.links.map((link, i) =>
                            link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    preserveState
                                    preserveScroll
                                    className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                                        link.active
                                            ? 'bg-[#610000] text-white'
                                            : 'bg-gray-100 text-[#585f67] hover:bg-gray-200'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={i}
                                    className="px-3 py-1.5 rounded text-xs font-mono text-gray-300"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <Modal show={!!editingUser} onClose={closeEditModal} maxWidth="md">
                <form onSubmit={submitUpdate} className="p-6 bg-white rounded-lg">
                    <h2 className="text-lg font-semibold text-[#141c25] mb-5 flex items-center gap-2">
                        <Edit2 size={18} className="text-[#610000]" /> Edit Pengguna
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Nama Pengguna" className="text-[#585f67]" />
                            <p className="text-[#141c25] font-semibold mt-1">{editingUser?.name}</p>
                        </div>

                        <div>
                            <InputLabel htmlFor="role_id" value="Role" className="text-[#585f67]" />
                            <select
                                id="role_id"
                                value={data.role_id}
                                className="mt-1 block w-full px-3 py-2.5 bg-white border border-gray-300 text-[#141c25] rounded-lg focus:ring-2 focus:ring-[#610000]/40 focus:border-[#610000] appearance-none disabled:opacity-50 text-sm"
                                onChange={(e) => setData('role_id', e.target.value)}
                                disabled={isSuperAdmin(editingUser)}
                            >
                                {roles.map(r => (
                                    <option key={r.id} value={r.id}>{r.nama_role}</option>
                                ))}
                            </select>
                            {isSuperAdmin(editingUser) && (
                                <p className="mt-1 text-xs text-[#b71c1c]">Role Super Admin tidak dapat diubah.</p>
                            )}
                        </div>

                        <div>
                            <InputLabel htmlFor="ranting_id" value="Tingkatan Sabuk" className="text-[#585f67]" />
                            <select
                                id="ranting_id"
                                value={data.ranting_id}
                                className="mt-1 block w-full px-3 py-2.5 bg-white border border-gray-300 text-[#141c25] rounded-lg focus:ring-2 focus:ring-[#610000]/40 focus:border-[#610000] appearance-none text-sm"
                                onChange={(e) => setData('ranting_id', e.target.value)}
                            >
                                <option value="">- Pilih Tingkatan -</option>
                                {rantings.map(r => (
                                    <option key={r.id} value={r.id}>{r.nama_ranting}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.is_aktif}
                                disabled={isSuperAdmin(editingUser)}
                                onChange={(e) => setData('is_aktif', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 bg-white text-[#610000] focus:ring-[#610000] disabled:opacity-50"
                            />
                            <span className="text-sm text-[#585f67]">User Aktif</span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeEditModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Simpan Perubahan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal show={!!deletingUser} onClose={closeDeleteModal} maxWidth="md">
                <div className="p-6 bg-white rounded-lg">
                    <h2 className="text-lg font-semibold text-[#141c25] mb-3 flex items-center gap-2">
                        <Trash2 size={18} className="text-[#b71c1c]" /> Konfirmasi Hapus
                    </h2>
                    <p className="text-[#585f67] text-sm">
                        Apakah Anda yakin ingin menghapus akun <span className="text-[#141c25] font-semibold">{deletingUser?.name}</span>?
                        Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeDeleteModal}>Batal</SecondaryButton>
                        <DangerButton onClick={submitDelete} disabled={processing}>
                            Hapus Permanen
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
