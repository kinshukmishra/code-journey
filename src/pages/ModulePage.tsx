import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import curriculum from '../data/curriculum';
import ChallengeCard from '../components/ChallengeCard';
import ProgressBar from '../components/ProgressBar';
import { useProgress } from '../hooks/useProgress';
import { ArrowLeft, ChevronRight, BookOpen } from 'lucide-react';

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const {
    progress,
    completeChallenge,
    recordAttempt,
    useHint,
    setCurrentLocation,
    isChallengeComplete,
    getStarsForChallenge,
  } = useProgress();

  const mod = curriculum.find(m => m.id === moduleId);
  const modIndex = curriculum.findIndex(m => m.id === moduleId);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [showStory, setShowStory] = useState(true);

  useEffect(() => {
    if (mod) {
      setCurrentLocation(mod.id, mod.lessons[0]?.id || '');
    }
  }, [mod, setCurrentLocation]);

  if (!mod) {
    return (
      <div className="not-found">
        <h2>Module not found</h2>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const lesson = mod.lessons[activeLessonIdx];
  const allChallenges = curriculum.flatMap(m => m.lessons.flatMap(l => l.challenges));
  const totalCount = allChallenges.length;
  const completedCount = allChallenges.filter(c => isChallengeComplete(c.id)).length;

  const lessonComplete = lesson.challenges.every(c => isChallengeComplete(c.id));
  const isLastLesson = activeLessonIdx === mod.lessons.length - 1;
  const nextModule = modIndex + 1 < curriculum.length ? curriculum[modIndex + 1] : null;

  const allModuleDone = mod.lessons.every(l => l.challenges.every(c => isChallengeComplete(c.id)));

  return (
    <div className="module-page" style={{ '--accent': mod.color } as React.CSSProperties}>
      <header className="module-header">
        <button className="btn btn-back" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className="module-header-info">
          <span className="module-era-badge">{mod.era} ({mod.yearRange})</span>
          <h1>{mod.icon} {mod.title}</h1>
        </div>
      </header>

      <ProgressBar
        totalStars={progress.totalStars}
        streak={progress.streak}
        completedCount={completedCount}
        totalCount={totalCount}
      />

      <div className="lesson-tabs">
        {mod.lessons.map((l, idx) => {
          const done = l.challenges.every(c => isChallengeComplete(c.id));
          return (
            <button
              key={l.id}
              className={`lesson-tab ${idx === activeLessonIdx ? 'active' : ''} ${done ? 'done' : ''}`}
              onClick={() => { setActiveLessonIdx(idx); setShowStory(true); }}
            >
              {done ? '✓' : idx + 1}. {l.title}
            </button>
          );
        })}
      </div>

      <div className="lesson-content">
        <div className="lesson-header">
          <h2>{lesson.title}</h2>
          <span className="teaches-badge">Teaches: {lesson.teaches}</span>
        </div>

        {showStory ? (
          <div className="story-section">
            <div className="story-content">
              {lesson.story.split('\n\n').map((para, i) => {
                if (para.trim().startsWith('```')) {
                  const code = para.replace(/```\w*\n?/g, '').trim();
                  return <pre key={i} className="story-code"><code>{code}</code></pre>;
                }
                return (
                  <p key={i} dangerouslySetInnerHTML={{
                    __html: para
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      .replace(/`(.+?)`/g, '<code>$1</code>')
                  }} />
                );
              })}
            </div>
            <button className="btn btn-start-challenges" onClick={() => setShowStory(false)}>
              <BookOpen size={16} /> Start Challenges <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <button className="btn btn-show-story" onClick={() => setShowStory(true)}>
              <BookOpen size={16} /> Re-read the lesson
            </button>

            <div className="challenges-list">
              {lesson.challenges.map((challenge, idx) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  isComplete={isChallengeComplete(challenge.id)}
                  stars={getStarsForChallenge(challenge.id)}
                  onComplete={completeChallenge}
                  onAttempt={recordAttempt}
                  onHint={useHint}
                  hintUsed={!!progress.hintsUsed[challenge.id]}
                  isLast={idx === lesson.challenges.length - 1}
                  onNext={() => {
                    const nextChallengeEl = document.querySelector(`.challenge-card:nth-child(${idx + 2})`);
                    nextChallengeEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                />
              ))}
            </div>

            {lessonComplete && (
              <div className="lesson-complete-banner">
                <h3>Lesson Complete!</h3>
                {!isLastLesson ? (
                  <button className="btn btn-next-lesson" onClick={() => { setActiveLessonIdx(activeLessonIdx + 1); setShowStory(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    Next Lesson <ChevronRight size={16} />
                  </button>
                ) : allModuleDone && nextModule ? (
                  <button className="btn btn-next-module" onClick={() => navigate(`/module/${nextModule.id}`)}>
                    {nextModule.icon} Next: {nextModule.title} <ChevronRight size={16} />
                  </button>
                ) : allModuleDone ? (
                  <div className="final-message">
                    <p>You've completed all modules! You're ready for the agentic era!</p>
                    <button className="btn btn-hero" onClick={() => navigate('/')}>
                      View Your Journey
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
