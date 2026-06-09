import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Camera, CheckCircle, AlertCircle } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

function FotoUploadSection({ profil, role }) {
    const fileRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [localError, setLocalError] = useState(null);
    const page = usePage();
    const message = page.props.message;
    const serverError = page.props.error;

    if (!['Murid', 'Pelatih'].includes(role)) return null;

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLocalError(null);
        setPreview(URL.createObjectURL(file));
        setUploading(true);
        router.post(route('profile.foto'), { foto: file }, {
            forceFormData: true,
            onSuccess: () => setPreview(null),
            onError: (errs) => setLocalError(errs.foto || 'Gagal mengunggah foto.'),
            onFinish: () => setUploading(false),
        });
    };

    const currentFoto = preview || profil?.foto;

    return (
        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
            <section className="max-w-xl">
                <header>
                    <h2 className="text-lg font-medium text-gray-900">Foto Profil</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Foto ini akan ditampilkan di kartu anggota Anda. Maks. 2MB (JPG, PNG, WebP).
                    </p>
                </header>

                {message && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                        <CheckCircle size={14} /> {message}
                    </div>
                )}
                {(localError || serverError) && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        <AlertCircle size={14} /> {localError || serverError}
                    </div>
                )}

                <div className="mt-6 flex items-center gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                        {currentFoto ? (
                            <img src={currentFoto} alt="Foto profil" className="w-full h-full object-cover" />
                        ) : (
                            <Camera size={28} className="text-gray-400" />
                        )}
                    </div>

                    {/* Upload button */}
                    <div className="space-y-1">
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleFile}
                        />
                        <button
                            type="button"
                            disabled={uploading}
                            onClick={() => fileRef.current?.click()}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                            {uploading ? 'Mengunggah...' : currentFoto ? 'Ganti Foto' : 'Unggah Foto'}
                        </button>
                        <p className="text-xs text-gray-400">JPG, PNG, atau WebP</p>
                    </div>
                </div>

                {/* Member info */}
                {profil?.nomor_anggota && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-1">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Info Keanggotaan</p>
                        <p className="text-sm font-mono text-gray-800 font-semibold">{profil.nomor_anggota}</p>
                        {profil.ranting && <p className="text-sm text-gray-600">{profil.ranting}</p>}
                        {profil.sabuk && <p className="text-sm text-gray-600">{profil.sabuk}</p>}
                    </div>
                )}
            </section>
        </div>
    );
}

export default function Edit({ mustVerifyEmail, status, role, profil }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profil
                </h2>
            }
        >
            <Head title="Profil" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <FotoUploadSection profil={profil} role={role} />

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
