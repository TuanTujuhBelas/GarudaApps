import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Selamat Datang" />

            <div className="bg-surface text-on-surface antialiased flex flex-col min-h-screen font-sans">

                {/* Header */}
                <header className="bg-surface border-b border-outline-variant w-full z-50 sticky top-0">
                    <div className="flex justify-between items-center px-4 md:px-10 h-20 w-full max-w-[1440px] mx-auto">
                        <div className="text-xl font-bold text-primary tracking-tight">
                            GARUDA APPS
                        </div>

                        <nav className="hidden md:flex gap-6 h-full">
                            {['Program', 'Kegiatan', 'Akademi'].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="text-secondary hover:text-primary transition-colors flex items-center h-full px-1 font-mono text-sm tracking-wide"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-primary text-on-primary font-mono text-sm px-6 py-2.5 rounded hover:opacity-90 transition-opacity"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-secondary hover:text-primary transition-colors font-mono text-sm"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-primary text-on-primary font-mono text-sm px-6 py-2.5 rounded hover:opacity-90 transition-opacity"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 flex flex-col gap-20 py-20">

                    {/* Hero */}
                    <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center min-h-[520px]">
                        <div className="md:col-span-5 flex flex-col items-start gap-6">
                            <span className="font-mono text-xs text-primary uppercase tracking-widest">
                                Warisan &amp; Keunggulan
                            </span>
                            <h1 className="text-5xl md:text-6xl font-bold text-on-surface leading-tight tracking-tight">
                                Disiplin. Kehormatan. Ketepatan.
                            </h1>
                            <p className="text-lg text-secondary leading-relaxed">
                                Bergabunglah dengan institusi yang berdedikasi pada studi bela diri yang ketat. Kami menempa ketahanan fisik dan mental melalui metodologi yang teruji waktu.
                            </p>
                            {!auth.user && (
                                <div className="flex gap-3 pt-1">
                                    <Link
                                        href={route('register')}
                                        className="bg-primary text-on-primary font-mono text-sm px-10 py-3 rounded hover:opacity-90 transition-opacity"
                                    >
                                        Daftar Sekarang
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="bg-surface-container-lowest border border-outline-variant text-on-surface font-mono text-sm px-10 py-3 rounded hover:bg-surface-variant transition-colors"
                                    >
                                        Masuk
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className="md:col-span-7 h-[480px] bg-surface-container-high rounded border border-outline-variant overflow-hidden">
                            <img
                                className="w-full h-full object-cover grayscale opacity-90 mix-blend-multiply"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALnOMEH-KZNmcQq8roRt2u0DboYGW07yVSB8MZcHYykbUona_2ukLRx5b_0shR488SFe8FnJVT2gd4waJbErAdHK4cDGIbymoY5bD7LU1xy2LyGB_zGBNTYOmlc09vuqgeWBxaVRPY488PQIsbEQ4TrceSvDR71Dvdu273tcWJpZWwThS05raZoPADU8QgGooaD8BJBTJ0bWVOPrmFdCt2074a7kuJmR-lzjZ3mtgZmnU3NOKyM1iTDul_IMGZ-JW3gkWnVion_w"
                                alt="Latihan Pencak Silat Garuda Amarta"
                            />
                        </div>
                    </section>

                    {/* Curriculum */}
                    <section className="flex flex-col gap-6">
                        <div>
                            <h2 className="text-3xl font-semibold text-on-surface tracking-tight">Kurikulum</h2>
                            <p className="text-base text-secondary max-w-2xl mt-1">
                                Program terstruktur yang dirancang untuk penguasaan progresif.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="bg-surface-container-lowest border border-outline-variant rounded p-10 flex flex-col justify-between min-h-[300px] group hover:border-primary transition-colors">
                                <div>
                                    <span className="material-symbols-outlined text-primary mb-3 block" style={{ fontSize: 32 }}>
                                        sports_martial_arts
                                    </span>
                                    <h3 className="text-2xl font-semibold text-on-surface">Fundamental</h3>
                                    <p className="text-base text-secondary mt-2">
                                        Membangun mekanik inti, sikap, dan disiplin dasar yang diperlukan untuk studi lanjutan.
                                    </p>
                                </div>
                                <a href="#" className="font-mono text-sm text-primary mt-6 flex items-center gap-1 group-hover:underline">
                                    Lihat Detail
                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                                </a>
                            </div>

                            {/* Card 2 — Featured */}
                            <div className="bg-tertiary border border-outline-variant rounded p-10 flex flex-col justify-between min-h-[300px]">
                                <div>
                                    <span className="material-symbols-outlined text-on-tertiary mb-3 block" style={{ fontSize: 32 }}>
                                        workspace_premium
                                    </span>
                                    <h3 className="text-2xl font-semibold text-on-tertiary">Kombatif Lanjutan</h3>
                                    <p className="text-base text-on-tertiary-container mt-2">
                                        Pelatihan intensif dengan fokus pada aplikasi, strategi, dan kondisi fisik optimal.
                                    </p>
                                </div>
                                <a href="#" className="font-mono text-sm text-on-tertiary mt-6 flex items-center gap-1 hover:underline">
                                    Lihat Detail
                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                                </a>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-surface-container-lowest border border-outline-variant rounded p-10 flex flex-col justify-between min-h-[300px] group hover:border-primary transition-colors">
                                <div>
                                    <span className="material-symbols-outlined text-primary mb-3 block" style={{ fontSize: 32 }}>
                                        school
                                    </span>
                                    <h3 className="text-2xl font-semibold text-on-surface">Jalur Pelatih</h3>
                                    <p className="text-base text-secondary mt-2">
                                        Sertifikasi ketat bagi praktisi senior untuk memimpin dan melatih generasi berikutnya.
                                    </p>
                                </div>
                                <a href="#" className="font-mono text-sm text-primary mt-6 flex items-center gap-1 group-hover:underline">
                                    Lihat Detail
                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-tertiary w-full py-12 border-t border-outline-variant">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4 md:px-10 max-w-[1440px] mx-auto">
                        <div className="font-bold text-on-tertiary text-lg">
                            PS. Garuda Amarta
                        </div>
                        <nav className="flex flex-wrap justify-center gap-6">
                            {['Kebijakan Privasi', 'Syarat Layanan', 'Hubungi Kami'].map((item) => (
                                <a key={item} href="#" className="font-mono text-xs text-on-tertiary-container hover:text-on-primary-container transition-colors">
                                    {item}
                                </a>
                            ))}
                        </nav>
                        <div className="font-mono text-xs text-on-tertiary-container">
                            © {new Date().getFullYear()} PS. Garuda Amarta. All rights reserved.
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}
