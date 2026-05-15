import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Check, X, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

const statusBadge = {
    Menunggu: 'bg-[#fff8e1] text-[#f57f17]',
    ACC:      'bg-[#e8f5e9] text-[#1b5e20]',
    Ditolak:  'bg-[#ffebee] text-[#b71c1c]',
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

            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#141c25]">Verifikasi Berkas</h1>
                <p className="text-[#585f67] text-sm mt-0.5">Periksa dan validasi berkas pendaftaran murid</p>
            </div>

            {events.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-[#585f67] text-sm">
                    Belum ada acara yang dibuat.
                </div>
            )}

            <div className="space-y-3">
                {events.map((event) => (
                    <div key={event.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        {/* Event Header */}
                        <button
                            onClick={() => toggle(event.id)}
                            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="text-left">
                                <p className="font-semibold text-[#141c25]">{event.nama_acara}</p>
                                <p className="text-sm text-[#585f67] mt-0.5">{formatTanggal(event.tanggal_pelaksanaan)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-[#585f67] bg-gray-100 px-2.5 py-1 rounded-full">
                                    {event.registrations.length} pendaftar
                                </span>
                                {openEvent === event.id
                                    ? <ChevronUp size={16} className="text-[#585f67]" />
                                    : <ChevronDown size={16} className="text-[#585f67]" />
                                }
                            </div>
                        </button>

                        {/* Registrations Table */}
                        {openEvent === event.id && (
                            <div className="border-t border-gray-200">
                                {event.registrations.length === 0 ? (
                                    <p className="px-6 py-8 text-center text-sm text-[#585f67]">Belum ada murid yang mendaftar.</p>
                                ) : (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-[#2a2d2e]">
                                                {['Murid', 'Tingkatan', 'Berkas', 'Status', 'Aksi'].map(h => (
                                                    <th key={h} className={`px-6 py-3 text-xs font-medium text-white uppercase tracking-wider ${h === 'Aksi' ? 'text-center' : 'text-left'}`}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {event.registrations.map((reg) => (
                                                <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-medium text-[#141c25]">{reg.murid.name}</td>
                                                    <td className="px-6 py-4 text-sm text-[#585f67]">{reg.murid.ranting ?? '—'}</td>
                                                    <td className="px-6 py-4">
                                                        <a
                                                            href={`/storage/${reg.file_berkas_path}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-xs text-[#0d47a1] hover:text-[#1565c0] transition-colors"
                                                        >
                                                            <FileText size={13} />
                                                            Lihat Berkas
                                                        </a>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusBadge[reg.status]}`}>
                                                            {reg.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {reg.status === 'Menunggu' && (
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => handleVerifikasi(reg.id, 'ACC', reg.murid.name)}
                                                                    className="flex items-center gap-1 px-2.5 py-1 bg-[#e8f5e9] hover:bg-[#c8e6c9] text-[#1b5e20] text-xs rounded-lg transition-colors font-medium"
                                                                >
                                                                    <Check size={12} /> ACC
                                                                </button>
                                                                <button
                                                                    onClick={() => handleVerifikasi(reg.id, 'Ditolak', reg.murid.name)}
                                                                    className="flex items-center gap-1 px-2.5 py-1 bg-[#ffebee] hover:bg-[#ffcdd2] text-[#b71c1c] text-xs rounded-lg transition-colors font-medium"
                                                                >
                                                                    <X size={12} /> Tolak
                                                                </button>
                                                            </div>
                                                        )}
                                                        {reg.status !== 'Menunggu' && (
                                                            <span className="block text-center text-xs text-gray-300">—</span>
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

            {/* Konfirmasi Modal */}
            <Modal show={!!confirming} onClose={() => setConfirming(null)} maxWidth="sm">
                <div className="p-6 bg-white rounded-lg">
                    <h2 className="text-lg font-semibold text-[#141c25] mb-2">
                        {confirming?.status === 'ACC' ? 'Setujui Berkas?' : 'Tolak Berkas?'}
                    </h2>
                    <p className="text-[#585f67] text-sm mb-6">
                        Berkas dari <span className="text-[#141c25] font-medium">{confirming?.nama}</span> akan ditandai sebagai{' '}
                        <span className={confirming?.status === 'ACC' ? 'text-[#1b5e20] font-medium' : 'text-[#b71c1c] font-medium'}>
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
                                    ? 'bg-[#1b5e20] hover:bg-[#2e7d32] text-white'
                                    : 'bg-[#610000] hover:bg-[#7a0000] text-white'
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
