export interface CodeComparison {
  left: { label: string; code: string };
  right: { label: string; code: string };
  note?: string;
}

function isSpecContent(code: string): boolean {
  return /^(##\s|[-*]\s)/m.test(code);
}

function renderSpec(code: string) {
  const lines = code.split('\n');
  return (
    <div className="compare-spec">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('## ')) {
          return <div key={i} className="spec-heading">{trimmed.slice(3)}</div>;
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return <div key={i} className="spec-bullet">{trimmed.slice(2)}</div>;
        }
        if (!trimmed) return <div key={i} className="spec-spacer" />;
        return <div key={i} className="spec-line">{trimmed}</div>;
      })}
    </div>
  );
}

export default function CodeCompare({ comparison }: { comparison: CodeComparison }) {
  const leftIsSpec = isSpecContent(comparison.left.code);
  const rightIsSpec = isSpecContent(comparison.right.code);

  return (
    <div className="code-compare">
      <div className="compare-panel">
        <div className="compare-label">{comparison.left.label}</div>
        {leftIsSpec ? renderSpec(comparison.left.code) : (
          <pre className="compare-code"><code>{comparison.left.code}</code></pre>
        )}
      </div>
      <div className="compare-arrow">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M8 20 H28 M22 14 L28 20 L22 26" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="compare-panel">
        <div className="compare-label">{comparison.right.label}</div>
        {rightIsSpec ? renderSpec(comparison.right.code) : (
          <pre className="compare-code"><code>{comparison.right.code}</code></pre>
        )}
      </div>
      {comparison.note && <div className="compare-note">{comparison.note}</div>}
    </div>
  );
}
