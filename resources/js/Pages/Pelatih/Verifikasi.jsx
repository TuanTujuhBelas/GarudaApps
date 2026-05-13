import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Check, X, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

const statusBadge = {
    Menunggu: 'bg-orange-500/20 text-orange-400',
    ACC:      'bg-emerald-500/20 text-emerald-400',
    Ditolak:  'bg-red-500/20 text-red-400',
};

const formatTanggal = (d) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

export default function Verifikasi({ events }) {
    const [openEvent, setOpenEvent]     = useState(events[0]?.id ?? null);
    const [confirming, setConfirming]   = useState(null); // { regId, status, nama }
    const [processing, setProcessing]   = useState(false);

    const toggle = (id) => setOpenEvent(prev => prev === id ? null : id);

    const handleVerifikasi = (regId, status, namaMurid) => {
        setConfirming({ regId, status, nama: namaMurid });
    };

    const submitVerifikasi = () => {
        setProcessing(true);
        router.patch(route('pelatih.verifikasi.update', confirming.regId),
            { status: confirming.status },
            {
                onSuccess: () => { setConfirming(null); setProcessing(false); },
                onError:   () => setProcessing(false),
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Verifikasi Berkas" />
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">Verifikasi Berkas</h1>
                        <p className="text-gray-400 text-sm mt-1">Periksa dan validasi berkas pendaftaran murid</p>
                    </div>

                    {events.length === 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-gray-500 text-sm">
                            Belum ada acara yang dibuat.
                        </div>
                    )}

                    <div className="space-y-4">
                        {events.map((event) => (
                            <div key={event.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                {/* Event Header */}
                                <button
                                    onClick={() => toggle(event.id)}
                                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-colors"
                                >
                                    <div className="text-left">
                                        <p className="font-semibold text-white">{event.nama_acara}</p>
                                        <p className="text-sm text-gray-400 mt-0.5">{formatTanggal(event.tanggal_pelaksanaan)}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-full">
                                            {event.registrations.length} pendaftar
                                        </span>
                                        {openEvent === event.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                    </div>
                                </button>

                                {/* Registrations Table */}
                                {openEvent === event.id && (
                                    <div className="border-t border-white/10">
                                        {event.registrations.length === 0 ? (
                                            <p className="px-6 py-8 text-center text-sm text-gray-500">Belum ada murid yang mendaftar.</p>
                                        ) : (
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="bg-white/5 border-b border-white/10">
                                                        {['Murid', 'Tingkatan', 'Berkas', 'Status', 'Aksi'].map(h => (
                                                            <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider ${h === 'Aksi' ? 'text-center' : 'text-left'}`}>{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {event.registrations.map((reg) => (
                                                        <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-6 py-4 text-sm font-medium text-white">{reg.murid.name}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-400">{reg.murid.ranting ?? '—'}</td>
                                                            <td className="px-6 py-4">
                                                                <a
                                                                    href={`/storage/${reg.file_berkas_path}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                                                >
                                                                    <FileText size={13} />
                                                                    Lihat Berkas
                                                                </a>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge[reg.status]}`}>
                                                                    {reg.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {reg.status === 'Menunggu' && (
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <button
                                                                            onClick={() => handleVerifikasi(reg.id, 'ACC', reg.murid.name)}
                                                                            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs rounded-lg transition-colors"
                                                                        >
                                                                            <Check size={12} /> ACC
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleVerifikasi(reg.id, 'Ditolak', reg.murid.name)}
                                                                            className="flex items-center gap-1 px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded-lg transition-colors"
                                                                        >
                                                                            <X size={12} /> Tolak
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {reg.status !== 'Menunggu' && (
                                                                    <span className="block text-center text-xs text-gray-600">—</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Konfirmasi Modal */}
            <Modal show={!!confirming} onClose={() => setConfirming(null)} maxWidth="sm">
                <div className="p-6 bg-[#1a1a1a] rounded-2xl">
                    <h2 className="text-lg font-semibold text-white mb-2">
                        {confirming?.status === 'ACC' ? 'Setujui Berkas?' : 'Tolak Berkas?'}
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">
                        Berkas dari <span className="text-white font-medium">{confirming?.nama}</span> akan ditandai sebagai{' '}
                        <span className={confirming?.status === 'ACC' ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                            {confirming?.status}
                        </span>.
                        {confirming?.status === 'Ditolak' && ' Murid akan diminta mengunggah ulang.'}
                    </p>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirming(null)}>Batal</SecondaryButton>
                        <button
                            onClick={submitVerifikasi}
                            disabled={processing}
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
                                confirming?.status === 'ACC'
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                        >
                            {processing ? 'Memproses...' : `Ya, ${confirming?.status}`}
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
