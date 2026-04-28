import { useState } from 'react';

const CHARS = [
  ...Array.from({ length: 26 }, (_, i) => ({ char: String.fromCharCode(65 + i), code: 65 + i })),
  ...Array.from({ length: 26 }, (_, i) => ({ char: String.fromCharCode(97 + i), code: 97 + i })),
  ...Array.from({ length: 10 }, (_, i) => ({ char: String(i), code: 48 + i })),
  { char: ' ', code: 32 },
  { char: '!', code: 33 },
  { char: '?', code: 63 },
  { char: '.', code: 46 },
];

export default function AsciiTable({ caption }: { caption?: string }) {
  const [selected, setSelected] = useState<{ char: string; code: number } | null>(null);

  const toBinary = (n: number) => n.toString(2).padStart(8, '0');

  return (
    <div className="ascii-table-container">
      <div className="ascii-grid">
        {CHARS.map(({ char, code }) => (
          <button
            key={code}
            className={`ascii-cell ${selected?.code === code ? 'selected' : ''}`}
            onClick={() => setSelected(selected?.code === code ? null : { char, code })}
          >
            <span className="ascii-char">{char === ' ' ? '\u2423' : char}</span>
            <span className="ascii-code">{code}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="ascii-detail">
          <div className="ascii-detail-char">{selected.char === ' ' ? 'Space' : `"${selected.char}"`}</div>
          <div className="ascii-detail-row">
            <span className="ascii-detail-label">Decimal:</span>
            <span className="ascii-detail-value">{selected.code}</span>
          </div>
          <div className="ascii-detail-row">
            <span className="ascii-detail-label">Binary:</span>
            <span className="ascii-detail-value mono">{toBinary(selected.code)}</span>
          </div>
          <div className="ascii-bits">
            {toBinary(selected.code).split('').map((bit, i) => (
              <span key={i} className={`ascii-bit ${bit === '1' ? 'on' : 'off'}`}>{bit}</span>
            ))}
          </div>
        </div>
      )}

      {caption && <div className="visual-caption">{caption}</div>}
    </div>
  );
}
