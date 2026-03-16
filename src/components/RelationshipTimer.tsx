'use client';
import { useState, useEffect } from 'react';

const START = new Date('2024-11-18T00:00:00');

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function RelationshipTimer() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Date.now() - START.getTime();
      const days    = Math.floor(diff / 86400000);
      const hours   = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setT({ days, hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      {[{ label: 'days', value: t.days }, { label: 'hrs', value: t.hours }, { label: 'min', value: t.minutes }, { label: 'sec', value: t.seconds }].map(({ label, value }) => (
        <div key={label} style={{ textAlign: 'center' }}>
          <div className="font-display" style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {label === 'days' ? value : pad(value)}
          </div>
          <div className="label" style={{ marginTop: 4 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}
