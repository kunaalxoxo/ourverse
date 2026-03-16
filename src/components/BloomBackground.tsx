'use client';

export default function BloomBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden>
      {/* Dot grid — light mode, very subtle */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.10) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.55,
        maskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, black 20%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, black 20%, transparent 80%)',
      }} />
      {/* Soft blush glow — top right */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,123,132,0.07) 0%, transparent 65%)',
        top: -180, right: -150, filter: 'blur(50px)',
      }} />
      {/* Warm cream glow — bottom left */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,123,132,0.05) 0%, transparent 65%)',
        bottom: -140, left: -120, filter: 'blur(50px)',
      }} />
    </div>
  );
}
