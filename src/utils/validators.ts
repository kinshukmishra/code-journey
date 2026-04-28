interface ValidationResult {
  correct: boolean;
  message: string;
}

interface RunnerOutput {
  output?: string;
  error?: string;
}

type Validator = (input: string, runnerOutput?: RunnerOutput) => ValidationResult;

const validators: Record<string, Validator> = {
  'bin-1-1': (input) => {
    const clean = input.replace(/\s/g, '');
    if (clean.length !== 8 || !/^[01]+$/.test(clean)) return { correct: false, message: 'Type exactly 8 digits using only 0 and 1!' };
    const val = parseInt(clean, 2);
    if (val === 3) return { correct: true, message: 'You got it! 00000011 = 2 + 1 = 3' };
    return { correct: false, message: 'That equals ' + val + '. You need the switches for 2 and 1!' };
  },

  'bin-1-2': (input) => {
    const clean = input.replace(/\s/g, '');
    if (clean.length !== 8 || !/^[01]+$/.test(clean)) return { correct: false, message: 'Type exactly 8 digits using only 0 and 1!' };
    const val = parseInt(clean, 2);
    if (val === 10) return { correct: true, message: 'Perfect! 00001010 = 8 + 2 = 10' };
    return { correct: false, message: 'That equals ' + val + '. Try 8 + 2!' };
  },

  'bin-1-3': (input) => {
    const val = parseInt(input.trim());
    if (val === 85) return { correct: true, message: "Awesome! 64 + 16 + 4 + 1 = 85. You're reading binary like a computer!" };
    if (isNaN(val)) return { correct: false, message: 'Type a regular number (like 42).' };
    return { correct: false, message: 'Not quite — try adding up 64 + 16 + 4 + 1.' };
  },

  'bin-2-1': (input) => {
    const val = parseInt(input.trim());
    if (val === 67) return { correct: true, message: 'Yes! C = 67 in ASCII. Computers see every letter as a number.' };
    if (val === 99) return { correct: false, message: 'Close — 99 is lowercase c. Capital C is 67!' };
    return { correct: false, message: 'A=65, B=66, so C=?' };
  },

  'bin-2-2': (input) => {
    const letter = input.trim();
    if (letter === 'B') return { correct: true, message: 'Correct! 01000010 = 66 = B. You just decoded a binary message!' };
    if (letter === 'b') return { correct: false, message: 'Almost! Lowercase b is 98. This is uppercase B (66).' };
    return { correct: false, message: 'Look up what letter has ASCII code 66. Hint: A=65, so 66=?' };
  },

  'bin-2-3': (input) => {
    const val = parseInt(input.trim());
    if (val === 75) return { correct: true, message: 'K = 75! You now know how computers store text. Every character has a number.' };
    return { correct: false, message: 'Count from A=65. A(65), B(66), C(67)... K is the 11th letter.' };
  },

  'bin-3-1': (input) => {
    const clean = input.replace(/\s/g, '');
    if (clean === '0011') return { correct: true, message: '0010 + 0001 = 0011 (2 + 1 = 3). Binary math!' };
    if (clean === '11') return { correct: true, message: 'Correct! (We usually write it as 0011 with leading zeros, but 11 works!)' };
    if (clean === '3') return { correct: false, message: "That's the right decimal number, but give the answer in binary (using 1s and 0s)!" };
    return { correct: false, message: 'Try adding column by column from right to left: 0+1=1, 1+0=1, 0+0=0, 0+0=0' };
  },

  'bin-3-2': (input) => {
    const clean = input.replace(/\s/g, '');
    if (clean === '0110' || clean === '110') return { correct: true, message: 'Yes! 0011 + 0011 = 0110 (3 + 3 = 6). You handled the carry perfectly!' };
    if (clean === '6') return { correct: false, message: '6 is correct in decimal, but write it in binary!' };
    return { correct: false, message: 'Try: rightmost 1+1=10 (write 0, carry 1), then 1+1+1=11 (write 1, carry 1), then 0+0+1=1. Result: 0110' };
  },

  // Assembly challenges
  'asm-1-1': (_input, runnerOutput) => {
    if (runnerOutput?.error) return { correct: false, message: 'Error: ' + runnerOutput.error };
    if (runnerOutput?.output === '42') return { correct: true, message: 'You stored 42 and displayed it! Registers are like little boxes for numbers.' };
    return { correct: false, message: 'Output was ' + runnerOutput?.output + '. Make sure you MOV the number 42 into A, then OUT A.' };
  },

  'asm-1-2': (_input, runnerOutput) => {
    if (runnerOutput?.error) return { correct: false, message: 'Error: ' + runnerOutput.error };
    if (runnerOutput?.output === '15') return { correct: true, message: 'A = 7 + 8 = 15! ADD takes the value in B and adds it to A.' };
    return { correct: false, message: 'Output was ' + runnerOutput?.output + '. Check that A=7 and B=8.' };
  },

  'asm-1-3': (_input, runnerOutput) => {
    if (runnerOutput?.error) return { correct: false, message: 'Error: ' + runnerOutput.error };
    if (runnerOutput?.output === '60') return { correct: true, message: "You did it! 10 + 20 + 30 = 60. Notice how you reuse registers — that's real assembly thinking!" };
    return { correct: false, message: 'Output was ' + runnerOutput?.output + '. You need to get to 60.' };
  },

  'asm-2-1': (_input, runnerOutput) => {
    if (runnerOutput?.error) return { correct: false, message: 'Error: ' + runnerOutput.error };
    if (runnerOutput?.output === '1') return { correct: true, message: 'A (15) is greater than B (10), so we jump to a_wins and output 1! You just wrote an if-statement in assembly.' };
    return { correct: false, message: 'Output should be 1 since 15 > 10. Got: ' + runnerOutput?.output };
  },

  'asm-2-2': (_input, runnerOutput) => {
    if (runnerOutput?.error) return { correct: false, message: 'Error: ' + runnerOutput.error };
    const out = runnerOutput?.output?.replace(/\s+/g, ' ').trim();
    if (out === '5 4 3 2 1') return { correct: true, message: 'A countdown loop! This is how early computers repeated tasks — jump back to the beginning!' };
    return { correct: false, message: 'Expected "5 4 3 2 1", got "' + out + '"' };
  },

  // BASIC challenges
  'basic-1-1': (_input, runnerOutput) => {
    if (runnerOutput?.error) return { correct: false, message: 'Error: ' + runnerOutput.error };
    if (runnerOutput?.output?.includes('Hello, World!') || runnerOutput?.output?.includes('Hello, World')) return { correct: true, message: "Your first real program! PRINT is like assembly's OUT but so much easier to read." };
    return { correct: false, message: 'Print exactly: Hello, World! — Got: ' + runnerOutput?.output };
  },

  'basic-1-2': (_input, runnerOutput) => {
    if (runnerOutput?.error) return { correct: false, message: 'Error: ' + runnerOutput.error };
    if (runnerOutput?.output?.includes('I am 11') || runnerOutput?.output?.includes('I am  11')) return { correct: true, message: 'Variables are named boxes that hold values. So much nicer than MOV A, 11!' };
    return { correct: false, message: 'Output should contain "I am 11". Got: ' + runnerOutput?.output };
  },

  'basic-1-3': (_input, runnerOutput) => {
    if (runnerOutput?.error) return { correct: false, message: 'Error: ' + runnerOutput.error };
    const nums = runnerOutput?.output?.trim().split(/\s+/).map(Number);
    if (nums && nums.length === 5 && nums[0] === 1 && nums[4] === 5) return { correct: true, message: 'A FOR loop! Remember the assembly countdown? This does the same thing in 3 lines instead of 6.' };
    return { correct: false, message: 'Should print 1 2 3 4 5 on separate lines. Got: ' + runnerOutput?.output };
  },

  'basic-2-1': (_input, runnerOutput) => {
    if (runnerOutput?.error) return { correct: false, message: 'Error: ' + runnerOutput.error };
    if (runnerOutput?.output?.includes('PASS') && !runnerOutput?.output?.includes('FAIL')) return { correct: true, message: '75 >= 60, so PASS! IF/THEN is the BASIC version of CMP + JEQ. Same idea, way easier to write!' };
    return { correct: false, message: 'Should print PASS for score 75. Got: ' + runnerOutput?.output };
  },

  'basic-2-2': (_input, runnerOutput) => {
    if (runnerOutput?.error) return { correct: false, message: 'Error: ' + runnerOutput.error };
    if (runnerOutput?.output?.trim() === '55') return { correct: true, message: 'The sum is 55! A loop with an accumulator variable — this pattern appears in every programming language.' };
    return { correct: false, message: 'Should output 55. Got: ' + runnerOutput?.output };
  },

  // Python challenges
  'mod-1-1': (_input, runnerOutput) => {
    if (runnerOutput?.error) return { correct: false, message: 'Error: ' + runnerOutput.error };
    if (runnerOutput?.output?.includes('Hello, World!')) return { correct: true, message: "One line! Compare this to the binary, assembly, and BASIC versions. Programming languages keep getting simpler!" };
    return { correct: false, message: 'Print exactly: Hello, World! — Got: ' + runnerOutput?.output };
  },

  'mod-1-2': (_input, runnerOutput) => {
    if (runnerOutput?.error) return { correct: false, message: 'Error: ' + runnerOutput.error };
    if (runnerOutput?.output?.trim() === '14') return { correct: true, message: 'Functions are reusable recipes! double(7)=14, double(100)=200. Write once, use forever.' };
    return { correct: false, message: 'Should output 14. Got: ' + runnerOutput?.output };
  },

  'mod-1-3': (_input, runnerOutput) => {
    if (runnerOutput?.error) return { correct: false, message: 'Error: ' + runnerOutput.error };
    if (runnerOutput?.output?.trim() === '15') return { correct: true, message: 'Lists + loops = power! In BASIC this took line numbers and GOTO. Python makes it beautiful.' };
    return { correct: false, message: 'Should output 15. Got: ' + runnerOutput?.output };
  },

  'mod-2-1': (_input, runnerOutput) => {
    if (runnerOutput?.error) return { correct: false, message: 'Error: ' + runnerOutput.error };
    const val = parseFloat(runnerOutput?.output?.trim() || '');
    if (val === 100 || val === 100.0) return { correct: true, message: '212F = 100C (boiling point of water). Functions let you name a formula and reuse it!' };
    return { correct: false, message: 'Should output 100.0. Got: ' + runnerOutput?.output };
  },

  'mod-2-2': (_input, runnerOutput) => {
    if (runnerOutput?.error) return { correct: false, message: 'Error: ' + runnerOutput.error };
    const lines = runnerOutput?.output?.trim().split('\n').map(l => l.trim());
    if (!lines) return { correct: false, message: 'No output!' };
    const expected: string[] = [];
    for (let i = 1; i <= 20; i++) {
      if (i % 15 === 0) expected.push('FizzBuzz');
      else if (i % 3 === 0) expected.push('Fizz');
      else if (i % 5 === 0) expected.push('Buzz');
      else expected.push(String(i));
    }
    if (lines.join(',') === expected.join(',')) return { correct: true, message: 'FizzBuzz complete! This is actually a famous interview question. You just solved it!' };
    return { correct: false, message: 'Not quite right. Check the order: check 15 first, then 3, then 5, then the number itself.' };
  },

  // Spec-driven challenges
  'spec-1-1': (input) => {
    const answer = input.trim().toUpperCase();
    if (answer === 'B') return { correct: true, message: 'B is much better! It tells us exactly what operations, what inputs, what output, and even what happens when something goes wrong (dividing by zero). A good spec leaves no ambiguity.' };
    if (answer === 'A') return { correct: false, message: '"Make a calculator" is too vague! What operations? What happens with errors? The builder would have to guess.' };
    return { correct: false, message: 'Type A or B to choose.' };
  },

  'spec-1-2': (input) => {
    const answer = input.toLowerCase();
    const goodAnswers = ['delete', 'remove', 'limit', 'save', 'persist', 'clear', 'edit', 'order', 'sort', 'empty', 'undo', 'error', 'display', 'show', 'list', 'storage', 'maximum'];
    const found = goodAnswers.some(a => answer.includes(a));
    if (found) return { correct: true, message: "Great thinking! A spec needs to cover the full user experience. What about deleting tasks? Saving them? What if the list is empty? Every detail matters." };
    if (answer.length < 5) return { correct: false, message: 'Write a more complete answer — what feature or behavior is the spec missing?' };
    return { correct: true, message: "Good observation! Thinking about what's missing is one of the most important skills in spec writing. Every unspecified detail becomes a guess." };
  },

  'spec-2-1': (input) => {
    const words = input.trim().split(/\s+/).length;
    if (words < 5) return { correct: false, message: 'Too short! A purpose statement should be at least one full sentence.' };
    const hasWhat = /count|number|how many|tally|total/i.test(input);
    const hasWords = /word|text|sentence|document/i.test(input);
    if (hasWhat && hasWords) return { correct: true, message: 'Excellent purpose statement! It clearly says what the tool does. A developer reading this knows exactly what to build.' };
    if (hasWhat || hasWords) return { correct: true, message: 'Good start! Your purpose covers the basics. Try to mention both WHAT it counts and WHAT it counts in (words in text/documents).' };
    return { correct: true, message: 'That works as a starting point. For an even stronger spec, explicitly mention counting words — be as specific as possible.' };
  },

  'spec-2-2': (input) => {
    const lines = input.split('\n').filter(l => l.trim().length > 0);
    const bullets = lines.filter(l => /^[-*]|what if/i.test(l.trim()));
    if (bullets.length >= 3) return { correct: true, message: 'Thinking about edge cases is a superpower! Professional developers say "what could go wrong?" before writing a single line of code. This is what separates good specs from great ones.' };
    if (bullets.length >= 1) return { correct: false, message: 'Good start! You have ' + bullets.length + ' edge case(s). Try to think of at least 3. What about empty input? Extra spaces? Very long text?' };
    return { correct: false, message: 'Write at least 3 edge cases as bullet points. Start each with "What if..." or use bullet markers (-).' };
  },

  'spec-2-3': (input) => {
    const lower = input.toLowerCase();
    const words = input.trim().split(/\s+/).length;
    if (words < 20) return { correct: false, message: 'Your spec is too short. A good spec needs purpose, requirements, and edge cases. Aim for at least a few sentences!' };
    const hasPurpose = /purpose|goal|about|description|what|guessing game/i.test(lower);
    const hasRequirements = (lower.match(/[-*]|\d\./g) || []).length >= 3;
    const hasEdge = /edge|what if|error|invalid|wrong|empty/i.test(lower);
    if (hasPurpose && hasRequirements && hasEdge) return { correct: true, message: "You just wrote your first real spec! This is exactly how professionals describe software before building it. In the agentic era, this skill is your superpower — you're the architect, and AI is your construction crew!" };
    const missing: string[] = [];
    if (!hasPurpose) missing.push('a clear purpose');
    if (!hasRequirements) missing.push('at least 3 bullet-point requirements');
    if (!hasEdge) missing.push('edge cases (what if something goes wrong?)');
    return { correct: false, message: 'Good effort! Your spec is missing: ' + missing.join(', ') + '.' };
  },

  'spec-3-1': (input) => {
    const lower = input.toLowerCase();
    const words = input.trim().split(/\s+/).length;
    if (words < 15) return { correct: false, message: 'Too brief. What inputs does it take? What does the output look like? What about errors?' };
    const hasInput = /input|name|time|parameter|argument|takes|accept/i.test(lower);
    const hasOutput = /output|return|display|print|format|greeting|good morning|good afternoon/i.test(lower);
    const hasError = /missing|empty|error|invalid|null|none|default|blank/i.test(lower);
    if (hasInput && hasOutput && hasError) return { correct: true, message: "Now THAT's a spec an AI can work with! You defined inputs, outputs, and error handling. This is the #1 skill for the agentic era." };
    const missing: string[] = [];
    if (!hasInput) missing.push('input descriptions');
    if (!hasOutput) missing.push('output format');
    if (!hasError) missing.push('error handling');
    return { correct: false, message: 'Getting there! Still needs: ' + missing.join(', ') + '.' };
  },

  'spec-3-2': (input) => {
    const words = input.trim().split(/\s+/).length;
    if (words < 30) return { correct: false, message: 'Dream bigger! Your spec needs more detail. At least describe what it does, list 5 features, and think about edge cases.' };
    const bullets = (input.match(/[-*]|\d\./g) || []).length;
    if (words >= 50 && bullets >= 5) return { correct: true, message: "CONGRATULATIONS! You've completed the entire journey — from binary switches to writing specs for the future! You now understand how programming evolved AND you can design software like a professional architect. Your dream app spec is ready to be built. The agentic era is yours!" };
    if (words >= 30) return { correct: true, message: "Nice spec! You've got a solid foundation. You've completed the journey from binary to the future of programming! Keep dreaming and speccing — the world needs architects like you!" };
    return { correct: false, message: 'Keep going! Add more features (aim for 5+) and edge cases (aim for 3+).' };
  },
};

export function validateChallenge(challengeId: string, input: string, runnerOutput?: RunnerOutput): ValidationResult {
  const validator = validators[challengeId];
  if (!validator) {
    return { correct: false, message: 'Unknown challenge: ' + challengeId };
  }
  return validator(input, runnerOutput);
}
