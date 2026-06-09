import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, Check, X, UserCheck, Clock } from 'lucide-react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

const formatTanggal = (d) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

function DetailRow({ label, value }) {
    return (
        <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-xs text-[#585f67] uppercase font-medium tracking-wider min-w-[140px] mb-0.5 sm:mb-0 sm:pt-0.5">
                {label}
            </dt>
            <dd className="text-sm text-[#141c25] font-medium flex-1">{value || '—'}</dd>
        </div>
    );
}

export default function VerifikasiMurid({ muridList }) {
    const [selectedMurid, setSelectedMurid] = useState(null);
    const [confirming, setConfirming] = useState(null); // { murid, action: 'approve' | 'reject' }
    const [processing, setProcessing] = useState(false);

    const openDetail = (murid) => setSelectedMurid(murid);
    const closeDetail = () => setSelectedMurid(null);

    const openConfirm = (murid, action) => {
        setSelectedMurid(null);
        setConfirming({ murid, action });
    };

    const submitAction = () => {
        if (!confirming) return;
        setProcessing(true);
        const routeName =
            confirming.action === 'approve'
                ? 'pelatih.murid-baru.approve'
                : 'pelatih.murid-baru.reject';
        router.patch(
            route(routeName, confirming.murid.id),
            {},
            {
                onSuccess: () => { setConfirming(null); setProcessing(false); },
                onError: () => setProcessing(false),
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Verifikasi Murid Baru" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <UserCheck size={22} className="text-[#610000]" />
                        <h1 className="text-2xl font-semibold text-[#141c25]">Verifikasi Murid Baru</h1>
                        {muridList.length > 0 && (
                            <span className="ml-1 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ffebee] text-[#b71c1c]">
                                {muridList.length}
                            </span>
                        )}
                    </div>
                    <p className="text-[#585f67] text-sm mt-0.5 ml-7">
                        Tinjau dan setujui atau tolak pendaftaran murid baru
                    </p>
                </div>
            </div>

            {/* Empty State */}
            {muridList.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-16 text-center shadow-sm">
                    <div className="flex justify-center mb-4">
                        <div className="h-14 w-14 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                            <Check size={28} className="text-[#1b5e20]" />
                        </div>
                    </div>
                    <p className="text-[#141c25] font-semibold text-base mb-1">Semua Sudah Terverifikasi</p>
                    <p className="text-[#585f67] text-sm">Tidak ada murid yang menunggu verifikasi saat ini.</p>
                </div>
            )}

            {/* Table */}
            {muridList.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#2a2d2e]">
                                    {['Nama', 'Email', 'Ranting', 'Mendaftar Pada', 'Aksi'].map((h) => (
                                        <th
                                            key={h}
                                            className={`px-6 py-4 text-xs font-medium text-white uppercase tracking-wider ${
                                                h === 'Aksi' ? 'text-center' : 'text-left'
                                            }`}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {muridList.map((murid) => (
                                    <tr key={murid.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-[#610000] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {murid.nama?.charAt(0) ?? '?'}
                                                </div>
                                                <span className="text-sm font-medium text-[#141c25]">{murid.nama}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#585f67]">{murid.email}</td>
                                        <td className="px-6 py-4 text-sm text-[#585f67]">{murid.ranting || '—'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-[#585f67]">
                                                <Clock size={13} className="text-gray-400" />
                                                {formatTanggal(murid.mendaftar_pada)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => openDetail(murid)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e3f2fd] hover:bg-[#bbdefb] text-[#0d47a1] text-xs font-medium rounded-lg transition-colors"
                                            >
                                                <Eye size={13} />
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            <Modal show={!!selectedMurid} onClose={closeDetail} maxWidth="lg">
                {selectedMurid && (
                    <div className="bg-white rounded-lg overflow-hidden">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#610000] flex items-center justify-center text-white font-bold">
                                {selectedMurid.nama?.charAt(0) ?? '?'}
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-[#141c25]">{selectedMurid.nama}</h2>
                                <p className="text-xs text-[#585f67]">Data Pendaftaran Murid Baru</p>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-5">
                            <dl className="space-y-3">
                                <DetailRow label="Nama Lengkap" value={selectedMurid.nama} />
                                <DetailRow label="Email" value={selectedMurid.email} />
                                <DetailRow label="Ranting" value={selectedMurid.ranting} />
                                <DetailRow
                                    label="Tempat & Tgl. Lahir"
                                    value={
                                        [selectedMurid.tempat_lahir, selectedMurid.tanggal_lahir
                                            ? formatTanggal(selectedMurid.tanggal_lahir) : null]
                                            .filter(Boolean).join(', ')
                                    }
                                />
                                <DetailRow label="Nomor HP" value={selectedMurid.nomor_hp} />
                                <DetailRow
                                    label="Pernah Beladiri"
                                    value={selectedMurid.pernah_beladiri ? 'Ya' : 'Tidak'}
                                />
                                {selectedMurid.pernah_beladiri && (
                                    <DetailRow label="Jenis Beladiri" value={selectedMurid.jenis_beladiri} />
                                )}
                                <DetailRow label="Alasan Mendaftar" value={selectedMurid.alasan_mendaftar} />
                                <DetailRow
                                    label="Mendaftar Pada"
                                    value={formatTanggal(selectedMurid.mendaftar_pada)}
                                />
                            </dl>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <SecondaryButton onClick={closeDetail}>Tutup</SecondaryButton>
                            <button
                                onClick={() => openConfirm(selectedMurid, 'reject')}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ffebee] hover:bg-[#ffcdd2] text-[#b71c1c] text-sm font-medium rounded-lg transition-colors"
                            >
                                <X size={15} />
                                Tolak
                            </button>
                            <button
                                onClick={() => openConfirm(selectedMurid, 'approve')}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1b5e20] hover:bg-[#2e7d32] text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Check size={15} />
                                Setujui
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Confirm Modal */}
            <Modal show={!!confirming} onClose={() => setConfirming(null)} maxWidth="sm">
                {confirming && (
                    <div className="p-6 bg-white rounded-lg">
                        <h2 className="text-lg font-semibold text-[#141c25] mb-2">
                            {confirming.action === 'approve' ? 'Setujui Pendaftaran?' : 'Tolak Pendaftaran?'}
                        </h2>
                        <p className="text-[#585f67] text-sm mb-6">
                            {confirming.action === 'approve' ? (
                                <>
                                    Murid{' '}
                                    <span className="text-[#141c25] font-medium">{confirming.murid.nama}</span>{' '}
                                    akan disetujui dan mendapatkan akses sebagai murid aktif.
                                </>
                            ) : (
                                <>
                                    Pendaftaran{' '}
                                    <span className="text-[#141c25] font-medium">{confirming.murid.nama}</span>{' '}
                                    akan ditolak. Murid tidak akan mendapatkan akses ke sistem.
                                </>
                            )}
                        </p>
                        <div className="flex justify-end gap-3">
                            <SecondaryButton onClick={() => setConfirming(null)} disabled={processing}>
                                Batal
                            </SecondaryButton>
                            <button
                                onClick={submitAction}
                                disabled={processing}
                                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
                                    confirming.action === 'approve'
                                        ? 'bg-[#1b5e20] hover:bg-[#2e7d32] text-white'
                                        : 'bg-[#610000] hover:bg-[#7a0000] text-white'
                                }`}
                            >
                                {processing
                                    ? 'Memproses...'
                                    : confirming.action === 'approve'
                                    ? 'Ya, Setujui'
                                    : 'Ya, Tolak'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
