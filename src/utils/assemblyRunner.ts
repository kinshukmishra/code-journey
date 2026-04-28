interface Registers {
  A: number;
  B: number;
  C: number;
  D: number;
}

interface RunResult {
  output: string;
  error?: string;
  registers: Registers;
}

export function runAssembly(code: string): RunResult {
  const registers: Registers = { A: 0, B: 0, C: 0, D: 0 };
  const output: string[] = [];
  const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//'));

  const labels: Record<string, number> = {};
  const instructions: string[] = [];

  for (const line of lines) {
    if (line.endsWith(':')) {
      labels[line.slice(0, -1).trim()] = instructions.length;
    } else {
      instructions.push(line);
    }
  }

  let pc = 0;
  let steps = 0;
  let cmpResult = 0;

  while (pc < instructions.length && steps < 1000) {
    steps++;
    const instr = instructions[pc];
    const parts = instr.split(/[\s,]+/).filter(Boolean);
    const cmd = parts[0]?.toUpperCase();

    const getVal = (token: string): number => {
      const upper = token.toUpperCase();
      if (upper in registers) return registers[upper as keyof Registers];
      const n = parseInt(token);
      if (isNaN(n)) throw new Error(`Unknown value: ${token}`);
      return n;
    };

    const setReg = (reg: string, val: number) => {
      const upper = reg.toUpperCase();
      if (!(upper in registers)) throw new Error(`Unknown register: ${reg}`);
      registers[upper as keyof Registers] = val;
    };

    try {
      switch (cmd) {
        case 'MOV':
          setReg(parts[1], getVal(parts[2]));
          pc++;
          break;
        case 'ADD':
          setReg(parts[1], getVal(parts[1]) + getVal(parts[2]));
          pc++;
          break;
        case 'SUB':
          setReg(parts[1], getVal(parts[1]) - getVal(parts[2]));
          pc++;
          break;
        case 'MUL':
          setReg(parts[1], getVal(parts[1]) * getVal(parts[2]));
          pc++;
          break;
        case 'OUT':
          output.push(String(getVal(parts[1])));
          pc++;
          break;
        case 'CMP':
          cmpResult = getVal(parts[1]) - getVal(parts[2]);
          pc++;
          break;
        case 'JMP': {
          const target = labels[parts[1]];
          if (target === undefined) throw new Error(`Unknown label: ${parts[1]}`);
          pc = target;
          break;
        }
        case 'JEQ': {
          const target = labels[parts[1]];
          if (target === undefined) throw new Error(`Unknown label: ${parts[1]}`);
          pc = cmpResult === 0 ? target : pc + 1;
          break;
        }
        case 'JGT': {
          const target = labels[parts[1]];
          if (target === undefined) throw new Error(`Unknown label: ${parts[1]}`);
          pc = cmpResult > 0 ? target : pc + 1;
          break;
        }
        case 'JLT': {
          const target = labels[parts[1]];
          if (target === undefined) throw new Error(`Unknown label: ${parts[1]}`);
          pc = cmpResult < 0 ? target : pc + 1;
          break;
        }
        default:
          throw new Error(`Unknown instruction: ${cmd}`);
      }
    } catch (e) {
      return { output: output.join(' '), error: (e as Error).message, registers };
    }
  }

  if (steps >= 1000) {
    return { output: output.join(' '), error: 'Program ran too long (infinite loop?)', registers };
  }

  return { output: output.join(' '), registers };
}
