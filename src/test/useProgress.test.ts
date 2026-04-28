import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProgress } from '../hooks/useProgress';

describe('useProgress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty progress', () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.progress.totalStars).toBe(0);
    expect(result.current.progress.streak).toBe(0);
    expect(result.current.isChallengeComplete('bin-1-1')).toBe(false);
  });

  it('records attempts', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.recordAttempt('bin-1-1');
    });

    expect(result.current.progress.attempts['bin-1-1']).toBe(1);

    act(() => {
      result.current.recordAttempt('bin-1-1');
    });

    expect(result.current.progress.attempts['bin-1-1']).toBe(2);
  });

  it('completes a challenge and awards 3 stars on first attempt', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.recordAttempt('bin-1-1');
    });

    act(() => {
      result.current.completeChallenge('bin-1-1');
    });

    expect(result.current.isChallengeComplete('bin-1-1')).toBe(true);
    expect(result.current.getStarsForChallenge('bin-1-1')).toBe(3);
    expect(result.current.progress.streak).toBe(1);
  });

  it('awards 2 stars on multiple attempts', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.recordAttempt('bin-1-1');
    });

    act(() => {
      result.current.recordAttempt('bin-1-1');
    });

    act(() => {
      result.current.completeChallenge('bin-1-1');
    });

    expect(result.current.getStarsForChallenge('bin-1-1')).toBe(2);
  });

  it('awards 1 star when hint was used', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.useHint('bin-1-1');
    });

    act(() => {
      result.current.recordAttempt('bin-1-1');
    });

    act(() => {
      result.current.completeChallenge('bin-1-1');
    });

    expect(result.current.getStarsForChallenge('bin-1-1')).toBe(1);
  });

  it('does not double-count completing the same challenge', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.recordAttempt('bin-1-1');
      result.current.completeChallenge('bin-1-1');
    });

    const starsAfterFirst = result.current.progress.totalStars;
    const streakAfterFirst = result.current.progress.streak;

    act(() => {
      result.current.completeChallenge('bin-1-1');
    });

    expect(result.current.progress.totalStars).toBe(starsAfterFirst);
    expect(result.current.progress.streak).toBe(streakAfterFirst);
  });

  it('increments streak across challenges', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.recordAttempt('bin-1-1');
      result.current.completeChallenge('bin-1-1');
    });

    act(() => {
      result.current.recordAttempt('bin-1-2');
      result.current.completeChallenge('bin-1-2');
    });

    expect(result.current.progress.streak).toBe(2);
  });

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.recordAttempt('bin-1-1');
      result.current.completeChallenge('bin-1-1');
    });

    const saved = JSON.parse(localStorage.getItem('code-journey-progress')!);
    expect(saved.completedChallenges['bin-1-1']).toBe(true);
  });

  it('restores from localStorage', () => {
    localStorage.setItem('code-journey-progress', JSON.stringify({
      completedChallenges: { 'bin-1-1': true },
      attempts: { 'bin-1-1': 1 },
      hintsUsed: {},
      currentModule: 'binary',
      currentLesson: 'binary-1',
      streak: 1,
      totalStars: 3,
    }));

    const { result } = renderHook(() => useProgress());
    expect(result.current.isChallengeComplete('bin-1-1')).toBe(true);
    expect(result.current.progress.totalStars).toBe(3);
  });

  it('resets progress', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.recordAttempt('bin-1-1');
      result.current.completeChallenge('bin-1-1');
    });

    act(() => {
      result.current.resetProgress();
    });

    expect(result.current.isChallengeComplete('bin-1-1')).toBe(false);
    expect(result.current.progress.totalStars).toBe(0);
    expect(result.current.progress.streak).toBe(0);
  });

  it('updates current location', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.setCurrentLocation('assembly', 'asm-1');
    });

    expect(result.current.progress.currentModule).toBe('assembly');
    expect(result.current.progress.currentLesson).toBe('asm-1');
  });
});
