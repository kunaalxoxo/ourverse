'use client';

const ITEMS = [
  'our verse',
  'since 18 nov 2024',
  'made with love',
  'just us two',
  'infinite moments',
  'our verse',
  'since 18 nov 2024',
  'made with love',
  'just us two',
  'infinite moments',
];

export default function MarqueeStrip({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className="marquee-root" aria-hidden>
      <div className={`marquee-track ${inverted ? 'marquee-reverse' : ''}`}>
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
            <span className="marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
