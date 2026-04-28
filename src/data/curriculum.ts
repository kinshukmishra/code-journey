export interface Challenge {
  id: string;
  title: string;
  instruction: string;
  hint?: string;
  starterCode: string;
  expectedOutput?: string;
  validator: string; // function body as string — evaluated at runtime
  type: 'binary' | 'assembly' | 'basic' | 'python' | 'spec';
}

export interface Lesson {
  id: string;
  title: string;
  story: string; // narrative / tutorial content (markdown-ish)
  teaches: string;
  challenges: Challenge[];
}

export interface Module {
  id: string;
  era: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  yearRange: string;
  lessons: Lesson[];
}

const curriculum: Module[] = [
  // ── MODULE 1: THE BINARY ERA ──────────────────────────────
  {
    id: 'binary',
    era: 'The Dawn of Computing',
    title: 'Thinking in Binary',
    description: 'Computers only understand two things: ON and OFF. Learn how everything — numbers, letters, even colors — is built from 1s and 0s.',
    icon: '💡',
    color: '#f59e0b',
    yearRange: '1940s–1950s',
    lessons: [
      {
        id: 'binary-1',
        title: 'Switches & Light Bulbs',
        story: `Imagine you have a row of 8 light switches on a wall. Each switch can be **ON** (1) or **OFF** (0). That's it — just two states!

Early computers were literally built from thousands of these switches. Each switch is called a **bit** (short for "binary digit"). A group of 8 bits is called a **byte**.

Here's the trick: each switch position has a **value** that doubles as you go left:

\`\`\`
Position:  8    7    6    5    4    3    2    1
Value:    128   64   32   16    8    4    2    1
\`\`\`

To make a number, you turn ON the switches whose values add up to your number. For example, to make the number **5**, you'd turn on switches for **4** and **1**:

\`\`\`
0  0  0  0  0  1  0  1  →  4 + 1 = 5
\`\`\``,
        teaches: 'Binary number representation',
        challenges: [
          {
            id: 'bin-1-1',
            title: 'Make the Number 3',
            instruction: 'Type the 8-bit binary representation of the number **3**. Remember: each position doubles! (Hint: 2 + 1 = 3)',
            hint: 'Which two rightmost switches add up to 3?',
            starterCode: '00000000',
            expectedOutput: '3',
            validator: `(input) => {
              const clean = input.replace(/\\s/g, '');
              if (clean.length !== 8 || !/^[01]+$/.test(clean)) return { correct: false, message: 'Type exactly 8 digits using only 0 and 1!' };
              const val = parseInt(clean, 2);
              if (val === 3) return { correct: true, message: 'You got it! 00000011 → 2 + 1 = 3' };
              return { correct: false, message: 'That equals ' + val + '. You need the switches for 2 and 1!' };
            }`,
            type: 'binary',
          },
          {
            id: 'bin-1-2',
            title: 'Make the Number 10',
            instruction: 'Now make the number **10** in binary. Think: which switch values add up to 10?',
            hint: '8 + 2 = 10',
            starterCode: '00000000',
            expectedOutput: '10',
            validator: `(input) => {
              const clean = input.replace(/\\s/g, '');
              if (clean.length !== 8 || !/^[01]+$/.test(clean)) return { correct: false, message: 'Type exactly 8 digits using only 0 and 1!' };
              const val = parseInt(clean, 2);
              if (val === 10) return { correct: true, message: 'Perfect! 00001010 → 8 + 2 = 10' };
              return { correct: false, message: 'That equals ' + val + '. Try 8 + 2!' };
            }`,
            type: 'binary',
          },
          {
            id: 'bin-1-3',
            title: 'Decode This Binary!',
            instruction: 'What decimal number does **01010101** represent? Type the number.',
            hint: 'Add up: 64 + 16 + 4 + 1',
            starterCode: '',
            expectedOutput: '85',
            validator: `(input) => {
              const val = parseInt(input.trim());
              if (val === 85) return { correct: true, message: 'Awesome! 64 + 16 + 4 + 1 = 85. You\\'re reading binary like a computer!' };
              if (isNaN(val)) return { correct: false, message: 'Type a regular number (like 42).' };
              return { correct: false, message: 'Not quite — try adding up 64 + 16 + 4 + 1.' };
            }`,
            type: 'binary',
          },
        ],
      },
      {
        id: 'binary-2',
        title: 'Secret Messages in Binary',
        story: `Computers don't just store numbers — they store **letters** too! But how?

In the 1960s, people agreed on a code called **ASCII** where every letter gets a number:

\`\`\`
A = 65    B = 66    C = 67    ...
a = 97    b = 98    c = 99    ...
0 = 48    1 = 49    Space = 32
\`\`\`

So the letter **A** is stored as the number 65, which in binary is **01000001**.

The word "Hi" becomes:
- H = 72 = **01001000**
- i = 105 = **01101001**

Every text message, every email, every story ever saved on a computer — it's all just numbers, which are all just patterns of 1s and 0s!`,
        teaches: 'ASCII encoding and text as numbers',
        challenges: [
          {
            id: 'bin-2-1',
            title: 'Letter to Number',
            instruction: 'Using the ASCII table, what number represents the letter **C**? (Hint: A=65, B=66, C=?)',
            starterCode: '',
            expectedOutput: '67',
            validator: `(input) => {
              const val = parseInt(input.trim());
              if (val === 67) return { correct: true, message: 'Yes! C = 67 in ASCII. Computers see every letter as a number.' };
              if (val === 99) return { correct: false, message: 'Close — 99 is lowercase c. Capital C is 67!' };
              return { correct: false, message: 'A=65, B=66, so C=?' };
            }`,
            type: 'binary',
          },
          {
            id: 'bin-2-2',
            title: 'Binary to Letter',
            instruction: 'The binary number **01000010** equals 66 in decimal. What letter is that in ASCII?',
            starterCode: '',
            validator: `(input) => {
              const letter = input.trim();
              if (letter === 'B') return { correct: true, message: 'Correct! 01000010 → 66 → B. You just decoded a binary message!' };
              if (letter === 'b') return { correct: false, message: 'Almost! Lowercase b is 98. This is uppercase B (66).' };
              return { correct: false, message: 'Look up what letter has ASCII code 66. Hint: A=65, so 66=?' };
            }`,
            type: 'binary',
          },
          {
            id: 'bin-2-3',
            title: 'Encode Your Initial',
            instruction: 'What is the ASCII number for the letter **K**? (Hint: A=65, count from there!)',
            starterCode: '',
            validator: `(input) => {
              const val = parseInt(input.trim());
              if (val === 75) return { correct: true, message: 'K = 75! You now know how computers store text. Every character has a number.' };
              return { correct: false, message: 'Count from A=65. A(65), B(66), C(67)... K is the 11th letter.' };
            }`,
            type: 'binary',
          },
        ],
      },
      {
        id: 'binary-3',
        title: 'Binary Math',
        story: `Computers do math with binary just like we do with regular numbers — but simpler! There are only 4 rules for binary addition:

\`\`\`
0 + 0 = 0
0 + 1 = 1
1 + 0 = 1
1 + 1 = 10  (that's 0, carry the 1!)
\`\`\`

It's like regular addition but you "carry" at 2 instead of 10!

Example: **0011 + 0001** (that's 3 + 1):
\`\`\`
  0011
+ 0001
------
  0100  → that's 4!
\`\`\`

This is literally what a computer's processor does billions of times per second!`,
        teaches: 'Binary addition',
        challenges: [
          {
            id: 'bin-3-1',
            title: 'Add in Binary',
            instruction: 'What is **0010 + 0001** in binary? (That\'s 2 + 1) Give your answer as 4 binary digits.',
            starterCode: '',
            validator: `(input) => {
              const clean = input.replace(/\\s/g, '');
              if (clean === '0011') return { correct: true, message: '0010 + 0001 = 0011 (2 + 1 = 3). Binary math!' };
              if (clean === '11') return { correct: true, message: 'Correct! (We usually write it as 0011 with leading zeros, but 11 works!)' };
              if (clean === '3') return { correct: false, message: 'That\\'s the right decimal number, but give the answer in binary (using 1s and 0s)!' };
              return { correct: false, message: 'Try adding column by column from right to left: 0+1=1, 1+0=1, 0+0=0, 0+0=0' };
            }`,
            type: 'binary',
          },
          {
            id: 'bin-3-2',
            title: 'Carry the One!',
            instruction: 'What is **0011 + 0011** in binary? (3 + 3) This one requires carrying! Give 4 binary digits.',
            hint: 'Right column: 1+1=10, write 0 carry 1. Next column: 1+1+1(carry)=11, write 1 carry 1...',
            starterCode: '',
            validator: `(input) => {
              const clean = input.replace(/\\s/g, '');
              if (clean === '0110' || clean === '110') return { correct: true, message: 'Yes! 0011 + 0011 = 0110 (3 + 3 = 6). You handled the carry perfectly!' };
              if (clean === '6') return { correct: false, message: '6 is correct in decimal, but write it in binary!' };
              return { correct: false, message: 'Try: rightmost 1+1=10 (write 0, carry 1), then 1+1+1=11 (write 1, carry 1), then 0+0+1=1. Result: 0110' };
            }`,
            type: 'binary',
          },
        ],
      },
    ],
  },

  // ── MODULE 2: ASSEMBLY LANGUAGE ────────────────────────────
  {
    id: 'assembly',
    era: 'Talking to the Machine',
    title: 'Assembly Language',
    description: 'Instead of raw binary, early programmers invented short codes — "mnemonics" — to represent instructions. Meet assembly language!',
    icon: '⚙️',
    color: '#8b5cf6',
    yearRange: '1950s–1960s',
    lessons: [
      {
        id: 'asm-1',
        title: 'Your First Instructions',
        story: `Writing programs in pure binary was **awful**. Imagine writing a whole page of just 1s and 0s!

So programmers invented **assembly language** — short English-like codes for each machine instruction:

\`\`\`
MOV A, 5      → Put the number 5 into box A
MOV B, 3      → Put the number 3 into box B
ADD A, B      → Add B to A (A now holds 8)
\`\`\`

Think of it like this: your computer has little **boxes** (called registers) that can each hold one number. Assembly instructions tell the computer to put numbers in boxes and do math with them.

A program called an **assembler** translates these codes into the binary that the computer actually understands.

In this simulator, you have 4 boxes: **A**, **B**, **C**, and **D**, plus a special **OUT** command to display results.`,
        teaches: 'Registers, MOV, ADD, and basic instructions',
        challenges: [
          {
            id: 'asm-1-1',
            title: 'Store a Number',
            instruction: 'Write assembly to put the number **42** into register A, then output it. Use MOV and OUT.',
            hint: 'You need two lines: MOV A, 42 and then OUT A',
            starterCode: 'MOV A, ?\nOUT A',
            validator: `(input, run) => {
              const result = run(input);
              if (result.output === '42') return { correct: true, message: 'You stored 42 and displayed it! Registers are like little boxes for numbers.' };
              if (result.error) return { correct: false, message: 'Error: ' + result.error };
              return { correct: false, message: 'Output was ' + result.output + '. Make sure you MOV the number 42 into A, then OUT A.' };
            }`,
            type: 'assembly',
          },
          {
            id: 'asm-1-2',
            title: 'Add Two Numbers',
            instruction: 'Put **7** in register A and **8** in register B, add them together, and output the result.',
            hint: 'MOV A, 7 → MOV B, 8 → ADD A, B → OUT A',
            starterCode: 'MOV A, ?\nMOV B, ?\nADD A, B\nOUT A',
            validator: `(input, run) => {
              const result = run(input);
              if (result.output === '15') return { correct: true, message: 'A = 7 + 8 = 15! ADD takes the value in B and adds it to A.' };
              if (result.error) return { correct: false, message: 'Error: ' + result.error };
              return { correct: false, message: 'Output was ' + result.output + '. Check that A=7 and B=8.' };
            }`,
            type: 'assembly',
          },
          {
            id: 'asm-1-3',
            title: 'Three-Number Sum',
            instruction: 'Calculate **10 + 20 + 30** using registers and output the result (60).',
            hint: 'Put 10 in A, 20 in B, add B to A. Then put 30 in B, add B to A again.',
            starterCode: '',
            validator: `(input, run) => {
              const result = run(input);
              if (result.output === '60') return { correct: true, message: 'You did it! 10 + 20 + 30 = 60. Notice how you reuse registers — that\\'s real assembly thinking!' };
              if (result.error) return { correct: false, message: 'Error: ' + result.error };
              return { correct: false, message: 'Output was ' + result.output + '. You need to get to 60.' };
            }`,
            type: 'assembly',
          },
        ],
      },
      {
        id: 'asm-2',
        title: 'Making Decisions',
        story: `So far, our programs run every instruction in order. But real programs need to make **decisions**!

Assembly has a **CMP** (compare) instruction and **JMP** (jump) instructions:

\`\`\`
CMP A, B     → Compare A and B
JEQ label    → Jump to label if they were Equal
JGT label    → Jump to label if A was Greater Than B
JLT label    → Jump to label if A was Less Than B
JMP label    → Always jump to label
\`\`\`

A **label** is just a name followed by a colon that marks a spot in your code:

\`\`\`
MOV A, 5
MOV B, 5
CMP A, B
JEQ same
OUT A
JMP done
same:
  MOV C, 1
  OUT C
done:
\`\`\`

This is like saying "if A equals B, go to the 'same' section."`,
        teaches: 'Comparisons, jumps, and control flow',
        challenges: [
          {
            id: 'asm-2-1',
            title: 'The Bigger Number',
            instruction: 'Compare **15** and **10**. If A > B, output **1** (meaning "A wins"). If not, output **0**.',
            hint: 'CMP A, B then JGT to a label where you output 1',
            starterCode: 'MOV A, 15\nMOV B, 10\nCMP A, B\nJGT a_wins\nMOV C, 0\nOUT C\nJMP done\na_wins:\nMOV C, 1\nOUT C\ndone:',
            validator: `(input, run) => {
              const result = run(input);
              if (result.output === '1') return { correct: true, message: 'A (15) is greater than B (10), so we jump to a_wins and output 1! You just wrote an if-statement in assembly.' };
              if (result.error) return { correct: false, message: 'Error: ' + result.error };
              return { correct: false, message: 'Output should be 1 since 15 > 10. Got: ' + result.output };
            }`,
            type: 'assembly',
          },
          {
            id: 'asm-2-2',
            title: 'Countdown!',
            instruction: 'Make a countdown from **5** to **1**! Use a loop: output A, subtract 1, and jump back if A > 0. Expected output: 5 4 3 2 1',
            hint: 'Use a label like "loop:", output A, SUB A 1, CMP A 0, JGT loop',
            starterCode: 'MOV A, 5\nloop:\nOUT A\nSUB A, 1\nCMP A, 0\nJGT loop',
            validator: `(input, run) => {
              const result = run(input);
              const out = result.output?.replace(/\\s+/g, ' ').trim();
              if (out === '5 4 3 2 1') return { correct: true, message: 'A countdown loop! This is how early computers repeated tasks — jump back to the beginning!' };
              if (result.error) return { correct: false, message: 'Error: ' + result.error };
              return { correct: false, message: 'Expected "5 4 3 2 1", got "' + out + '"' };
            }`,
            type: 'assembly',
          },
        ],
      },
    ],
  },

  // ── MODULE 3: HIGH-LEVEL LANGUAGES ────────────────────────
  {
    id: 'basic',
    era: 'The Revolution',
    title: 'High-Level Languages',
    description: 'What if we could write programs in something closer to English? BASIC made programming accessible to everyone!',
    icon: '📺',
    color: '#10b981',
    yearRange: '1960s–1980s',
    lessons: [
      {
        id: 'basic-1',
        title: 'Hello, World!',
        story: `By the 1960s, people were tired of assembly language. It was powerful but painful to write even simple programs.

So computer scientists invented **high-level languages** — programs written in something close to English that a special program called a **compiler** translates into assembly/binary.

**BASIC** (1964) was designed to be easy enough for beginners:

\`\`\`
10 PRINT "Hello, World!"
20 LET name$ = "Ada"
30 PRINT "Welcome, " + name$
\`\`\`

Compared to assembly, this is a dream! No more registers and jumps — you just say what you mean.

Each line starts with a **line number** (10, 20, 30...) and a **command**:
- **PRINT** displays text
- **LET** creates a variable (a named box)
- **INPUT** asks the user to type something
- **IF...THEN** makes decisions
- **FOR...NEXT** repeats things`,
        teaches: 'PRINT, variables, and readable code',
        challenges: [
          {
            id: 'basic-1-1',
            title: 'Your First PRINT',
            instruction: 'Write a BASIC program that prints **Hello, World!**',
            starterCode: '10 PRINT "?"',
            validator: `(input, run) => {
              const result = run(input);
              if (result.output?.includes('Hello, World!') || result.output?.includes('Hello, World')) return { correct: true, message: 'Your first real program! PRINT is like assembly\\'s OUT but so much easier to read.' };
              if (result.error) return { correct: false, message: 'Error: ' + result.error };
              return { correct: false, message: 'Print exactly: Hello, World! — Got: ' + result.output };
            }`,
            type: 'basic',
          },
          {
            id: 'basic-1-2',
            title: 'Variables',
            instruction: 'Create a variable called **age** set to **11**, then print "I am " followed by the age. Expected output should include "I am 11"',
            hint: 'LET age = 11, then PRINT "I am " + age',
            starterCode: '10 LET age = ?\n20 PRINT "I am " + age',
            validator: `(input, run) => {
              const result = run(input);
              if (result.output?.includes('I am 11') || result.output?.includes('I am  11')) return { correct: true, message: 'Variables are named boxes that hold values. So much nicer than MOV A, 11!' };
              if (result.error) return { correct: false, message: 'Error: ' + result.error };
              return { correct: false, message: 'Output should contain "I am 11". Got: ' + result.output };
            }`,
            type: 'basic',
          },
          {
            id: 'basic-1-3',
            title: 'Counting Loop',
            instruction: 'Use a FOR loop to print numbers **1** through **5**, one per line.',
            hint: 'FOR i = 1 TO 5 ... PRINT i ... NEXT i',
            starterCode: '10 FOR i = 1 TO 5\n20 PRINT i\n30 NEXT i',
            validator: `(input, run) => {
              const result = run(input);
              const nums = result.output?.trim().split(/\\s+/).map(Number);
              if (nums && nums.length === 5 && nums[0]===1 && nums[4]===5) return { correct: true, message: 'A FOR loop! Remember the assembly countdown? This does the same thing in 3 lines instead of 6.' };
              if (result.error) return { correct: false, message: 'Error: ' + result.error };
              return { correct: false, message: 'Should print 1 2 3 4 5 on separate lines. Got: ' + result.output };
            }`,
            type: 'basic',
          },
        ],
      },
      {
        id: 'basic-2',
        title: 'Making Decisions in BASIC',
        story: `Remember the CMP and JMP in assembly? In BASIC, decisions are much more readable:

\`\`\`
10 LET score = 85
20 IF score >= 90 THEN PRINT "A"
30 IF score >= 80 THEN PRINT "B"
40 IF score < 80 THEN PRINT "Try harder!"
\`\`\`

You can also use **GOTO** to jump to a line number (like JMP in assembly):

\`\`\`
10 LET count = 1
20 PRINT count
30 LET count = count + 1
40 IF count <= 5 THEN GOTO 20
\`\`\`

See how much easier this is to understand than assembly? You can read it almost like English!`,
        teaches: 'IF/THEN, GOTO, and comparisons',
        challenges: [
          {
            id: 'basic-2-1',
            title: 'Pass or Fail?',
            instruction: 'Write a program: set **score** to **75**. If score >= 60, print "PASS". Otherwise print "FAIL".',
            starterCode: '10 LET score = 75\n20 IF score >= 60 THEN PRINT "?"\n30 IF score < 60 THEN PRINT "?"',
            validator: `(input, run) => {
              const result = run(input);
              if (result.output?.includes('PASS') && !result.output?.includes('FAIL')) return { correct: true, message: '75 >= 60, so PASS! IF/THEN is the BASIC version of CMP + JEQ. Same idea, way easier to write!' };
              if (result.error) return { correct: false, message: 'Error: ' + result.error };
              return { correct: false, message: 'Should print PASS for score 75. Got: ' + result.output };
            }`,
            type: 'basic',
          },
          {
            id: 'basic-2-2',
            title: 'Sum 1 to 10',
            instruction: 'Calculate the sum of all numbers from 1 to 10 using a loop, then print the result (should be **55**).',
            hint: 'Start with sum=0, use FOR i=1 TO 10, add i to sum each time',
            starterCode: '10 LET sum = 0\n20 FOR i = 1 TO 10\n30 LET sum = sum + i\n40 NEXT i\n50 PRINT sum',
            validator: `(input, run) => {
              const result = run(input);
              if (result.output?.trim() === '55') return { correct: true, message: 'The sum is 55! A loop with an accumulator variable — this pattern appears in every programming language.' };
              if (result.error) return { correct: false, message: 'Error: ' + result.error };
              return { correct: false, message: 'Should output 55. Got: ' + result.output };
            }`,
            type: 'basic',
          },
        ],
      },
    ],
  },

  // ── MODULE 4: MODERN PROGRAMMING ──────────────────────────
  {
    id: 'modern',
    era: 'The Modern Age',
    title: 'Modern Programming',
    description: 'Python, JavaScript, and other modern languages make programming feel like writing a recipe. Functions, lists, and powerful built-in tools!',
    icon: '🐍',
    color: '#3b82f6',
    yearRange: '1990s–2020s',
    lessons: [
      {
        id: 'modern-1',
        title: 'Python: Programming for Humans',
        story: `Modern languages like **Python** (created in 1991) are designed to be as readable as possible:

\`\`\`python
name = "Ada"
age = 11

if age >= 13:
    print("You're a teenager!")
else:
    print(f"Hi {name}! You'll be a teen in {13 - age} years!")

# Lists — like having multiple boxes in a row
colors = ["red", "blue", "green"]
for color in colors:
    print(f"I like {color}")
\`\`\`

Notice what's different from BASIC:
- No line numbers!
- No LET — just write \`name = "Ada"\`
- **Indentation** (spaces) shows what's inside a block
- **f-strings** let you put variables right inside text
- **Lists** can hold multiple values

**Functions** let you name a reusable chunk of code:

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

message = greet("World")
print(message)  # Hello, World!
\`\`\``,
        teaches: 'Variables, conditionals, loops, lists, and functions in Python',
        challenges: [
          {
            id: 'mod-1-1',
            title: 'Python Hello World',
            instruction: 'Write a Python program that prints **Hello, World!**',
            starterCode: 'print("?")',
            validator: `(input, run) => {
              const result = run(input);
              if (result.output?.includes('Hello, World!')) return { correct: true, message: 'One line! Compare this to the binary, assembly, and BASIC versions. Programming languages keep getting simpler!' };
              if (result.error) return { correct: false, message: 'Error: ' + result.error };
              return { correct: false, message: 'Print exactly: Hello, World! — Got: ' + result.output };
            }`,
            type: 'python',
          },
          {
            id: 'mod-1-2',
            title: 'Your First Function',
            instruction: 'Write a function called **double** that takes a number and returns it multiplied by 2. Then print double(7). Output should be **14**.',
            starterCode: 'def double(n):\n    return ?\n\nprint(double(7))',
            validator: `(input, run) => {
              const result = run(input);
              if (result.output?.trim() === '14') return { correct: true, message: 'Functions are reusable recipes! double(7)=14, double(100)=200. Write once, use forever.' };
              if (result.error) return { correct: false, message: 'Error: ' + result.error };
              return { correct: false, message: 'Should output 14. Got: ' + result.output };
            }`,
            type: 'python',
          },
          {
            id: 'mod-1-3',
            title: 'List Power',
            instruction: 'Create a list of numbers **[1, 2, 3, 4, 5]**, use a loop to add them up, and print the total.',
            starterCode: 'numbers = [1, 2, 3, 4, 5]\ntotal = 0\nfor n in numbers:\n    total = total + n\nprint(total)',
            validator: `(input, run) => {
              const result = run(input);
              if (result.output?.trim() === '15') return { correct: true, message: 'Lists + loops = power! In BASIC this took line numbers and GOTO. Python makes it beautiful.' };
              if (result.error) return { correct: false, message: 'Error: ' + result.error };
              return { correct: false, message: 'Should output 15. Got: ' + result.output };
            }`,
            type: 'python',
          },
        ],
      },
      {
        id: 'modern-2',
        title: 'Building with Functions',
        story: `The real power of modern programming is **breaking big problems into small pieces**.

Think about making a sandwich:
1. Get bread
2. Add filling
3. Add toppings
4. Close it up

In code, each step becomes a function:

\`\`\`python
def get_bread():
    return "sourdough"

def add_filling(bread, filling):
    return f"{filling} on {bread}"

def make_sandwich(filling, toppings):
    bread = get_bread()
    sandwich = add_filling(bread, filling)
    for topping in toppings:
        sandwich = sandwich + f" with {topping}"
    return sandwich

result = make_sandwich("turkey", ["lettuce", "tomato"])
print(result)
\`\`\`

This is called **decomposition** — the most important skill in programming!`,
        teaches: 'Function composition and decomposition',
        challenges: [
          {
            id: 'mod-2-1',
            title: 'Temperature Converter',
            instruction: 'Write a function **to_celsius** that converts Fahrenheit to Celsius using the formula: **(F - 32) * 5 / 9**. Print to_celsius(212) — it should output **100.0**.',
            starterCode: 'def to_celsius(f):\n    return ?\n\nprint(to_celsius(212))',
            validator: `(input, run) => {
              const result = run(input);
              const val = parseFloat(result.output?.trim());
              if (val === 100 || val === 100.0) return { correct: true, message: '212°F = 100°C (boiling point of water). Functions let you name a formula and reuse it!' };
              if (result.error) return { correct: false, message: 'Error: ' + result.error };
              return { correct: false, message: 'Should output 100.0. Got: ' + result.output };
            }`,
            type: 'python',
          },
          {
            id: 'mod-2-2',
            title: 'FizzBuzz!',
            instruction: 'The classic! Print numbers 1-20. But: for multiples of 3 print "Fizz", for multiples of 5 print "Buzz", for multiples of both print "FizzBuzz".',
            hint: 'Use % (modulo) to check divisibility: if n % 3 == 0 means divisible by 3',
            starterCode: 'for i in range(1, 21):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)',
            validator: `(input, run) => {
              const result = run(input);
              const lines = result.output?.trim().split('\\n').map(l => l.trim());
              if (!lines) return { correct: false, message: 'No output!' };
              const expected = [];
              for (let i = 1; i <= 20; i++) {
                if (i % 15 === 0) expected.push('FizzBuzz');
                else if (i % 3 === 0) expected.push('Fizz');
                else if (i % 5 === 0) expected.push('Buzz');
                else expected.push(String(i));
              }
              if (lines.join(',') === expected.join(',')) return { correct: true, message: 'FizzBuzz complete! This is actually a famous interview question. You just solved it!' };
              if (result.error) return { correct: false, message: 'Error: ' + result.error };
              return { correct: false, message: 'Not quite right. Check the order: check 15 first, then 3, then 5, then the number itself.' };
            }`,
            type: 'python',
          },
        ],
      },
    ],
  },

  // ── MODULE 5: SPEC-DRIVEN DEVELOPMENT ────────────────────
  {
    id: 'spec-driven',
    era: 'The Agentic Future',
    title: 'Spec-Driven Development',
    description: 'The newest way to build: describe WHAT you want, and AI helps build it. Learn to write specs that turn ideas into reality!',
    icon: '🚀',
    color: '#ec4899',
    yearRange: '2024–Future',
    lessons: [
      {
        id: 'spec-1',
        title: 'What is a Spec?',
        story: `Welcome to the **future of programming**!

Throughout this course, you've gone from binary (painful!) to assembly (less painful) to BASIC (readable!) to Python (beautiful!). Each step let you think more about **WHAT** you want and less about **HOW** to do it.

**Spec-driven development** takes the next leap: you write a **specification** (a detailed description of what you want), and an AI assistant helps build it!

A **spec** is NOT just "make me a game." A good spec is detailed:

\`\`\`
## Feature: Score Counter
- Display the current score at the top right
- Score starts at 0
- Each time the player catches a star, add 10 points
- When score reaches 100, show "You Win!" message
- Score should be displayed in large, bold white text
\`\`\`

The better your spec, the better the result. Think of it like being an **architect** — you draw the blueprint, the AI is the construction crew.

Key parts of a good spec:
1. **What** it should do (behavior)
2. **What** it should look like (appearance)
3. **Edge cases** (what happens when things go wrong?)
4. **Examples** of input → output`,
        teaches: 'What specs are and why they matter',
        challenges: [
          {
            id: 'spec-1-1',
            title: 'Spot the Better Spec',
            instruction: 'Which is a better spec? Type **A** or **B**.\n\n**A:** "Make a calculator"\n\n**B:** "Create a calculator that: supports +, -, *, / operations; takes two numbers as input; displays the result; shows an error message if dividing by zero"',
            starterCode: '',
            validator: `(input) => {
              const answer = input.trim().toUpperCase();
              if (answer === 'B') return { correct: true, message: 'B is much better! It tells us exactly what operations, what inputs, what output, and even what happens when something goes wrong (dividing by zero). A good spec leaves no ambiguity.' };
              if (answer === 'A') return { correct: false, message: 'A is too vague! "Make a calculator" could mean anything. What operations? What happens with errors? The builder would have to guess.' };
              return { correct: false, message: 'Type A or B to choose.' };
            }`,
            type: 'spec',
          },
          {
            id: 'spec-1-2',
            title: 'What\'s Missing?',
            instruction: 'This spec is incomplete:\n\n"Create a to-do list app:\n- User can add tasks\n- User can mark tasks as done"\n\nWhat\'s missing? Type one thing that should be added. (Think about: can you remove tasks? what happens to completed tasks? is there a limit?)',
            starterCode: '',
            validator: `(input) => {
              const answer = input.toLowerCase();
              const goodAnswers = ['delete', 'remove', 'limit', 'save', 'persist', 'clear', 'edit', 'order', 'sort', 'empty', 'undo', 'error', 'display', 'show', 'list', 'storage', 'maximum'];
              const found = goodAnswers.some(a => answer.includes(a));
              if (found) return { correct: true, message: 'Great thinking! A spec needs to cover the full user experience. What about deleting tasks? Saving them? What if the list is empty? Every detail matters.' };
              if (answer.length < 5) return { correct: false, message: 'Write a more complete answer — what feature or behavior is the spec missing?' };
              return { correct: true, message: 'Good observation! Thinking about what\\'s missing is one of the most important skills in spec writing. Every unspecified detail becomes a guess.' };
            }`,
            type: 'spec',
          },
        ],
      },
      {
        id: 'spec-2',
        title: 'Writing Your First Spec',
        story: `Now let's write a real spec! A good spec follows this structure:

\`\`\`markdown
# Feature Name

## Purpose
What does this feature do and why?

## User Stories
- As a user, I want to [action] so that [benefit]

## Requirements
### Must Have
- Requirement 1
- Requirement 2

### Nice to Have
- Optional feature 1

## Behavior
- When [trigger], then [response]
- If [condition], show [result]

## Edge Cases
- What if the input is empty?
- What if the number is negative?

## Examples
Input: "hello" → Output: "HELLO"
Input: "" → Output: error message
\`\`\`

Let's practice writing specs step by step!`,
        teaches: 'Structured spec writing',
        challenges: [
          {
            id: 'spec-2-1',
            title: 'Write a Purpose Statement',
            instruction: 'You\'re building a **word counter** tool. Write a clear purpose statement (1-2 sentences) that explains WHAT it does and WHO it\'s for.',
            starterCode: '',
            validator: `(input) => {
              const words = input.trim().split(/\\s+/).length;
              if (words < 5) return { correct: false, message: 'Too short! A purpose statement should be at least one full sentence.' };
              const hasWhat = /count|number|how many|tally|total/i.test(input);
              const hasWords = /word|text|sentence|document/i.test(input);
              if (hasWhat && hasWords) return { correct: true, message: 'Excellent purpose statement! It clearly says what the tool does. A developer reading this knows exactly what to build.' };
              if (hasWhat || hasWords) return { correct: true, message: 'Good start! Your purpose covers the basics. Try to mention both WHAT it counts and WHAT it counts in (words in text/documents).' };
              return { correct: true, message: 'That works as a starting point. For an even stronger spec, explicitly mention counting words — be as specific as possible.' };
            }`,
            type: 'spec',
          },
          {
            id: 'spec-2-2',
            title: 'Define Edge Cases',
            instruction: 'For the word counter, list at least **3 edge cases** (unusual situations the tool should handle). Write them as bullet points starting with "What if..."',
            hint: 'Think: What if the text is empty? What about extra spaces? Really long text? Numbers? Special characters?',
            starterCode: '',
            validator: `(input) => {
              const lines = input.split('\\n').filter(l => l.trim().length > 0);
              const bullets = lines.filter(l => /^[-*•]|what if/i.test(l.trim()));
              if (bullets.length >= 3) return { correct: true, message: 'Thinking about edge cases is a superpower! Professional developers say "what could go wrong?" before writing a single line of code. This is what separates good specs from great ones.' };
              if (bullets.length >= 1) return { correct: false, message: 'Good start! You have ' + bullets.length + ' edge case(s). Try to think of at least 3. What about empty input? Extra spaces? Very long text?' };
              return { correct: false, message: 'Write at least 3 edge cases as bullet points. Start each with "What if..." or use bullet markers (-).' };
            }`,
            type: 'spec',
          },
          {
            id: 'spec-2-3',
            title: 'Full Mini-Spec',
            instruction: 'Write a complete mini-spec for a **number guessing game**. Include: Purpose (what is it?), at least 3 requirements, and at least 2 edge cases. Write it in a structured format.',
            starterCode: '',
            validator: `(input) => {
              const lower = input.toLowerCase();
              const words = input.trim().split(/\\s+/).length;
              if (words < 20) return { correct: false, message: 'Your spec is too short. A good spec needs purpose, requirements, and edge cases. Aim for at least a few sentences!' };
              const hasPurpose = /purpose|goal|about|description|what|guessing game/i.test(lower);
              const hasRequirements = (lower.match(/[-*•]|\\d\\./g) || []).length >= 3;
              const hasEdge = /edge|what if|error|invalid|wrong|empty/i.test(lower);
              if (hasPurpose && hasRequirements && hasEdge) return { correct: true, message: 'You just wrote your first real spec! This is exactly how professionals describe software before building it. In the agentic era, this skill is your superpower — you\\'re the architect, and AI is your construction crew!' };
              const missing = [];
              if (!hasPurpose) missing.push('a clear purpose');
              if (!hasRequirements) missing.push('at least 3 bullet-point requirements');
              if (!hasEdge) missing.push('edge cases (what if something goes wrong?)');
              return { correct: false, message: 'Good effort! Your spec is missing: ' + missing.join(', ') + '.' };
            }`,
            type: 'spec',
          },
        ],
      },
      {
        id: 'spec-3',
        title: 'From Spec to Reality',
        story: `You've learned to write specs. Now let's see the full cycle: **Spec → Code → Test → Refine**.

In the real agentic workflow:
1. **You** write a detailed spec
2. **AI** generates the code based on your spec
3. **You** test it and find what's wrong or missing
4. **You** update the spec with what you learned
5. **Repeat** until it's perfect!

This is called an **iterative** process. No one gets it perfect the first time — not even professional engineers!

The key insight: **the spec is a living document**. It grows and improves as you learn more about what you actually need.

Let's practice the cycle with a simple example: building a greeting generator.`,
        teaches: 'The spec → build → test → refine cycle',
        challenges: [
          {
            id: 'spec-3-1',
            title: 'Spec Review',
            instruction: 'Here\'s a spec for a greeting generator:\n\n"Takes a name and time of day, returns a greeting."\n\nThis spec would produce broken code. Write an **improved version** that covers: what inputs it accepts, what format the output should be, and what happens with missing inputs.',
            starterCode: '',
            validator: `(input) => {
              const lower = input.toLowerCase();
              const words = input.trim().split(/\\s+/).length;
              if (words < 15) return { correct: false, message: 'Too brief. What inputs does it take? What does the output look like? What about errors?' };
              const hasInput = /input|name|time|parameter|argument|takes|accept/i.test(lower);
              const hasOutput = /output|return|display|print|format|greeting|good morning|good afternoon/i.test(lower);
              const hasError = /missing|empty|error|invalid|null|none|default|blank/i.test(lower);
              if (hasInput && hasOutput && hasError) return { correct: true, message: 'Now THAT\\'s a spec an AI can work with! You defined inputs, outputs, and error handling. This is the #1 skill for the agentic era.' };
              const missing = [];
              if (!hasInput) missing.push('input descriptions');
              if (!hasOutput) missing.push('output format');
              if (!hasError) missing.push('error handling');
              return { correct: false, message: 'Getting there! Still needs: ' + missing.join(', ') + '.' };
            }`,
            type: 'spec',
          },
          {
            id: 'spec-3-2',
            title: 'The Grand Finale: Your Dream App',
            instruction: 'Write a spec for YOUR dream app — anything you want! A game, a tool, an art creator — you decide! Include: a creative name, what it does, 5+ features, how it looks, and at least 3 edge cases. Make it detailed enough that someone (or an AI!) could actually build it.',
            starterCode: '',
            validator: `(input) => {
              const words = input.trim().split(/\\s+/).length;
              if (words < 30) return { correct: false, message: 'Dream bigger! Your spec needs more detail. At least describe what it does, list 5 features, and think about edge cases.' };
              const bullets = (input.match(/[-*•]|\\d\\./g) || []).length;
              if (words >= 50 && bullets >= 5) return { correct: true, message: '🎉 CONGRATULATIONS! You\\'ve completed the entire journey — from binary switches to writing specs for the future! You now understand how programming evolved AND you can design software like a professional architect. Your dream app spec is ready to be built. The agentic era is yours!' };
              if (words >= 30) return { correct: true, message: 'Nice spec! You\\'ve got a solid foundation. You\\'ve completed the journey from binary to the future of programming! Keep dreaming and speccing — the world needs architects like you!' };
              return { correct: false, message: 'Keep going! Add more features (aim for 5+) and edge cases (aim for 3+).' };
            }`,
            type: 'spec',
          },
        ],
      },
    ],
  },
];

export default curriculum;
