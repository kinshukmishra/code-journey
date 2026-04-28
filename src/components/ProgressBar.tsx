import { Star, Flame } from 'lucide-react';

interface ProgressBarProps {
  totalStars: number;
  streak: number;
  completedCount: number;
  totalCount: number;
}

export default function ProgressBar({ totalStars, streak, completedCount, totalCount }: ProgressBarProps) {
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="progress-bar-container">
      <div className="progress-stats">
        <div className="stat">
          <Star size={16} fill="#f59e0b" stroke="#f59e0b" />
          <span>{totalStars}</span>
        </div>
        {streak >= 3 && (
          <div className="stat streak">
            <Flame size={16} />
            <span>{streak} streak!</span>
          </div>
        )}
        <div className="stat">
          <span>{completedCount}/{totalCount} challenges</span>
        </div>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
