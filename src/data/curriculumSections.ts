import type { WorkedExample } from '../components/visuals/WorkedExampleCard';
import type { CodeComparison } from '../components/visuals/CodeCompare';
import type { TransitionData } from '../components/visuals/TransitionBridge';

export type TutorialSection =
  | { type: 'text'; content: string }
  | { type: 'visual'; visual: { component: string; props: Record<string, unknown>; caption?: string } }
  | { type: 'worked-example'; example: WorkedExample }
  | { type: 'comparison'; comparison: CodeComparison }
  | { type: 'transition'; transition: TransitionData };

const sections: Record<string, TutorialSection[]> = {

  // ── BINARY MODULE ─────────────────────────────
  'binary-1': [
    { type: 'text', content: 'Early computers were rows of switches. Each switch is **ON** (1) or **OFF** (0). That\'s a **bit**. Eight bits make a **byte**.' },
    { type: 'visual', visual: { component: 'BinaryExplorer', props: { mode: 'explore' }, caption: 'Click the switches! Watch the number change.' } },
    { type: 'text', content: 'Each position doubles in value as you go left: **1, 2, 4, 8, 16, 32, 64, 128**. To make a number, turn on switches that add up to it.' },
    { type: 'visual', visual: { component: 'BinaryExplorer', props: { mode: 'guided', target: 5 }, caption: 'Try making the number 5. Which two switches add up to 5?' } },
    { type: 'worked-example', example: {
      title: 'Example: Making the number 10',
      steps: [
        { label: 'Which switches add up to 10?', content: '8 + 2 = 10' },
        { label: 'Turn on the 8-switch', content: '00001000' },
        { label: 'Turn on the 2-switch too', content: '00001010' },
        { label: 'Result:', content: '00001010 = 10 in decimal' },
      ],
    } },
  ],

  'binary-2': [
    { type: 'text', content: 'Computers store **letters as numbers** too! A code called **ASCII** gives every character a number.' },
    { type: 'visual', visual: { component: 'AsciiTable', props: {}, caption: 'Click any letter to see its number and binary code.' } },
    { type: 'worked-example', example: {
      title: 'Example: Encoding "Hi" in binary',
      steps: [
        { label: 'Look up H', content: 'H = 72' },
        { label: 'Convert 72 to binary', content: '01001000 (64 + 8 = 72)' },
        { label: 'Look up i', content: 'i = 105' },
        { label: 'Convert 105 to binary', content: '01101001 (64 + 32 + 8 + 1 = 105)' },
        { label: 'Result:', content: '"Hi" = 01001000 01101001' },
      ],
    } },
    { type: 'text', content: 'Every text message, email, and story on a computer is just patterns of **1s and 0s**!' },
  ],

  'binary-3': [
    { type: 'text', content: 'Computers add in binary with just four rules: **0+0=0, 0+1=1, 1+0=1, 1+1=10** (carry the 1!)' },
    { type: 'visual', visual: { component: 'BinaryAdder', props: { a: '0011', b: '0001' }, caption: 'Click "Start Adding" to watch addition happen column by column.' } },
    { type: 'worked-example', example: {
      title: 'Example: Adding 3 + 3 in binary',
      steps: [
        { label: 'Write the numbers', content: '0011 + 0011' },
        { label: 'Rightmost: 1+1 = 10', content: 'Write 0, carry 1' },
        { label: 'Next: 1+1+carry = 11', content: 'Write 1, carry 1' },
        { label: 'Next: 0+0+carry = 1', content: 'Write 1, no carry' },
        { label: 'Leftmost: 0+0 = 0', content: 'Write 0' },
        { label: 'Result:', content: '0011 + 0011 = 0110 (3 + 3 = 6)' },
      ],
    } },
  ],

  // ── ASSEMBLY MODULE ───────────────────────────
  'asm-1': [
    { type: 'transition', transition: {
      fromEra: 'Binary',
      toEra: 'Assembly',
      insight: 'Writing pages of 1s and 0s was miserable. Programmers invented short codes for each instruction.',
      beforeCode: '10110000 00000101\n00000100 00000011\n11100100 00000000',
      afterCode: 'MOV A, 5\nADD A, 3\nOUT A',
      beforeLabel: 'Raw Binary (1940s)',
      afterLabel: 'Assembly Language (1950s)',
    } },
    { type: 'text', content: 'Your computer has tiny boxes called **registers** (A, B, C, D) that hold numbers. Assembly instructions move numbers into boxes and do math with them.' },
    { type: 'visual', visual: { component: 'RegisterSimulator', props: { code: 'MOV A, 5\nMOV B, 3\nADD A, B\nOUT A' }, caption: 'Click "Start" to watch each instruction run. See how register values change.' } },
    { type: 'worked-example', example: {
      title: 'Example: Adding two numbers',
      steps: [
        { label: '`MOV A, 5`', content: 'Put 5 in box A. A is now **5**.' },
        { label: '`MOV B, 3`', content: 'Put 3 in box B. B is now **3**.' },
        { label: '`ADD A, B`', content: 'Add B to A. A becomes **5 + 3 = 8**.' },
        { label: '`OUT A`', content: 'Display what\'s in A. Output: **8**' },
      ],
    } },
  ],

  'asm-2': [
    { type: 'text', content: 'Programs need to make choices: "if this, do that." Assembly uses **CMP** (compare) and **JMP** (jump) to decide.' },
    { type: 'visual', visual: { component: 'RegisterSimulator', props: { code: 'MOV A, 5\nloop:\nOUT A\nSUB A, 1\nCMP A, 0\nJGT loop' }, caption: 'Watch a countdown loop: output A, subtract 1, jump back if A > 0.' } },
    { type: 'worked-example', example: {
      title: 'How the countdown works',
      steps: [
        { label: '`MOV A, 5`', content: 'Start with A = **5**' },
        { label: '`OUT A`', content: 'Display **5**' },
        { label: '`SUB A, 1`', content: 'Subtract 1. A = **4**' },
        { label: '`CMP A, 0` then `JGT loop`', content: '4 > 0? **Yes!** Jump back to loop.' },
        { label: 'Repeat...', content: 'Outputs **4**, then **3**, then **2**, then **1**. When A hits 0, the loop stops.' },
      ],
    } },
    { type: 'text', content: 'A **label** (like `loop:`) marks a spot in code. `JGT` means "jump if greater than." This is how early computers repeated tasks.' },
  ],

  // ── BASIC MODULE ──────────────────────────────
  'basic-1': [
    { type: 'transition', transition: {
      fromEra: 'Assembly',
      toEra: 'High-Level Languages',
      insight: 'Assembly was powerful but painful to read. What if you could write code that reads like English?',
      beforeCode: 'MOV A, 5\nMOV B, 3\nADD A, B\nOUT A',
      afterCode: '10 LET x = 5 + 3\n20 PRINT x',
      beforeLabel: 'Assembly (1950s)',
      afterLabel: 'BASIC (1964)',
    } },
    { type: 'visual', visual: { component: 'CodeEvolution', props: { stages: [
      { era: 'Binary', code: '01001000 01100101 01101100...' },
      { era: 'Assembly', code: 'MOV A, 72\nOUT A\nMOV A, 101\nOUT A\n...' },
      { era: 'BASIC', code: '10 PRINT "Hello, World!"' },
    ] }, caption: 'The same program across three eras. Click the arrows to compare.' } },
    { type: 'text', content: 'In BASIC, each line has a **number** and a **command**. **PRINT** shows text. **LET** makes a variable. **FOR/NEXT** repeats.' },
    { type: 'worked-example', example: {
      title: 'Example: Variables in BASIC',
      steps: [
        { label: '`10 LET age = 11`', content: 'Create a box called **age**, put **11** inside.' },
        { label: '`20 PRINT "I am " + age`', content: 'Glue "I am " and 11 together. Output: **I am 11**' },
      ],
    } },
  ],

  'basic-2': [
    { type: 'text', content: 'Instead of CMP and JMP, BASIC uses **IF/THEN**. It reads like English!' },
    { type: 'comparison', comparison: {
      left: { label: 'Assembly: Is A > B?', code: 'MOV A, 85\nCMP A, 60\nJGT pass\nOUT 0\nJMP done\npass:\nOUT 1\ndone:' },
      right: { label: 'BASIC: Is score passing?', code: '10 LET score = 85\n20 IF score >= 60 THEN PRINT "PASS"\n30 IF score < 60 THEN PRINT "FAIL"' },
      note: 'Same logic, but BASIC is much easier to read!',
    } },
    { type: 'worked-example', example: {
      title: 'Example: Summing 1 to 10',
      steps: [
        { label: '`10 LET sum = 0`', content: 'Start with sum = 0' },
        { label: '`20 FOR i = 1 TO 10`', content: 'Loop: i goes from 1 to 10' },
        { label: '`30 LET sum = sum + i`', content: 'Each time: add i to sum. After i=1: sum=1. After i=2: sum=3...' },
        { label: '`40 NEXT i`', content: 'Go back to the FOR line with next i' },
        { label: '`50 PRINT sum`', content: 'Output: **55**' },
      ],
    } },
  ],

  // ── MODERN PYTHON MODULE ──────────────────────
  'modern-1': [
    { type: 'transition', transition: {
      fromEra: 'BASIC',
      toEra: 'Modern Languages',
      insight: 'BASIC was great for beginners, but real programs needed more power and cleaner syntax.',
      beforeCode: '10 LET sum = 0\n20 FOR i = 1 TO 5\n30 LET sum = sum + i\n40 NEXT i\n50 PRINT sum',
      afterCode: 'total = sum([1, 2, 3, 4, 5])\nprint(total)',
      beforeLabel: 'BASIC (1964)',
      afterLabel: 'Python (1991)',
    } },
    { type: 'text', content: '**Python** is designed to be readable. No line numbers, no LET, no GOTO. Just write what you mean.' },
    { type: 'visual', visual: { component: 'CodeEvolution', props: { stages: [
      { era: 'Assembly', code: 'MOV A, 7\nADD A, 7\nOUT A' },
      { era: 'BASIC', code: '10 LET x = 7 * 2\n20 PRINT x' },
      { era: 'Python', code: 'print(7 * 2)' },
    ] }, caption: 'Each era gets simpler. Python: one line!' } },
    { type: 'worked-example', example: {
      title: 'Example: Functions are reusable recipes',
      steps: [
        { label: '`def double(n):`', content: 'Define a recipe called **double** that takes a number **n**' },
        { label: '`    return n * 2`', content: 'The recipe multiplies n by 2 and gives back the result' },
        { label: '`print(double(7))`', content: 'Call the recipe with 7. It returns 14. Output: **14**' },
      ],
    } },
  ],

  'modern-2': [
    { type: 'text', content: 'The real power of modern programming is **breaking big problems into small pieces**. Each piece is a **function**.' },
    { type: 'worked-example', example: {
      title: 'Example: Temperature converter',
      steps: [
        { label: '`def to_celsius(f):`', content: 'Define a function that converts Fahrenheit to Celsius' },
        { label: '`    return (f - 32) * 5 / 9`', content: 'The formula: subtract 32, multiply by 5, divide by 9' },
        { label: '`print(to_celsius(212))`', content: '(212 - 32) * 5 / 9 = **100.0** (boiling point!)' },
      ],
    } },
    { type: 'comparison', comparison: {
      left: { label: 'One big block', code: 'x = 212\nx = x - 32\nx = x * 5\nx = x / 9\nprint(x)' },
      right: { label: 'With a function', code: 'def to_celsius(f):\n    return (f - 32) * 5 / 9\n\nprint(to_celsius(212))\nprint(to_celsius(32))\nprint(to_celsius(72))' },
      note: 'Functions let you reuse code. Write once, call many times!',
    } },
  ],

  // ── SPEC-DRIVEN MODULE ────────────────────────
  'spec-1': [
    { type: 'visual', visual: { component: 'CodeEvolution', props: { stages: [
      { era: 'Binary', code: '01001000 01100101...' },
      { era: 'Assembly', code: 'MOV A, 72\nOUT A' },
      { era: 'BASIC', code: '10 PRINT "Hello"' },
      { era: 'Python', code: 'print("Hello")' },
      { era: 'Spec', code: '## Feature: Greeting\n- Display "Hello"\n- Large bold text\n- Centered on screen' },
    ] }, caption: 'Each era: less HOW, more WHAT. Specs describe what you want.' } },
    { type: 'text', content: 'A **spec** is a detailed description of what you want built. You\'re the **architect**, AI is the construction crew. The better your spec, the better the result.' },
    { type: 'comparison', comparison: {
      left: { label: 'Bad spec', code: 'Make a calculator.' },
      right: { label: 'Good spec', code: '## Calculator\n- Supports +, -, *, /\n- Takes two numbers as input\n- Displays the result\n- Shows error if dividing by zero' },
      note: 'The bad spec leaves everything to guesswork. The good one is clear and complete.',
    } },
  ],

  'spec-2': [
    { type: 'text', content: 'A good spec has: **Purpose** (what and why), **Requirements** (must-haves), **Edge Cases** (what if something goes wrong?), and **Examples**.' },
    { type: 'worked-example', example: {
      title: 'Example: Spec for a word counter',
      steps: [
        { label: 'Purpose', content: 'A tool that counts words in text, for students checking essay length.' },
        { label: 'Requirements', content: '- Accept text input\n- Display word count\n- Handle multiple spaces correctly' },
        { label: 'Edge Cases', content: '- Empty text? Show 0\n- Only spaces? Show 0\n- Very long text? Still works' },
        { label: 'Examples', content: '"Hello World" -> 2\n"" -> 0\n"  hi  there  " -> 2' },
      ],
    } },
    { type: 'text', content: 'Every missing detail in a spec becomes a **guess**. Good architects leave nothing to chance.' },
  ],

  'spec-3': [
    { type: 'text', content: 'The real workflow: **Spec \u2192 Build \u2192 Test \u2192 Refine**. Nobody gets it perfect the first time!' },
    { type: 'worked-example', example: {
      title: 'The iterative cycle',
      steps: [
        { label: 'Write a spec', content: 'Describe what you want in detail' },
        { label: 'AI builds it', content: 'The AI generates code based on your spec' },
        { label: 'You test it', content: 'Try it out. Find what\'s wrong or missing.' },
        { label: 'Update the spec', content: 'Add what you learned. Be more specific.' },
        { label: 'Repeat!', content: 'Each cycle gets closer to perfect. This is how professionals work.' },
      ],
    } },
    { type: 'comparison', comparison: {
      left: { label: 'First attempt spec', code: 'Takes a name and time,\nreturns a greeting.' },
      right: { label: 'After refinement', code: '## Greeting Generator\n- Input: name (string), time (morning/afternoon/evening)\n- Output: "Good [time], [name]!"\n- If name is empty: use "friend"\n- If time is invalid: default to "day"' },
      note: 'The refined spec handles inputs, output format, AND errors.',
    } },
  ],
};

export default sections;
