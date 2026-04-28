import { describe, it, expect } from 'vitest';
import { validateChallenge } from '../utils/validators';

describe('validators', () => {
  describe('binary challenges', () => {
    it('bin-1-1: accepts correct binary for 3', () => {
      const result = validateChallenge('bin-1-1', '00000011');
      expect(result.correct).toBe(true);
    });

    it('bin-1-1: rejects wrong binary', () => {
      const result = validateChallenge('bin-1-1', '00000010');
      expect(result.correct).toBe(false);
      expect(result.message).toContain('2');
    });

    it('bin-1-3: accepts decimal 85', () => {
      const result = validateChallenge('bin-1-3', '85');
      expect(result.correct).toBe(true);
    });

    it('bin-1-3: rejects wrong decimal', () => {
      const result = validateChallenge('bin-1-3', '84');
      expect(result.correct).toBe(false);
    });

    it('bin-2-2: accepts letter B', () => {
      const result = validateChallenge('bin-2-2', 'B');
      expect(result.correct).toBe(true);
    });

    it('bin-2-2: rejects lowercase b', () => {
      const result = validateChallenge('bin-2-2', 'b');
      expect(result.correct).toBe(false);
    });

    it('bin-3-1: accepts binary answer 0011', () => {
      const result = validateChallenge('bin-3-1', '0011');
      expect(result.correct).toBe(true);
    });
  });

  describe('assembly challenges', () => {
    it('asm-1-1: validates MOV and OUT', () => {
      const result = validateChallenge('asm-1-1', '', { output: '42' });
      expect(result.correct).toBe(true);
    });

    it('asm-1-2: validates ADD', () => {
      const result = validateChallenge('asm-1-2', '', { output: '15' });
      expect(result.correct).toBe(true);
    });

    it('asm-2-2: validates countdown loop', () => {
      const result = validateChallenge('asm-2-2', '', { output: '5 4 3 2 1' });
      expect(result.correct).toBe(true);
    });

    it('asm challenges show error messages', () => {
      const result = validateChallenge('asm-1-1', '', { error: 'Unknown instruction' });
      expect(result.correct).toBe(false);
      expect(result.message).toContain('Unknown instruction');
    });
  });

  describe('BASIC challenges', () => {
    it('basic-1-1: validates Hello World', () => {
      const result = validateChallenge('basic-1-1', '', { output: 'Hello, World!' });
      expect(result.correct).toBe(true);
    });

    it('basic-2-2: validates sum of 1-10', () => {
      const result = validateChallenge('basic-2-2', '', { output: '55' });
      expect(result.correct).toBe(true);
    });
  });

  describe('Python challenges', () => {
    it('mod-1-1: validates Hello World', () => {
      const result = validateChallenge('mod-1-1', '', { output: 'Hello, World!' });
      expect(result.correct).toBe(true);
    });

    it('mod-1-2: validates double function', () => {
      const result = validateChallenge('mod-1-2', '', { output: '14' });
      expect(result.correct).toBe(true);
    });

    it('mod-2-1: validates temperature converter', () => {
      const result = validateChallenge('mod-2-1', '', { output: '100.0' });
      expect(result.correct).toBe(true);
    });
  });

  describe('spec challenges', () => {
    it('spec-1-1: accepts B as answer', () => {
      const result = validateChallenge('spec-1-1', 'B');
      expect(result.correct).toBe(true);
    });

    it('spec-1-1: rejects A as answer', () => {
      const result = validateChallenge('spec-1-1', 'A');
      expect(result.correct).toBe(false);
    });

    it('spec-2-2: requires 3+ edge cases', () => {
      const good = validateChallenge('spec-2-2', '- What if empty?\n- What if too long?\n- What if numbers?');
      expect(good.correct).toBe(true);

      const bad = validateChallenge('spec-2-2', '- What if empty?');
      expect(bad.correct).toBe(false);
    });
  });

  it('returns error for unknown challenge', () => {
    const result = validateChallenge('nonexistent', 'test');
    expect(result.correct).toBe(false);
    expect(result.message).toContain('Unknown');
  });
});
