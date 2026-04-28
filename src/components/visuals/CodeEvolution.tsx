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
          <pre className="evolution-code"><code>{stages[current].code}</code></pre>
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
