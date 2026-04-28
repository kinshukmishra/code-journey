export interface CodeComparison {
  left: { label: string; code: string };
  right: { label: string; code: string };
  note?: string;
}

function renderContent(code: string) {
  const lines = code.split('\n');
  const hasMarkers = /^(##\s|[-*]\s)/m.test(code);

  if (!hasMarkers) {
    return <div className="compare-plain">{code}</div>;
  }

  return (
    <div className="compare-structured">
      {lines.map((line, i) => {
        const t = line.trim();
        if (t.startsWith('## ')) return <div key={i} className="spec-heading">{t.slice(3)}</div>;
        if (t.startsWith('- ') || t.startsWith('* ')) return <div key={i} className="spec-item"><span className="spec-dot" />{t.slice(2)}</div>;
        if (!t) return <div key={i} className="spec-gap" />;
        return <div key={i}>{t}</div>;
      })}
    </div>
  );
}

export default function CodeCompare({ comparison }: { comparison: CodeComparison }) {
  return (
    <div className="code-compare-card">
      <div className="compare-sides">
        <div className="compare-side compare-side-bad">
          <div className="compare-side-label bad-label">{comparison.left.label}</div>
          {renderContent(comparison.left.code)}
        </div>
        <div className="compare-side compare-side-good">
          <div className="compare-side-label good-label">{comparison.right.label}</div>
          {renderContent(comparison.right.code)}
        </div>
      </div>
      {comparison.note && <div className="compare-note">{comparison.note}</div>}
    </div>
  );
}
