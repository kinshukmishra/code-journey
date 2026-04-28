import { useState, useEffect, useCallback } from 'react';

interface Progress {
  completedChallenges: Record<string, boolean>;
  attempts: Record<string, number>;
  hintsUsed: Record<string, boolean>;
  currentModule: string;
  currentLesson: string;
  streak: number;
  totalStars: number;
}

const STORAGE_KEY = 'code-journey-progress';

const defaultProgress: Progress = {
  completedChallenges: {},
  attempts: {},
  hintsUsed: {},
  currentModule: 'binary',
  currentLesson: 'binary-1',
  streak: 0,
  totalStars: 0,
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...defaultProgress, ...JSON.parse(saved) };
      } catch {
        return defaultProgress;
      }
    }
    return defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeChallenge = useCallback((challengeId: string) => {
    setProgress(prev => {
      if (prev.completedChallenges[challengeId]) return prev;
      return {
        ...prev,
        completedChallenges: { ...prev.completedChallenges, [challengeId]: true },
        streak: prev.streak + 1,
        totalStars: prev.totalStars + (prev.hintsUsed[challengeId] ? 1 : prev.attempts[challengeId] === 1 ? 3 : 2),
      };
    });
  }, []);

  const recordAttempt = useCallback((challengeId: string) => {
    setProgress(prev => ({
      ...prev,
      attempts: { ...prev.attempts, [challengeId]: (prev.attempts[challengeId] || 0) + 1 },
    }));
  }, []);

  const useHint = useCallback((challengeId: string) => {
    setProgress(prev => ({
      ...prev,
      hintsUsed: { ...prev.hintsUsed, [challengeId]: true },
    }));
  }, []);

  const setCurrentLocation = useCallback((moduleId: string, lessonId: string) => {
    setProgress(prev => ({ ...prev, currentModule: moduleId, currentLesson: lessonId }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isChallengeComplete = useCallback((id: string) => !!progress.completedChallenges[id], [progress]);

  const isLessonComplete = useCallback(
    (challengeIds: string[]) => challengeIds.every(id => progress.completedChallenges[id]),
    [progress]
  );

  const getStarsForChallenge = useCallback(
    (id: string) => {
      if (!progress.completedChallenges[id]) return 0;
      if (progress.hintsUsed[id]) return 1;
      if ((progress.attempts[id] || 0) <= 1) return 3;
      return 2;
    },
    [progress]
  );

  return {
    progress,
    completeChallenge,
    recordAttempt,
    useHint,
    setCurrentLocation,
    resetProgress,
    isChallengeComplete,
    isLessonComplete,
    getStarsForChallenge,
  };
}
