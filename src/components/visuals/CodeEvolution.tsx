import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export interface EvolutionStage {
  era: string;
  code: string;
}

export default function CodeEvolution({ stages, caption }: { stages: EvolutionStage[]; caption?: string }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="code-evolution">
      <div className="evolution-stages">
        {stages.map((s, idx) => (
          <button
            key={idx}
            className={`evolution-dot ${idx === current ? 'active' : ''} ${idx < current ? 'past' : ''}`}
            onClick={() => setCurrent(idx)}
          >
            {s.era}
          </button>
        ))}
      </div>

      <div className="evolution-display">
        <button
          className="evolution-nav prev"
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="evolution-code-area">
          <div className="evolution-era-label">{stages[current].era}</div>
          {/^(##\s|[-*]\s)/m.test(stages[current].code) ? (
            <div className="evolution-code evolution-spec">
              {stages[current].code.split('\n').map((line, i) => {
                const t = line.trim();
                if (t.startsWith('## ')) return <div key={i} className="spec-heading">{t.slice(3)}</div>;
                if (t.startsWith('- ') || t.startsWith('* ')) return <div key={i} className="spec-item"><span className="spec-dot" />{t.slice(2)}</div>;
                if (!t) return <div key={i} className="spec-gap" />;
                return <div key={i}>{t}</div>;
              })}
            </div>
          ) : (
            <pre className="evolution-code"><code>{stages[current].code}</code></pre>
          )}
        </div>

        <button
          className="evolution-nav next"
          onClick={() => setCurrent(c => Math.min(stages.length - 1, c + 1))}
          disabled={current === stages.length - 1}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {caption && <div className="visual-caption">{caption}</div>}
    </div>
  );
}
