import { describe, it, expect } from 'vitest';
import { runAssembly } from '../utils/assemblyRunner';
import { runBasic } from '../utils/basicRunner';
import { runPython } from '../utils/pythonRunner';

describe('assemblyRunner', () => {
  it('handles MOV and OUT', () => {
    const result = runAssembly('MOV A, 42\nOUT A');
    expect(result.output).toBe('42');
    expect(result.registers.A).toBe(42);
  });

  it('handles ADD', () => {
    const result = runAssembly('MOV A, 7\nMOV B, 8\nADD A, B\nOUT A');
    expect(result.output).toBe('15');
  });

  it('handles SUB', () => {
    const result = runAssembly('MOV A, 10\nSUB A, 3\nOUT A');
    expect(result.output).toBe('7');
  });

  it('handles CMP and JGT loop', () => {
    const result = runAssembly('MOV A, 3\nloop:\nOUT A\nSUB A, 1\nCMP A, 0\nJGT loop');
    expect(result.output).toBe('3 2 1');
  });

  it('handles CMP and JEQ', () => {
    const result = runAssembly('MOV A, 5\nMOV B, 5\nCMP A, B\nJEQ eq\nOUT A\nJMP done\neq:\nMOV C, 1\nOUT C\ndone:');
    expect(result.output).toBe('1');
  });

  it('detects infinite loops', () => {
    const result = runAssembly('loop:\nJMP loop');
    expect(result.error).toContain('too long');
  });

  it('reports unknown instructions', () => {
    const result = runAssembly('FOO A, 5');
    expect(result.error).toContain('Unknown');
  });
});

describe('basicRunner', () => {
  it('handles PRINT', () => {
    const result = runBasic('10 PRINT "Hello, World!"');
    expect(result.output).toBe('Hello, World!');
  });

  it('handles LET and variable usage', () => {
    const result = runBasic('10 LET age = 11\n20 PRINT "I am " + age');
    expect(result.output).toContain('I am 11');
  });

  it('handles FOR/NEXT loop', () => {
    const result = runBasic('10 FOR i = 1 TO 3\n20 PRINT i\n30 NEXT i');
    expect(result.output).toBe('1\n2\n3');
  });

  it('handles IF/THEN', () => {
    const result = runBasic('10 LET x = 5\n20 IF x >= 3 THEN PRINT "yes"');
    expect(result.output).toBe('yes');
  });

  it('handles IF/THEN negative case', () => {
    const result = runBasic('10 LET x = 1\n20 IF x >= 3 THEN PRINT "yes"\n30 IF x < 3 THEN PRINT "no"');
    expect(result.output).toBe('no');
  });

  it('handles accumulator loop', () => {
    const result = runBasic('10 LET sum = 0\n20 FOR i = 1 TO 10\n30 LET sum = sum + i\n40 NEXT i\n50 PRINT sum');
    expect(result.output).toBe('55');
  });
});

describe('pythonRunner', () => {
  it('handles print', () => {
    const result = runPython('print("Hello, World!")');
    expect(result.output).toBe('Hello, World!');
  });

  it('handles function definition and call', () => {
    const result = runPython('def double(n):\n    return n * 2\n\nprint(double(7))');
    expect(result.output).toBe('14');
  });

  it('handles list sum loop', () => {
    const result = runPython('numbers = [1, 2, 3, 4, 5]\ntotal = 0\nfor n in numbers:\n    total = total + n\nprint(total)');
    expect(result.output).toBe('15');
  });

  it('handles parenthesized arithmetic', () => {
    const result = runPython('def to_celsius(f):\n    return (f - 32) * 5 / 9\n\nprint(to_celsius(212))');
    expect(result.output).toBe('100');
  });

  it('handles if/elif/else', () => {
    const result = runPython('x = 5\nif x > 10:\n    print("big")\nelif x > 3:\n    print("medium")\nelse:\n    print("small")');
    expect(result.output).toBe('medium');
  });

  it('handles range-based for loop', () => {
    const result = runPython('for i in range(1, 4):\n    print(i)');
    expect(result.output).toBe('1\n2\n3');
  });

  it('handles modulo operator', () => {
    const result = runPython('print(10 % 3)');
    expect(result.output).toBe('1');
  });

  it('handles fizzbuzz pattern', () => {
    const result = runPython('for i in range(1, 6):\n    if i % 3 == 0:\n        print("Fizz")\n    else:\n        print(i)');
    expect(result.output).toBe('1\n2\nFizz\n4\n5');
  });
});
