import { useState } from 'react';
import { ChevronRight, CheckCircle } from 'lucide-react';

export interface WorkedExample {
  title: string;
  steps: { label: string; content: string; highlight?: string }[];
}

export default function WorkedExampleCard({ example, onDone }: { example: WorkedExample; onDone?: () => void }) {
  const [visibleSteps, setVisibleSteps] = useState(1);
  const allVisible = visibleSteps >= example.steps.length;

  return (
    <div className="worked-example">
      <h4 className="worked-example-title">{example.title}</h4>
      <div className="worked-steps">
        {example.steps.map((step, idx) => (
          <div
            key={idx}
            className={`worked-step ${idx < visibleSteps ? 'visible' : 'hidden'}`}
          >
            <div className="step-number">{idx + 1}</div>
            <div className="step-body">
              <div className="step-label" dangerouslySetInnerHTML={{
                __html: step.label.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  .replace(/`(.+?)`/g, '<code>$1</code>')
              }} />
              <div className="step-content" dangerouslySetInnerHTML={{
                __html: step.content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  .replace(/`(.+?)`/g, '<code>$1</code>')
                  .replace(/\n/g, '<br/>')
              }} />
            </div>
          </div>
        ))}
      </div>
      {!allVisible ? (
        <button className="btn btn-step" onClick={() => setVisibleSteps(v => v + 1)}>
          Next Step <ChevronRight size={16} />
        </button>
      ) : (
        <button className="btn btn-step done" onClick={onDone}>
          <CheckCircle size={16} /> Got it!
        </button>
      )}
    </div>
  );
}
