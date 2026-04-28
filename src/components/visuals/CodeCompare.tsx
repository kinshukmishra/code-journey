export interface CodeComparison {
  left: { label: string; code: string };
  right: { label: string; code: string };
  note?: string;
}

function hasSpecMarkers(code: string): boolean {
  return /^(##\s|[-*]\s)/m.test(code);
}

function renderContent(code: string) {
  if (!hasSpecMarkers(code)) {
    const isShort = code.split('\n').length <= 2 && code.length < 80;
    return (
      <div className={`compare-content ${isShort ? 'compare-content-short' : ''}`}>
        <code>{code}</code>
      </div>
    );
  }

  const lines = code.split('\n');
  return (
    <div className="compare-content compare-content-spec">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('## ')) {
          return <div key={i} className="spec-heading">{trimmed.slice(3)}</div>;
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return <div key={i} className="spec-item"><span className="spec-dot" />{trimmed.slice(2)}</div>;
        }
        if (!trimmed) return <div key={i} className="spec-gap" />;
        return <div key={i}>{trimmed}</div>;
      })}
    </div>
  );
}

export default function CodeCompare({ comparison }: { comparison: CodeComparison }) {
  return (
    <div className="code-compare">
      <div className="compare-panel">
        <div className="compare-label">{comparison.left.label}</div>
        {renderContent(comparison.left.code)}
      </div>
      <div className="compare-divider">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M8 20 H28 M22 14 L28 20 L22 26" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="compare-panel">
        <div className="compare-label">{comparison.right.label}</div>
        {renderContent(comparison.right.code)}
      </div>
      {comparison.note && <div className="compare-note">{comparison.note}</div>}
    </div>
  );
}
