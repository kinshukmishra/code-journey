import type { TutorialSection } from '../../data/curriculumSections';
import WorkedExampleCard from './WorkedExampleCard';
import CodeCompare from './CodeCompare';
import TransitionBridge from './TransitionBridge';
import CodeEvolution from './CodeEvolution';
import RegisterSimulator from './RegisterSimulator';
import AsciiTable from './AsciiTable';
import BinaryAdder from './BinaryAdder';
import BinaryToggle from '../BinaryToggle';
import { useState } from 'react';

function BinaryExplorer({ mode, target, caption }: { mode: 'explore' | 'guided'; target?: number; caption?: string }) {
  const [value, setValue] = useState('00000000');
  const decimal = parseInt(value.padStart(8, '0'), 2);
  const matched = mode === 'guided' && target !== undefined && decimal === target;

  return (
    <div className="binary-explorer">
      {mode === 'guided' && target !== undefined && (
        <div className={`explorer-target ${matched ? 'matched' : ''}`}>
          Target: <strong>{target}</strong> {matched && ' \u2714'}
        </div>
      )}
      <BinaryToggle value={value} onChange={setValue} />
      {caption && <div className="visual-caption">{caption}</div>}
    </div>
  );
}

export default function TutorialRenderer({ sections }: { sections: TutorialSection[] }) {
  return (
    <div className="tutorial-sections">
      {sections.map((section, idx) => (
        <div key={idx} className={`tutorial-section section-${section.type}`}>
          {section.type === 'text' && (
            <p className="tutorial-text" dangerouslySetInnerHTML={{
              __html: section.content
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/`(.+?)`/g, '<code>$1</code>')
            }} />
          )}

          {section.type === 'visual' && renderVisual(section.visual)}

          {section.type === 'worked-example' && (
            <WorkedExampleCard example={section.example} />
          )}

          {section.type === 'comparison' && (
            <CodeCompare comparison={section.comparison} />
          )}

          {section.type === 'transition' && (
            <TransitionBridge data={section.transition} />
          )}
        </div>
      ))}
    </div>
  );
}

function renderVisual(visual: { component: string; props: Record<string, unknown>; caption?: string }) {
  const { caption } = visual;

  switch (visual.component) {
    case 'BinaryExplorer':
      return <BinaryExplorer mode={visual.props.mode as 'explore' | 'guided'} target={visual.props.target as number | undefined} caption={caption} />;
    case 'RegisterSimulator':
      return <RegisterSimulator code={visual.props.code as string} caption={caption} />;
    case 'AsciiTable':
      return <AsciiTable caption={caption} />;
    case 'BinaryAdder':
      return <BinaryAdder a={visual.props.a as string} b={visual.props.b as string} caption={caption} />;
    case 'CodeEvolution':
      return <CodeEvolution stages={visual.props.stages as { era: string; code: string }[]} caption={caption} />;
    default:
      return <div className="visual-placeholder">Visual: {visual.component}</div>;
  }
}
