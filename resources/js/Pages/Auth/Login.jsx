import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react'; // Pastikan install lucide-react

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black p-4">
            <Head title="Masuk" />

            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_20px_rgba(185,28,28,0.4)] rotate-3 hover:rotate-0 transition-transform duration-300">
                        <span className="text-3xl font-black text-white italic">GA</span>
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white">
                        Selamat Datang
                    </h2>
                    <p className="mt-2 text-gray-400">Silakan masuk ke akun Garuda Amarta Anda</p>
                </div>

                <div className="overflow-hidden rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl">
                    <div className="p-8">
                        {status && (
                            <div className="mb-6 rounded-xl bg-emerald-500/10 p-4 text-sm font-medium text-emerald-400 border border-emerald-500/20">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Field */}
                            <div className="relative group">
                                <InputLabel htmlFor="email" value="Email" className="text-gray-400 ml-1 mb-1.5" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        className="block w-full pl-11 pr-4 py-3 bg-white/5 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-gray-600"
                                        autoComplete="username"
                                        isFocused={true}
                                        placeholder="nama@email.com"
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password Field */}
                            <div className="relative group">
                                <InputLabel htmlFor="password" value="Password" className="text-gray-400 ml-1 mb-1.5" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <TextInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        className="block w-full pl-11 pr-12 py-3 bg-white/5 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-gray-600"
                                        placeholder="••••••••"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-red-600 focus:ring-red-500 focus:ring-offset-0 transition-all"
                                    />
                                    <span className="ms-2 text-sm text-gray-400 group-hover:text-gray-200 transition-colors">Ingat saya</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>

                            <PrimaryButton 
                                className="relative w-full flex justify-center items-center gap-2 rounded-xl bg-red-600 py-4 text-sm font-bold uppercase tracking-widest hover:bg-red-700 active:scale-[0.98] transition-all shadow-lg shadow-red-600/20" 
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Memproses...
                                    </>
                                ) : (
                                    'Masuk Sekarang'
                                )}
                            </PrimaryButton>
                        </form>
                    </div>

                    <div className="bg-white/[0.02] p-6 text-center border-t border-white/5">
                        <p className="text-sm text-gray-400">
                            Belum punya akun?{' '}
                            <Link href={route('register')} className="font-bold text-red-400 hover:text-red-300 underline-offset-4 hover:underline transition-all">
                                Daftar Sekarang
                            </Link>
                        </p>
                    </div>
                </div>
                
                {/* Footer simple */}
                <p className="mt-8 text-center text-xs text-gray-600 uppercase tracking-[0.2em]">
                    &copy; 2024 PS. Garuda Amarta
                </p>
            </div>
        </div>
    );
}