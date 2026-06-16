import { useRef, useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import QRCode from 'qrcode';

export default function KartuAnggota({ nama, nomor_anggota, ranting, role, foto, gelar, sabuk }) {
    const cardRef = useRef(null);
    const qrRef   = useRef(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (!qrRef.current) return;
        const url = nomor_anggota
            ? `https://garuda-amarta.id/anggota/${nomor_anggota}`
            : 'https://garuda-amarta.id';
        QRCode.toCanvas(qrRef.current, url, {
            width:  68,
            margin: 1,
            color:  { dark: '#ffffff', light: '#00000000' },
        });
    }, [nomor_anggota]);

    const downloadKartu = async () => {
        if (!cardRef.current) return;
        setDownloading(true);
        try {
            const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
                import('html2canvas'),
                import('jspdf'),
            ]);
            const canvas = await html2canvas(cardRef.current, {
                useCORS: true, scale: 3, backgroundColor: null, logging: false,
            });
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] });
            pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 85.6, 54);
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
            <div
                ref={cardRef}
                style={{
                    width: '342px', height: '216px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #610000 0%, #8b0000 50%, #4a0000 100%)',
                    position: 'relative', overflow: 'hidden',
                    fontFamily: 'sans-serif', color: '#fff', flexShrink: 0,
                }}
            >
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: '-50px', left: '-30px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

                {/* Header */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '38px',
                    background: 'rgba(0,0,0,0.25)',
                    display: 'flex', alignItems: 'center',
                    paddingLeft: '14px', paddingRight: '14px', justifyContent: 'space-between',
                }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        PS. GARUDA AMARTA
                    </span>
                    <span style={{ fontSize: '9px', fontWeight: '600', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '20px' }}>
                        {role?.toUpperCase()}
                    </span>
                </div>

                {/* Body: foto | info | QR */}
                <div style={{
                    position: 'absolute', top: '46px', left: '14px', right: '14px', bottom: '38px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                    {/* Foto */}
                    <div style={{
                        width: '72px', height: '72px', borderRadius: '50%',
                        border: '3px solid rgba(255,255,255,0.4)',
                        overflow: 'hidden', flexShrink: 0,
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {foto ? (
                            <img src={foto} alt={nama} crossOrigin="anonymous"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '26px', fontWeight: '700', color: 'rgba(255,255,255,0.6)' }}>
                                {nama?.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', lineHeight: '1.3', marginBottom: '5px', wordBreak: 'break-word' }}>
                            {displayName}
                        </div>
                        {ranting && (
                            <div style={{ fontSize: '10px', color: 'rgba(255,220,220,0.9)', marginBottom: '4px' }}>
                                {ranting}
                            </div>
                        )}
                        {sabuk && (
                            <div style={{
                                display: 'inline-block', fontSize: '9px',
                                background: 'rgba(255,255,255,0.15)', padding: '2px 8px',
                                borderRadius: '20px', fontWeight: '600',
                            }}>
                                {sabuk}
                            </div>
                        )}
                    </div>

                    {/* QR Code */}
                    <div style={{
                        flexShrink: 0,
                        background: 'rgba(0,0,0,0.25)',
                        borderRadius: '8px',
                        padding: '4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <canvas ref={qrRef} style={{ display: 'block' }} />
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '34px',
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex', alignItems: 'center',
                    paddingLeft: '14px', paddingRight: '14px', justifyContent: 'space-between',
                }}>
                    <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        Kartu Anggota Resmi
                    </span>
                    <span style={{ fontSize: '8px', fontFamily: 'monospace', letterSpacing: '1px', color: 'rgba(255,255,255,0.6)' }}>
                        {nomor_anggota ?? '—'}
                    </span>
                </div>
            </div>

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
