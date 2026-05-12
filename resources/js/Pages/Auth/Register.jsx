import { useEffect, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff, Loader2, MapPin, Calendar, GraduationCap, Plus, Trash2, Users } from 'lucide-react';

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
        latihan_di: '',
        training_locations: [{ nama_lokasi: '', alamat_lokasi: '' }],
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const selectedRole = roles.find(r => r.id == data.role_id)?.nama_role;

    const addLocation = () => {
        setData('training_locations', [...data.training_locations, { nama_lokasi: '', alamat_lokasi: '' }]);
    };

    const removeLocation = (index) => {
        const newLocations = data.training_locations.filter((_, i) => i !== index);
        setData('training_locations', newLocations);
    };

    const handleLocationChange = (index, field, value) => {
        const newLocations = [...data.training_locations];
        newLocations[index][field] = value;
        setData('training_locations', newLocations);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black p-4 py-12">
            <Head title="Daftar Akun - PS Garuda Amarta" />

            <div className="w-full max-w-2xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_20px_rgba(185,28,28,0.4)] -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <span className="text-3xl font-black text-white italic">GA</span>
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
                                    <div className="relative group">
                                        <InputLabel value="Tingkatan Sabuk" className="text-gray-400" />
                                        <select
                                            value={data.ranting_id}
                                            className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all appearance-none"
                                            onChange={(e) => setData('ranting_id', e.target.value)}
                                        >
                                            <option value="" className="bg-black text-white">Pilih Tingkatan</option>
                                            {rantings.map(r => (
                                                <option key={r.id} value={r.id} className="bg-black text-white">{r.nama_ranting}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider">Lokasi Ranting yang Dilatih</h3>
                                            <button
                                                type="button"
                                                onClick={addLocation}
                                                className="flex items-center gap-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Plus size={14} /> Tambah Lokasi
                                            </button>
                                        </div>

                                        {data.training_locations.map((loc, index) => (
                                            <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 relative group/loc">
                                                {data.training_locations.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLocation(index)}
                                                        className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                                <TextInput
                                                    placeholder="Nama Ranting / Lokasi (Contoh: Ranting Kebayoran)"
                                                    value={loc.nama_lokasi}
                                                    className="w-full bg-white/5 border-white/10"
                                                    onChange={(e) => handleLocationChange(index, 'nama_lokasi', e.target.value)}
                                                />
                                                <textarea
                                                    placeholder="Alamat Lengkap / Link Google Maps"
                                                    value={loc.alamat_lokasi}
                                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:ring-1 focus:ring-red-500"
                                                    onChange={(e) => handleLocationChange(index, 'alamat_lokasi', e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Conditional Fields: Murid */}
                            {selectedRole === 'Murid' && (
                                <div className="space-y-6 pt-4 border-t border-white/10">
                                    <div className="relative group">
                                        <InputLabel value="Latihan Di Mana?" className="text-gray-400" />
                                        <TextInput
                                            value={data.latihan_di}
                                            className="mt-1 block w-full bg-white/5 border-white/10"
                                            placeholder="Nama Ranting tempat latihan Anda"
                                            onChange={(e) => setData('latihan_di', e.target.value)}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <InputLabel value="Tingkatan Sabuk Saat Ini" className="text-gray-400" />
                                        <select
                                            value={data.ranting_id}
                                            className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all appearance-none"
                                            onChange={(e) => setData('ranting_id', e.target.value)}
                                        >
                                            <option value="" className="bg-black text-white">Pilih Tingkatan</option>
                                            {rantings.map(r => (
                                                <option key={r.id} value={r.id} className="bg-black text-white">{r.nama_ranting}</option>
                                            ))}
                                        </select>
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
