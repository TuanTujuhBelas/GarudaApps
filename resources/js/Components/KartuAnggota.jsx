import { useRef, useState } from 'react';
import { Download, CreditCard } from 'lucide-react';

export default function KartuAnggota({ nama, nomor_anggota, ranting, role, foto, gelar, sabuk }) {
    const cardRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    const downloadKartu = async () => {
        if (!cardRef.current) return;
        setDownloading(true);
        try {
            const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
                import('html2canvas'),
                import('jspdf'),
            ]);

            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                scale: 3,
                backgroundColor: null,
                logging: false,
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            // Credit card: 85.6mm × 54mm landscape
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] });
            pdf.addImage(imgData, 'JPEG', 0, 0, 85.6, 54);
            pdf.save(`kartu-${nomor_anggota || nama.replace(/\s+/g, '-').toLowerCase()}.pdf`);
        } catch (e) {
            console.error('Download error:', e);
        } finally {
            setDownloading(false);
        }
    };

    const displayName = gelar ? `${gelar} ${nama}` : nama;

    return (
        <div className="space-y-4">
            {/* Membership Card */}
            <div
                ref={cardRef}
                style={{
                    width: '342px',
                    height: '216px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #610000 0%, #8b0000 50%, #4a0000 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    fontFamily: 'sans-serif',
                    color: '#fff',
                    flexShrink: 0,
                }}
            >
                {/* Decorative circles */}
                <div style={{
                    position: 'absolute', top: '-40px', right: '-40px',
                    width: '160px', height: '160px',
                    borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-50px', left: '-30px',
                    width: '180px', height: '180px',
                    borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
                }} />
                <div style={{
                    position: 'absolute', top: '50px', right: '20px',
                    width: '80px', height: '80px',
                    borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
                }} />

                {/* Header bar */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: '40px',
                    background: 'rgba(0,0,0,0.25)',
                    display: 'flex', alignItems: 'center', paddingLeft: '16px', paddingRight: '16px',
                    justifyContent: 'space-between',
                }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        PS. GARUDA AMARTA
                    </span>
                    <span style={{
                        fontSize: '9px', fontWeight: '600', letterSpacing: '0.5px',
                        background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '20px',
                    }}>
                        {role === 'Pelatih' ? 'PELATIH' : 'MURID'}
                    </span>
                </div>

                {/* Body */}
                <div style={{
                    position: 'absolute', top: '48px', left: '16px', right: '16px', bottom: '36px',
                    display: 'flex', alignItems: 'center', gap: '16px',
                }}>
                    {/* Photo */}
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        border: '3px solid rgba(255,255,255,0.4)',
                        overflow: 'hidden', flexShrink: 0,
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {foto ? (
                            <img
                                src={foto}
                                alt={nama}
                                crossOrigin="anonymous"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <span style={{ fontSize: '28px', fontWeight: '700', color: 'rgba(255,255,255,0.6)' }}>
                                {nama.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', lineHeight: '1.2', marginBottom: '4px', wordBreak: 'break-word' }}>
                            {displayName}
                        </div>
                        {ranting && (
                            <div style={{ fontSize: '10px', color: 'rgba(255,220,220,0.9)', marginBottom: '6px' }}>
                                {ranting}
                            </div>
                        )}
                        {sabuk && (
                            <div style={{
                                display: 'inline-block', fontSize: '9px',
                                background: 'rgba(255,255,255,0.15)', padding: '2px 8px',
                                borderRadius: '20px', marginBottom: '6px', fontWeight: '600',
                            }}>
                                {sabuk}
                            </div>
                        )}
                        {nomor_anggota && (
                            <div style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '1px', color: 'rgba(255,220,220,0.85)' }}>
                                {nomor_anggota}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer bar */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: '32px',
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex', alignItems: 'center', paddingLeft: '16px', paddingRight: '16px',
                    justifyContent: 'space-between',
                }}>
                    <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>
                        KARTU ANGGOTA RESMI
                    </span>
                    <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)' }}>
                        garuda-amarta.id
                    </span>
                </div>
            </div>

            {/* Download Button */}
            <button
                onClick={downloadKartu}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 bg-[#610000] hover:bg-[#7a0000] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
            >
                <Download size={15} />
                {downloading ? 'Memproses...' : 'Unduh Kartu Anggota (PDF)'}
            </button>
        </div>
    );
}
