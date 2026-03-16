'use client';

const ITEMS = ['Our Verse', 'made with love', 'just for you', 'always', 'forever', 'our little world'];

export default function MarqueeStrip({ inverted }: { inverted?: boolean }) {
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="marquee-root">
      <div className={`marquee-track ${inverted ? 'marquee-reverse' : ''}`}>
        {repeated.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}<span className="marquee-dot">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
