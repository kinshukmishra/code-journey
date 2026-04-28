import { useState, useEffect } from 'react';

export interface TransitionData {
  fromEra: string;
  toEra: string;
  insight: string;
  beforeCode: string;
  afterCode: string;
  beforeLabel: string;
  afterLabel: string;
}

export default function TransitionBridge({ data }: { data: TransitionData }) {
  const [stage, setStage] = useState<'before' | 'animating' | 'after'>('before');

  useEffect(() => {
    if (stage === 'before') {
      const t = setTimeout(() => setStage('animating'), 800);
      return () => clearTimeout(t);
    }
    if (stage === 'animating') {
      const t = setTimeout(() => setStage('after'), 1200);
      return () => clearTimeout(t);
    }
  }, [stage]);

  return (
    <div className="transition-bridge">
      <div className="transition-header">
        <span className="transition-from">{data.fromEra}</span>
        <div className="transition-timeline">
          <div className={`transition-progress ${stage}`} />
        </div>
        <span className="transition-to">{data.toEra}</span>
      </div>

      <p className="transition-insight">{data.insight}</p>

      <div className="transition-panels">
        <div className={`transition-panel before ${stage === 'after' ? 'faded' : ''}`}>
          <div className="transition-panel-label">{data.beforeLabel}</div>
          <pre className="transition-code"><code>{data.beforeCode}</code></pre>
        </div>
        <div className={`transition-panel after ${stage === 'after' ? 'active' : ''}`}>
          <div className="transition-panel-label">{data.afterLabel}</div>
          <pre className="transition-code"><code>{data.afterCode}</code></pre>
        </div>
      </div>

      {stage === 'before' && (
        <button className="btn btn-transition" onClick={() => setStage('animating')}>
          See the Evolution
        </button>
      )}
    </div>
  );
}
