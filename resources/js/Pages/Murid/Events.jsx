import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar, Upload, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';

const formatTanggal = (d) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

const statusConfig = {
    Menunggu: { label: 'Menunggu Verifikasi', icon: Clock,         cls: 'bg-orange-500/20 text-orange-400' },
    ACC:      { label: 'Diterima',            icon: CheckCircle,   cls: 'bg-emerald-500/20 text-emerald-400' },
    Ditolak:  { label: 'Ditolak',             icon: XCircle,       cls: 'bg-red-500/20 text-red-400' },
};

export default function Events({ events }) {
    const [selectedEvent, setSelectedEvent] = useState(null);

    const { data, setData, post, processing, errors, reset, progress } = useForm({
        file_berkas: null,
    });

    const openUpload = (event) => { setSelectedEvent(event); reset(); };
    const closeModal = () => { setSelectedEvent(null); reset(); };

    const handleUpload = (e) => {
        e.preventDefault();
        post(route('murid.events.daftar', selectedEvent.id), {
            forceFormData: true,
            onSuccess: closeModal,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Acara Mendatang" />
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">Acara Mendatang</h1>
                        <p className="text-gray-400 text-sm mt-1">Daftar dan unggah berkas persyaratan untuk mengikuti acara</p>
                    </div>

                    {events.length === 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-14 text-center text-gray-500 text-sm">
                            Belum ada acara yang tersedia.
                        </div>
                    )}

                    <div className="space-y-4">
                        {events.map((event) => {
                            const reg    = event.registrasi;
                            const status = reg ? statusConfig[reg.status] : null;
                            const StatusIcon = status?.icon;
                            const isDitolak  = reg?.status === 'Ditolak';
                            const isMenunggu = reg?.status === 'Menunggu';
                            const isACC      = reg?.status === 'ACC';

                            return (
                                <div key={event.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-semibold text-white">{event.nama_acara}</h3>
                                            <div className="flex items-center gap-1.5 mt-1.5 text-sm text-gray-400">
                                                <Calendar size={13} />
                                                {formatTanggal(event.tanggal_pelaksanaan)}
                                            </div>
                                            {event.deskripsi && (
                                                <p className="mt-3 text-sm text-gray-400 leading-relaxed border-l-2 border-white/10 pl-3">
                                                    {event.deskripsi}
                                                </p>
                                            )}

                                            {/* Status badge */}
                                            {status && (
                                                <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-medium ${status.cls}`}>
                                                    <StatusIcon size={12} />
                                                    {status.label}
                                                </div>
                                            )}

                                            {/* Pesan jika ditolak */}
                                            {isDitolak && (
                                                <p className="mt-2 text-xs text-red-400">
                                                    Berkas Anda ditolak. Silakan unggah ulang berkas yang sesuai.
                                                </p>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        <div className="shrink-0">
                                            {!reg && (
                                                <button
                                                    onClick={() => openUpload(event)}
                                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                                >
                                                    <Upload size={14} />
                                                    Daftar
                                                </button>
                                            )}
                                            {isDitolak && (
                                                <button
                                                    onClick={() => openUpload(event)}
                                                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                                >
                                                    <RefreshCw size={14} />
                                                    Upload Ulang
                                                </button>
                                            )}
                                            {isMenunggu && (
                                                <span className="text-xs text-gray-500 italic">Menunggu review</span>
                                            )}
                                            {isACC && (
                                                <span className="text-xs text-emerald-400 font-medium">Pendaftaran selesai</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            <Modal show={!!selectedEvent} onClose={closeModal} maxWidth="md">
                <form onSubmit={handleUpload} className="p-6 bg-[#1a1a1a] rounded-2xl">
                    <h2 className="text-lg font-semibold text-white mb-1">Upload Berkas</h2>
                    <p className="text-gray-400 text-sm mb-5">
                        Acara: <span className="text-white">{selectedEvent?.nama_acara}</span>
                    </p>

                    {selectedEvent?.deskripsi && (
                        <div className="mb-5 p-3 bg-white/5 rounded-xl border border-white/10 text-sm text-gray-400">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Persyaratan</p>
                            {selectedEvent.deskripsi}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            File Berkas <span className="text-gray-600">(JPG, PNG, PDF — maks. 2MB)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => setData('file_berkas', e.target.files[0])}
                                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-600 file:text-white hover:file:bg-red-700 file:cursor-pointer cursor-pointer bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus:outline-none"
                            />
                        </div>
                        {progress && (
                            <div className="mt-2 w-full bg-white/10 rounded-full h-1.5">
                                <div
                                    className="bg-red-500 h-1.5 rounded-full transition-all"
                                    style={{ width: `${progress.percentage}%` }}
                                />
                            </div>
                        )}
                        <InputError message={errors.file_berkas} className="mt-1" />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <SecondaryButton type="button" onClick={closeModal}>Batal</SecondaryButton>
                        <button
                            type="submit"
                            disabled={processing || !data.file_berkas}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <Upload size={14} />
                            {processing ? 'Mengunggah...' : 'Kirim Berkas'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
