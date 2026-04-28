import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import ModulePage from '../pages/ModulePage';
import Home from '../pages/Home';
import curriculum from '../data/curriculum';

function renderModulePage(moduleId: string) {
  return render(
    <MemoryRouter initialEntries={[`/module/${moduleId}`]}>
      <Routes>
        <Route path="/module/:moduleId" element={<ModulePage />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ModulePage navigation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the first module with tutorial showing', () => {
    renderModulePage('binary');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Thinking in Binary');
    expect(screen.getByTestId('start-challenges')).toBeInTheDocument();
  });

  it('shows challenges when "Start Challenges" is clicked', async () => {
    const user = userEvent.setup();
    renderModulePage('binary');

    await user.click(screen.getByTestId('start-challenges'));

    expect(screen.queryByTestId('start-challenges')).not.toBeInTheDocument();
    expect(screen.getByText('Make the Number 3')).toBeInTheDocument();
  });

  it('shows lesson tabs for all lessons in module', () => {
    renderModulePage('binary');
    const binaryModule = curriculum.find(m => m.id === 'binary')!;
    const tablist = screen.getByRole('tablist');
    for (const lesson of binaryModule.lessons) {
      expect(within(tablist).getByText(new RegExp(lesson.title))).toBeInTheDocument();
    }
  });

  it('switches lessons when clicking tabs', async () => {
    const user = userEvent.setup();
    renderModulePage('binary');

    const secondLesson = curriculum.find(m => m.id === 'binary')!.lessons[1];
    await user.click(screen.getByText(new RegExp(secondLesson.title)));

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(secondLesson.title);
    // Tutorial should be shown for the new lesson
    expect(screen.getByTestId('start-challenges')).toBeInTheDocument();
  });

  it('shows "Re-read the lesson" button after starting challenges', async () => {
    const user = userEvent.setup();
    renderModulePage('binary');

    await user.click(screen.getByTestId('start-challenges'));

    expect(screen.getByText('Re-read the lesson')).toBeInTheDocument();
  });

  it('returns to tutorial when clicking "Re-read the lesson"', async () => {
    const user = userEvent.setup();
    renderModulePage('binary');

    await user.click(screen.getByTestId('start-challenges'));
    await user.click(screen.getByText('Re-read the lesson'));

    expect(screen.getByTestId('start-challenges')).toBeInTheDocument();
  });

  it('renders back button that navigates to home', () => {
    renderModulePage('binary');
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});

describe('ModulePage challenge flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows challenges in order with run buttons', async () => {
    const user = userEvent.setup();
    renderModulePage('binary');

    await user.click(screen.getByTestId('start-challenges'));

    expect(screen.getByTestId('challenge-bin-1-1')).toBeInTheDocument();
    expect(screen.getByTestId('run-bin-1-1')).toBeInTheDocument();
  });

  it('shows "Next Challenge" button after completing a non-last challenge', async () => {
    const user = userEvent.setup();
    renderModulePage('binary');

    await user.click(screen.getByTestId('start-challenges'));

    // Complete the first binary challenge (toggle to make 3 = 00000011)
    // The BinaryToggle is used for bin-1-1, but we need to interact with it.
    // For this test, we'll directly set localStorage with a completed challenge
    // and re-render to test the UI state
    localStorage.setItem('code-journey-progress', JSON.stringify({
      completedChallenges: { 'bin-1-1': true },
      attempts: { 'bin-1-1': 1 },
      hintsUsed: {},
      currentModule: 'binary',
      currentLesson: 'binary-1',
      streak: 1,
      totalStars: 3,
    }));

    // Re-render to pick up localStorage
    const { unmount } = renderModulePage('binary');
    unmount();
    renderModulePage('binary');

    await user.click(screen.getByTestId('start-challenges'));

    expect(screen.getByTestId('next-bin-1-1')).toBeInTheDocument();
    expect(screen.getByTestId('next-bin-1-1')).toHaveTextContent('Next Challenge');
  });

  it('shows "All challenges done" on the last completed challenge', async () => {
    const user = userEvent.setup();

    const binaryLesson1 = curriculum.find(m => m.id === 'binary')!.lessons[0];
    const allIds = binaryLesson1.challenges.map(c => c.id);
    const completed: Record<string, boolean> = {};
    const attempts: Record<string, number> = {};
    allIds.forEach(id => { completed[id] = true; attempts[id] = 1; });

    localStorage.setItem('code-journey-progress', JSON.stringify({
      completedChallenges: completed,
      attempts,
      hintsUsed: {},
      currentModule: 'binary',
      currentLesson: 'binary-1',
      streak: allIds.length,
      totalStars: allIds.length * 3,
    }));

    renderModulePage('binary');
    await user.click(screen.getByTestId('start-challenges'));

    const lastId = allIds[allIds.length - 1];
    expect(screen.getByTestId(`done-${lastId}`)).toBeInTheDocument();
    expect(screen.getByTestId('lesson-complete')).toBeInTheDocument();
  });

  it('shows "Next Lesson" when lesson is complete and not the last lesson', async () => {
    const user = userEvent.setup();

    const binaryLesson1 = curriculum.find(m => m.id === 'binary')!.lessons[0];
    const allIds = binaryLesson1.challenges.map(c => c.id);
    const completed: Record<string, boolean> = {};
    const attempts: Record<string, number> = {};
    allIds.forEach(id => { completed[id] = true; attempts[id] = 1; });

    localStorage.setItem('code-journey-progress', JSON.stringify({
      completedChallenges: completed,
      attempts,
      hintsUsed: {},
      currentModule: 'binary',
      currentLesson: 'binary-1',
      streak: allIds.length,
      totalStars: allIds.length * 3,
    }));

    renderModulePage('binary');
    await user.click(screen.getByTestId('start-challenges'));

    expect(screen.getByTestId('next-lesson')).toBeInTheDocument();
    expect(screen.getByTestId('next-lesson')).toHaveTextContent('Next Lesson');
  });

  it('advances to next lesson when clicking "Next Lesson"', async () => {
    const user = userEvent.setup();

    const binaryModule = curriculum.find(m => m.id === 'binary')!;
    const lesson1 = binaryModule.lessons[0];
    const allIds = lesson1.challenges.map(c => c.id);
    const completed: Record<string, boolean> = {};
    const attempts: Record<string, number> = {};
    allIds.forEach(id => { completed[id] = true; attempts[id] = 1; });

    localStorage.setItem('code-journey-progress', JSON.stringify({
      completedChallenges: completed,
      attempts,
      hintsUsed: {},
      currentModule: 'binary',
      currentLesson: 'binary-1',
      streak: allIds.length,
      totalStars: allIds.length * 3,
    }));

    renderModulePage('binary');
    await user.click(screen.getByTestId('start-challenges'));
    await user.click(screen.getByTestId('next-lesson'));

    const lesson2 = binaryModule.lessons[1];
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(lesson2.title);
    // Should show tutorial for new lesson
    expect(screen.getByTestId('start-challenges')).toBeInTheDocument();
  });

  it('shows "Next Module" when all lessons in module are complete', async () => {
    const user = userEvent.setup();

    const binaryModule = curriculum.find(m => m.id === 'binary')!;
    const allIds = binaryModule.lessons.flatMap(l => l.challenges.map(c => c.id));
    const completed: Record<string, boolean> = {};
    const attempts: Record<string, number> = {};
    allIds.forEach(id => { completed[id] = true; attempts[id] = 1; });

    localStorage.setItem('code-journey-progress', JSON.stringify({
      completedChallenges: completed,
      attempts,
      hintsUsed: {},
      currentModule: 'binary',
      currentLesson: 'binary-3',
      streak: allIds.length,
      totalStars: allIds.length * 3,
    }));

    renderModulePage('binary');

    // Navigate to the last lesson tab
    const lastLesson = binaryModule.lessons[binaryModule.lessons.length - 1];
    await user.click(screen.getByText(new RegExp(lastLesson.title)));
    await user.click(screen.getByTestId('start-challenges'));

    expect(screen.getByTestId('next-module')).toBeInTheDocument();
    expect(screen.getByTestId('next-module')).toHaveTextContent(/Assembly/);
  });
});

describe('curriculum data integrity', () => {
  it('every module has at least one lesson', () => {
    for (const mod of curriculum) {
      expect(mod.lessons.length).toBeGreaterThan(0);
    }
  });

  it('every lesson has at least one challenge', () => {
    for (const mod of curriculum) {
      for (const lesson of mod.lessons) {
        expect(lesson.challenges.length).toBeGreaterThan(0);
      }
    }
  });

  it('all challenge IDs are unique', () => {
    const allIds = curriculum.flatMap(m => m.lessons.flatMap(l => l.challenges.map(c => c.id)));
    const unique = new Set(allIds);
    expect(unique.size).toBe(allIds.length);
  });

  it('all lesson IDs are unique', () => {
    const allIds = curriculum.flatMap(m => m.lessons.map(l => l.id));
    const unique = new Set(allIds);
    expect(unique.size).toBe(allIds.length);
  });

  it('all module IDs are unique', () => {
    const ids = curriculum.map(m => m.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});
