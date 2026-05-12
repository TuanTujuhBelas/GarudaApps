import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Selamat Datang - PS. Garuda Amarta" />
            
            <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
                {/* Bagian Navbar / Menu Atas */}
                <nav className="flex justify-between items-center p-6 bg-red-700 text-white shadow-md">
                    <div className="text-2xl font-extrabold tracking-wider flex items-center gap-2">
                        {/* Bisa diganti tag <img> jika nanti logo sudah masuk ke folder public */}
                        <span className="text-yellow-400">❖</span> PS. GARUDA AMARTA
                    </div>
                    
                    <div>
                        {/* Logika: Jika user sudah login, tampilkan tombol Dashboard. Jika belum, tampilkan Login/Daftar */}
                        {auth.user ? (
                            <Link 
                                href={route('dashboard')} 
                                className="font-semibold text-white hover:text-yellow-300 transition"
                            >
                                Masuk ke Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link 
                                    href={route('login')} 
                                    className="font-semibold text-white hover:text-yellow-300 transition"
                                >
                                    Log in
                                </Link>
                                <Link 
                                    href={route('register')} 
                                    className="font-semibold bg-yellow-500 text-red-900 px-5 py-2 rounded-full hover:bg-yellow-400 transition shadow"
                                >
                                    Daftar Murid Baru
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Bagian Hero (Konten Utama di Tengah) */}
                <main className="flex flex-col items-center justify-center text-center mt-24 px-4">
                    <div className="bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-bold mb-6 tracking-wide">
                        SISTEM MANAJEMEN DIGITAL
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 drop-shadow-sm leading-tight">
                        Portal Resmi <br/>
                        <span className="text-red-700">Pencak Silat Garuda Amarta</span>
                    </h1>
                    
                    <p className="text-lg text-gray-600 max-w-2xl mb-10 leading-relaxed">
                        Platform terpadu untuk mengelola administrasi keanggotaan, kurikulum kepelatihan, keuangan, dan informasi kegiatan perguruan secara transparan dan profesional.
                    </p>
                    
                    {/* Tombol Call to Action Besar */}
                    {!auth.user && (
                        <div className="flex gap-4">
                            <Link 
                                href={route('login')} 
                                className="px-8 py-4 bg-red-700 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-red-800 transition transform hover:-translate-y-1"
                            >
                                Akses Sistem Sekarang
                            </Link>
                        </div>
                    )}
                </main>
                
                {/* Bagian Footer */}
                <footer className="absolute bottom-0 w-full text-center py-4 text-gray-500 text-sm">
                    © {new Date().getFullYear()} PS. Garuda Amarta. All rights reserved.
                </footer>
            </div>
        </>
    );
}