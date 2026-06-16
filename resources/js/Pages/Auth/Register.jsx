import { useEffect, useState } from 'react';
import gamaLogo from '../../../../public/gama.png';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff, Loader2, MapPin, Calendar, GraduationCap, Plus, Trash2, Users, Phone, HelpCircle } from 'lucide-react';

export default function Register({ roles, rantings }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        gelar: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
        alamat: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        ranting_id: '',
        nomor_hp: '',
        pernah_beladiri: false,
        jenis_beladiri: '',
        alasan_mendaftar: '',
        ranting_tambahan: [],
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const selectedRole = roles.find(r => r.id == data.role_id)?.nama_role;

    // Ranting tambahan untuk Pelatih
    const addRantingTambahan = () => {
        setData('ranting_tambahan', [...data.ranting_tambahan, '']);
    };

    const removeRantingTambahan = (index) => {
        setData('ranting_tambahan', data.ranting_tambahan.filter((_, i) => i !== index));
    };

    const updateRantingTambahan = (index, value) => {
        const updated = [...data.ranting_tambahan];
        updated[index] = value;
        setData('ranting_tambahan', updated);
    };

    // Ranting yang sudah terpilih (utama + tambahan), untuk filter dropdown
    const selectedRantingIds = [
        data.ranting_id,
        ...data.ranting_tambahan,
    ].filter(Boolean);

    const availableRantings = (excludeIndex = null) =>
        rantings.filter(r => {
            const chosen = selectedRantingIds.filter((_, i) => {
                // index 0 = ranting_id (utama), index 1+ = ranting_tambahan[i-1]
                if (excludeIndex === null) return true;
                return i !== excludeIndex + 1;
            });
            return !chosen.includes(String(r.id));
        });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black p-4 py-12">
            <Head title="Daftar Akun" />

            <div className="w-full max-w-2xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(185,28,28,0.4)] -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <img src={gamaLogo} alt="PS. Garuda Amarta" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white">Gabung Sekarang</h2>
                    <p className="mt-2 text-gray-400">Lengkapi biodata untuk bergabung dengan keluarga PS. Garuda Amarta</p>
                </div>

                <div className="overflow-hidden rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl">
                    <div className="p-8">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="relative group">
                                    <InputLabel htmlFor="name" value="Nama Lengkap" className="text-gray-400" />
                                    <div className="relative mt-1">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                                            <User size={18} />
                                        </div>
                                        <TextInput
                                            id="name"
                                            value={data.name}
                                            className="block w-full pl-11 pr-4 py-3 bg-white/5 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                                            placeholder="Nama lengkap"
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.name} className="mt-1" />
                                </div>

                                {/* Gelar */}
                                <div className="relative group">
                                    <InputLabel htmlFor="gelar" value="Gelar (Jika ada)" className="text-gray-400" />
                                    <div className="relative mt-1">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                                            <GraduationCap size={18} />
                                        </div>
                                        <TextInput
                                            id="gelar"
                                            value={data.gelar}
                                            className="block w-full pl-11 pr-4 py-3 bg-white/5 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                                            placeholder="Contoh: S.Pd, M.Or"
                                            onChange={(e) => setData('gelar', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.gelar} className="mt-1" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div className="relative group">
                                    <InputLabel htmlFor="email" value="Email" className="text-gray-400" />
                                    <div className="relative mt-1">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            className="block w-full pl-11 pr-4 py-3 bg-white/5 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                                            placeholder="email@anda.com"
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-1" />
                                </div>

                                {/* Role Selection */}
                                <div className="relative group">
                                    <InputLabel htmlFor="role_id" value="Mendaftar Sebagai" className="text-gray-400" />
                                    <div className="relative mt-1">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                                            <Users size={18} />
                                        </div>
                                        <select
                                            id="role_id"
                                            value={data.role_id}
                                            className="block w-full pl-11 pr-4 py-3 bg-white/5 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all appearance-none"
                                            onChange={(e) => setData('role_id', e.target.value)}
                                            required
                                        >
                                            <option value="" className="bg-black text-white">Pilih Role</option>
                                            {roles.map(role => (
                                                <option key={role.id} value={role.id} className="bg-black text-white">{role.nama_role}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <InputError message={errors.role_id} className="mt-1" />
                                </div>
                            </div>

                            {/* TTL */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <InputLabel htmlFor="tempat_lahir" value="Tempat Lahir" className="text-gray-400" />
                                    <div className="relative mt-1">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                                            <MapPin size={18} />
                                        </div>
                                        <TextInput
                                            id="tempat_lahir"
                                            value={data.tempat_lahir}
                                            className="block w-full pl-11 pr-4 py-3 bg-white/5 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                                            placeholder="Kota kelahiran"
                                            onChange={(e) => setData('tempat_lahir', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="relative group">
                                    <InputLabel htmlFor="tanggal_lahir" value="Tanggal Lahir" className="text-gray-400" />
                                    <div className="relative mt-1">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                                            <Calendar size={18} />
                                        </div>
                                        <TextInput
                                            id="tanggal_lahir"
                                            type="date"
                                            value={data.tanggal_lahir}
                                            className="block w-full pl-11 pr-4 py-3 bg-white/5 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                                            onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Alamat */}
                            <div className="relative group">
                                <InputLabel htmlFor="alamat" value="Alamat Lengkap" className="text-gray-400" />
                                <textarea
                                    id="alamat"
                                    value={data.alamat}
                                    className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all min-h-[100px]"
                                    placeholder="Alamat domisili saat ini"
                                    onChange={(e) => setData('alamat', e.target.value)}
                                />
                                <InputError message={errors.alamat} className="mt-1" />
                            </div>

                            {/* Conditional Fields: Pelatih */}
                            {selectedRole === 'Pelatih' && (
                                <div className="space-y-6 pt-4 border-t border-white/10">
                                    <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider">Data Pelatih</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Ranting Pelatih */}
                                        <div className="relative group">
                                            <InputLabel value="Ranting" className="text-gray-400" />
                                            <select
                                                value={data.ranting_id}
                                                className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all appearance-none"
                                                onChange={(e) => setData('ranting_id', e.target.value)}
                                            >
                                                <option value="" className="bg-black text-white">Pilih Ranting</option>
                                                {rantings.map(r => (
                                                    <option key={r.id} value={r.id} className="bg-black text-white">
                                                        {r.kode ? `[${r.kode}] ` : ''}{r.nama_ranting}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.ranting_id} className="mt-1" />
                                        </div>

                                        {/* Nomor HP Pelatih */}
                                        <div className="relative group">
                                            <InputLabel value="Nomor HP" className="text-gray-400" />
                                            <div className="relative mt-1">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                                                    <Phone size={18} />
                                                </div>
                                                <TextInput
                                                    value={data.nomor_hp}
                                                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                                                    placeholder="08xxxxxxxxxx"
                                                    onChange={(e) => setData('nomor_hp', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.nomor_hp} className="mt-1" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider">Ranting yang Dilatih</h3>
                                            <button
                                                type="button"
                                                onClick={addRantingTambahan}
                                                disabled={selectedRantingIds.filter(Boolean).length >= rantings.length}
                                                className="flex items-center gap-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Plus size={14} /> Tambah Ranting
                                            </button>
                                        </div>

                                        {/* Ranting utama — read-only, auto dari pilihan di atas */}
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                                            <MapPin size={15} className="text-red-400 flex-shrink-0" />
                                            <span className="text-sm text-white flex-1">
                                                {rantings.find(r => String(r.id) === String(data.ranting_id))
                                                    ? `[${rantings.find(r => String(r.id) === String(data.ranting_id)).kode}] ${rantings.find(r => String(r.id) === String(data.ranting_id)).nama_ranting}`
                                                    : <span className="text-gray-500 italic">Pilih ranting utama di atas terlebih dahulu</span>
                                                }
                                            </span>
                                            <span className="text-xs text-red-400 font-medium">Utama</span>
                                        </div>

                                        {/* Ranting tambahan */}
                                        {data.ranting_tambahan.map((rid, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <select
                                                    value={rid}
                                                    onChange={(e) => updateRantingTambahan(index, e.target.value)}
                                                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500 appearance-none"
                                                >
                                                    <option value="" className="bg-black">— Pilih ranting tambahan —</option>
                                                    {rantings
                                                        .filter(r => !selectedRantingIds.includes(String(r.id)) || String(r.id) === String(rid))
                                                        .map(r => (
                                                            <option key={r.id} value={r.id} className="bg-black">
                                                                [{r.kode}] {r.nama_ranting}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => removeRantingTambahan(index)}
                                                    className="p-2 text-gray-500 hover:text-red-500 transition-colors flex-shrink-0"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Conditional Fields: Murid */}
                            {selectedRole === 'Murid' && (
                                <div className="space-y-6 pt-4 border-t border-white/10">
                                    <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider">Data Murid</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Daftar di Ranting */}
                                        <div className="relative group">
                                            <InputLabel value="Daftar di Ranting" className="text-gray-400" />
                                            <select
                                                value={data.ranting_id}
                                                className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all appearance-none"
                                                onChange={(e) => setData('ranting_id', e.target.value)}
                                            >
                                                <option value="" className="bg-black text-white">Pilih Ranting</option>
                                                {rantings.map(r => (
                                                    <option key={r.id} value={r.id} className="bg-black text-white">
                                                        {r.kode ? `[${r.kode}] ` : ''}{r.nama_ranting}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.ranting_id} className="mt-1" />
                                        </div>

                                        {/* Nomor HP */}
                                        <div className="relative group">
                                            <InputLabel value="Nomor HP" className="text-gray-400" />
                                            <div className="relative mt-1">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                                                    <Phone size={18} />
                                                </div>
                                                <TextInput
                                                    value={data.nomor_hp}
                                                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                                                    placeholder="08xxxxxxxxxx"
                                                    onChange={(e) => setData('nomor_hp', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.nomor_hp} className="mt-1" />
                                        </div>
                                    </div>

                                    {/* Pernah Ikut Beladiri? */}
                                    <div className="relative group">
                                        <InputLabel value="Pernah Ikut Beladiri?" className="text-gray-400" />
                                        <div className="mt-2 flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setData('pernah_beladiri', true)}
                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                                                    data.pernah_beladiri
                                                        ? 'bg-red-600 border-red-500 text-white'
                                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                                }`}
                                            >
                                                Ya
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setData('pernah_beladiri', false); setData('jenis_beladiri', ''); }}
                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                                                    !data.pernah_beladiri
                                                        ? 'bg-red-600 border-red-500 text-white'
                                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                                }`}
                                            >
                                                Tidak
                                            </button>
                                        </div>
                                        <InputError message={errors.pernah_beladiri} className="mt-1" />
                                    </div>

                                    {/* Jenis Beladiri - hanya tampil jika pernah_beladiri = true */}
                                    {data.pernah_beladiri && (
                                        <div className="relative group">
                                            <InputLabel value="Jenis Beladiri / Perguruan" className="text-gray-400" />
                                            <div className="relative mt-1">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                                                    <HelpCircle size={18} />
                                                </div>
                                                <TextInput
                                                    value={data.jenis_beladiri}
                                                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                                                    placeholder="Contoh: Karate, Taekwondo, Pencak Silat lain"
                                                    onChange={(e) => setData('jenis_beladiri', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.jenis_beladiri} className="mt-1" />
                                        </div>
                                    )}

                                    {/* Alasan Mendaftar */}
                                    <div className="relative group">
                                        <InputLabel value="Alasan Mendaftar" className="text-gray-400" />
                                        <textarea
                                            value={data.alasan_mendaftar}
                                            className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all min-h-[100px]"
                                            placeholder="Ceritakan alasan Anda ingin bergabung dengan PS. Garuda Amarta"
                                            onChange={(e) => setData('alasan_mendaftar', e.target.value)}
                                        />
                                        <InputError message={errors.alasan_mendaftar} className="mt-1" />
                                    </div>
                                </div>
                            )}

                            {/* Password Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                                <div className="relative group">
                                    <InputLabel htmlFor="password" value="Password" className="text-gray-400" />
                                    <div className="relative mt-1">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <TextInput
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={data.password}
                                            className="block w-full pl-11 pr-12 py-3 bg-white/5 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                                            placeholder="Minimal 8 karakter"
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-1" />
                                </div>

                                <div className="relative group">
                                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" className="text-gray-400" />
                                    <div className="relative mt-1">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                                            <ShieldCheck size={18} />
                                        </div>
                                        <TextInput
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            className="block w-full pl-11 pr-4 py-3 bg-white/5 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                                            placeholder="Ulangi password"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.password_confirmation} className="mt-1" />
                                </div>
                            </div>

                            <div className="pt-4">
                                <PrimaryButton
                                    className="relative w-full flex justify-center items-center gap-2 rounded-xl bg-red-600 py-4 text-sm font-bold uppercase tracking-widest hover:bg-red-700 active:scale-[0.98] transition-all shadow-lg shadow-red-600/20"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Mendaftarkan...
                                        </>
                                    ) : (
                                        'Daftar Sekarang'
                                    )}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white/[0.02] p-6 text-center border-t border-white/5">
                        <p className="text-sm text-gray-400">
                            Sudah punya akun?{' '}
                            <Link href={route('login')} className="font-bold text-red-400 hover:text-red-300 underline-offset-4 hover:underline transition-all">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-gray-600 uppercase tracking-[0.2em]">
                    &copy; 2024 PS. Garuda Amarta
                </p>
            </div>
        </div>
    );
}
