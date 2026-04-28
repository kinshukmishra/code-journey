import { useState, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export default function BinaryAdder({ a, b, caption }: { a: string; b: string; caption?: string }) {
  const bitsA = a.padStart(4, '0').split('').map(Number);
  const bitsB = b.padStart(4, '0').split('').map(Number);

  const [currentCol, setCurrentCol] = useState(-1);
  const [carries, setCarries] = useState<number[]>([0, 0, 0, 0, 0]);
  const [result, setResult] = useState<(number | null)[]>([null, null, null, null]);

  const advance = useCallback(() => {
    const col = currentCol + 1;
    if (col >= 4) return;

    const idx = 3 - col;
    const carry = col === 0 ? 0 : carries[idx + 1];
    const sum = bitsA[idx] + bitsB[idx] + carry;
    const bit = sum % 2;
    const newCarry = Math.floor(sum / 2);

    setResult(prev => {
      const next = [...prev];
      next[idx] = bit;
      return next;
    });
    setCarries(prev => {
      const next = [...prev];
      next[idx] = newCarry;
      return next;
    });
    setCurrentCol(col);
  }, [currentCol, bitsA, bitsB, carries]);

  const reset = () => {
    setCurrentCol(-1);
    setCarries([0, 0, 0, 0, 0]);
    setResult([null, null, null, null]);
  };

  const done = currentCol >= 3;
  const activeIdx = currentCol >= 0 ? 3 - currentCol : -1;

  return (
    <div className="binary-adder">
      <div className="adder-grid">
        <div className="adder-row carry-row">
          <span className="adder-label">Carry</span>
          {carries.slice(0, 4).map((c, i) => (
            <span key={i} className={`adder-cell carry ${c > 0 ? 'active' : ''} ${i === activeIdx ? 'highlight' : ''}`}>
              {c > 0 ? c : ''}
            </span>
          ))}
        </div>
        <div className="adder-row">
          <span className="adder-label"></span>
          {bitsA.map((bit, i) => (
            <span key={i} className={`adder-cell ${i === activeIdx ? 'highlight' : ''}`}>{bit}</span>
          ))}
        </div>
        <div className="adder-row">
          <span className="adder-label">+</span>
          {bitsB.map((bit, i) => (
            <span key={i} className={`adder-cell ${i === activeIdx ? 'highlight' : ''}`}>{bit}</span>
          ))}
        </div>
        <div className="adder-divider" />
        <div className="adder-row result-row">
          <span className="adder-label">=</span>
          {result.map((bit, i) => (
            <span key={i} className={`adder-cell result ${bit !== null ? 'filled' : ''} ${i === activeIdx ? 'highlight' : ''}`}>
              {bit !== null ? bit : '?'}
            </span>
          ))}
        </div>
      </div>

      {done && (
        <div className="adder-summary">
          {a} + {b} = {result.join('')} ({parseInt(a, 2)} + {parseInt(b, 2)} = {parseInt(result.join(''), 2)})
        </div>
      )}

      <div className="adder-controls">
        <button className="btn btn-step-sim" onClick={advance} disabled={done}>
          <Play size={14} /> {currentCol < 0 ? 'Start Adding' : done ? 'Done!' : 'Next Column'}
        </button>
        <button className="btn btn-reset" onClick={reset}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {caption && <div className="visual-caption">{caption}</div>}
    </div>
  );
}
