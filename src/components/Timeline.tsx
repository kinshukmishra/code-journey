import type { Module } from '../data/curriculum';
import { CheckCircle, Lock } from 'lucide-react';

interface TimelineProps {
  modules: Module[];
  completedModules: Set<string>;
  unlockedModules: Set<string>;
  currentModule: string;
  onSelect: (moduleId: string) => void;
}

export default function Timeline({ modules, completedModules, unlockedModules, currentModule, onSelect }: TimelineProps) {
  return (
    <div className="timeline">
      <div className="timeline-line" />
      {modules.map((mod, idx) => {
        const isComplete = completedModules.has(mod.id);
        const isUnlocked = unlockedModules.has(mod.id);
        const isCurrent = mod.id === currentModule;

        return (
          <button
            key={mod.id}
            className={`timeline-node ${isCurrent ? 'current' : ''} ${isComplete ? 'complete' : ''} ${!isUnlocked ? 'locked' : ''}`}
            onClick={() => isUnlocked && onSelect(mod.id)}
            disabled={!isUnlocked}
            style={{ '--accent': mod.color } as React.CSSProperties}
          >
            <div className="node-dot">
              {isComplete ? (
                <CheckCircle size={24} />
              ) : !isUnlocked ? (
                <Lock size={18} />
              ) : (
                <span className="node-icon">{mod.icon}</span>
              )}
            </div>
            <div className="node-info">
              <span className="node-year">{mod.yearRange}</span>
              <span className="node-title">{mod.title}</span>
              {idx === 0 && !isComplete && <span className="node-badge">Start Here!</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
