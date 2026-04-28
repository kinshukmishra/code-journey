import { useState } from 'react';

interface BinaryToggleProps {
  value: string;
  onChange: (value: string) => void;
}

const BIT_VALUES = [128, 64, 32, 16, 8, 4, 2, 1];

export default function BinaryToggle({ value, onChange }: BinaryToggleProps) {
  const bits = value.padStart(8, '0').split('').map(Number);
  const decimal = parseInt(value.padStart(8, '0'), 2);
  const [lastFlipped, setLastFlipped] = useState<number | null>(null);

  const toggle = (index: number) => {
    const newBits = [...bits];
    newBits[index] = newBits[index] === 0 ? 1 : 0;
    setLastFlipped(index);
    onChange(newBits.join(''));
    setTimeout(() => setLastFlipped(null), 300);
  };

  return (
    <div className="binary-toggle">
      <div className="bit-values">
        {BIT_VALUES.map((v, i) => (
          <div key={i} className="bit-value-label">{v}</div>
        ))}
      </div>
      <div className="bit-row">
        {bits.map((bit, i) => (
          <button
            key={i}
            className={`bit-switch ${bit ? 'on' : 'off'} ${lastFlipped === i ? 'flipped' : ''}`}
            onClick={() => toggle(i)}
            aria-label={`Bit ${7 - i}: ${bit ? 'ON' : 'OFF'} (value ${BIT_VALUES[i]})`}
          >
            <span className="bit-digit">{bit}</span>
            <span className="bit-light">{bit ? '💡' : '⚫'}</span>
          </button>
        ))}
      </div>
      <div className="decimal-display">
        = <span className="decimal-value">{decimal}</span> in decimal
        {decimal > 0 && (
          <span className="addition">
            {' '}({BIT_VALUES.filter((_, i) => bits[i] === 1).join(' + ')})
          </span>
        )}
      </div>
    </div>
  );
}
