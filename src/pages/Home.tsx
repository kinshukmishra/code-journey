import { useNavigate } from 'react-router-dom';
import curriculum from '../data/curriculum';
import Timeline from '../components/Timeline';
import ProgressBar from '../components/ProgressBar';
import { useProgress } from '../hooks/useProgress';
import { Rocket, RotateCcw } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { progress, resetProgress, isChallengeComplete } = useProgress();

  const allChallenges = curriculum.flatMap(m => m.lessons.flatMap(l => l.challenges));
  const totalCount = allChallenges.length;
  const completedCount = allChallenges.filter(c => isChallengeComplete(c.id)).length;

  const completedModules = new Set<string>();
  const unlockedModules = new Set<string>();
  unlockedModules.add(curriculum[0].id);

  for (let i = 0; i < curriculum.length; i++) {
    const mod = curriculum[i];
    const modChallenges = mod.lessons.flatMap(l => l.challenges);
    const allDone = modChallenges.every(c => isChallengeComplete(c.id));
    if (allDone) {
      completedModules.add(mod.id);
      if (i + 1 < curriculum.length) {
        unlockedModules.add(curriculum[i + 1].id);
      }
    }
    if (modChallenges.some(c => isChallengeComplete(c.id))) {
      unlockedModules.add(mod.id);
    }
  }

  return (
    <div className="home-page">
      <header className="hero">
        <div className="hero-content">
          <h1>
            <Rocket size={36} className="hero-icon" />
            Code Journey
          </h1>
          <p className="hero-subtitle">
            Travel through time and discover how programming evolved — from raw binary to the AI-powered future!
          </p>
          {completedCount === 0 ? (
            <button className="btn btn-hero" onClick={() => navigate('/module/binary')}>
              Begin Your Journey
            </button>
          ) : (
            <button className="btn btn-hero" onClick={() => navigate(`/module/${progress.currentModule}`)}>
              Continue Learning
            </button>
          )}
        </div>
      </header>

      <ProgressBar
        totalStars={progress.totalStars}
        streak={progress.streak}
        completedCount={completedCount}
        totalCount={totalCount}
      />

      <section className="timeline-section">
        <h2>Your Learning Path</h2>
        <Timeline
          modules={curriculum}
          completedModules={completedModules}
          unlockedModules={unlockedModules}
          currentModule={progress.currentModule}
          onSelect={(id) => navigate(`/module/${id}`)}
        />
      </section>

      <section className="modules-grid">
        {curriculum.map((mod) => {
          const isUnlocked = unlockedModules.has(mod.id);
          const isComplete = completedModules.has(mod.id);
          const modChallenges = mod.lessons.flatMap(l => l.challenges);
          const modCompleted = modChallenges.filter(c => isChallengeComplete(c.id)).length;

          return (
            <div
              key={mod.id}
              className={`module-card ${!isUnlocked ? 'locked' : ''} ${isComplete ? 'complete' : ''}`}
              style={{ '--accent': mod.color } as React.CSSProperties}
              onClick={() => isUnlocked && navigate(`/module/${mod.id}`)}
            >
              <div className="module-icon">{mod.icon}</div>
              <div className="module-era">{mod.yearRange}</div>
              <h3>{mod.title}</h3>
              <p>{mod.description}</p>
              <div className="module-progress">
                {modCompleted}/{modChallenges.length} challenges
              </div>
            </div>
          );
        })}
      </section>

      {completedCount > 0 && (
        <div className="reset-section">
          <button
            className="btn btn-reset-all"
            onClick={() => {
              if (window.confirm('Reset all progress? This cannot be undone!')) {
                resetProgress();
              }
            }}
          >
            <RotateCcw size={14} /> Reset All Progress
          </button>
        </div>
      )}
    </div>
  );
}
