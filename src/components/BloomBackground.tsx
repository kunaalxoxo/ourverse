'use client';

export default function BloomBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden>

      {/* Dot grid — warm cream dots */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(232,213,176,0.22) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        opacity: 0.20,
        maskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, black 20%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, black 20%, transparent 75%)',
      }} />

      {/* Static warm cream glow — top left */}
      <div style={{
        position: 'absolute',
        width: 700, height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,213,176,0.045) 0%, transparent 65%)',
        top: -200, left: -200,
        filter: 'blur(60px)',
      }} />

      {/* Static amber glow — bottom right */}
      <div style={{
        position: 'absolute',
        width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,154,108,0.035) 0%, transparent 65%)',
        bottom: -160, right: -160,
        filter: 'blur(60px)',
      }} />

      {/* Film grain */}
      <svg
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          opacity: 0.048,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* Edge vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(10,9,8,0.65) 100%)',
      }} />

    </div>
  );
}
