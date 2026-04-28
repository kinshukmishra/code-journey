interface RunResult {
  output: string;
  error?: string;
}

export function runBasic(code: string): RunResult {
  const output: string[] = [];
  const variables: Record<string, number | string> = {};
  const lines: { num: number; text: string }[] = [];

  for (const raw of code.split('\n')) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^(\d+)\s+(.+)$/);
    if (match) {
      lines.push({ num: parseInt(match[1]), text: match[2] });
    }
  }

  lines.sort((a, b) => a.num - b.num);

  const resolveExpr = (expr: string): string | number => {
    expr = expr.trim();

    if (expr.startsWith('"') && expr.endsWith('"')) {
      return expr.slice(1, -1);
    }

    if (/^\d+$/.test(expr)) return parseInt(expr);

    if (expr.includes('+')) {
      const parts = expr.split('+').map(p => p.trim());
      let result = '';
      let allNum = true;
      let numSum = 0;

      for (const part of parts) {
        const val = resolveExpr(part);
        if (typeof val === 'string') {
          allNum = false;
          result += val;
        } else {
          numSum += val;
          result += String(val);
        }
      }

      return allNum ? numSum : result;
    }

    if (expr.includes('-') && !expr.startsWith('-')) {
      const idx = expr.lastIndexOf('-');
      const left = resolveExpr(expr.slice(0, idx));
      const right = resolveExpr(expr.slice(idx + 1));
      if (typeof left === 'number' && typeof right === 'number') return left - right;
    }

    if (expr.includes('*')) {
      const parts = expr.split('*').map(p => resolveExpr(p.trim()));
      if (parts.every(p => typeof p === 'number')) {
        return (parts as number[]).reduce((a, b) => a * b, 1);
      }
    }

    if (expr in variables) return variables[expr];

    const num = parseFloat(expr);
    if (!isNaN(num)) return num;

    return expr;
  };

  const evalCondition = (cond: string): boolean => {
    const ops = ['>=', '<=', '<>', '!=', '>', '<', '='];
    for (const op of ops) {
      const idx = cond.indexOf(op);
      if (idx !== -1) {
        const left = resolveExpr(cond.slice(0, idx));
        const right = resolveExpr(cond.slice(idx + op.length));
        const l = typeof left === 'number' ? left : parseFloat(String(left));
        const r = typeof right === 'number' ? right : parseFloat(String(right));
        switch (op) {
          case '>=': return l >= r;
          case '<=': return l <= r;
          case '>': return l > r;
          case '<': return l < r;
          case '=': return l === r;
          case '<>': case '!=': return l !== r;
        }
      }
    }
    return false;
  };

  let pc = 0;
  let steps = 0;
  const forStack: { varName: string; limit: number; step: number; lineIdx: number }[] = [];

  try {
    while (pc < lines.length && steps < 5000) {
      steps++;
      const line = lines[pc];
      const text = line.text;
      const upper = text.toUpperCase();

      if (upper.startsWith('PRINT ') || upper === 'PRINT') {
        const arg = text.slice(6).trim();
        if (!arg) {
          output.push('');
        } else {
          const val = resolveExpr(arg);
          output.push(String(val));
        }
        pc++;
      } else if (upper.startsWith('LET ')) {
        const rest = text.slice(4).trim();
        const eqIdx = rest.indexOf('=');
        const varName = rest.slice(0, eqIdx).trim();
        const value = resolveExpr(rest.slice(eqIdx + 1));
        variables[varName] = value;
        pc++;
      } else if (upper.startsWith('IF ')) {
        const thenIdx = upper.indexOf('THEN');
        if (thenIdx === -1) throw new Error('IF without THEN');
        const condition = text.slice(3, thenIdx).trim();
        const action = text.slice(thenIdx + 4).trim();

        if (evalCondition(condition)) {
          const gotoMatch = action.toUpperCase().match(/^GOTO\s+(\d+)$/);
          if (gotoMatch) {
            const targetNum = parseInt(gotoMatch[1]);
            const targetIdx = lines.findIndex(l => l.num === targetNum);
            if (targetIdx === -1) throw new Error(`Line ${targetNum} not found`);
            pc = targetIdx;
          } else {
            const tempLine = { num: -1, text: action };
            lines.splice(pc + 1, 0, tempLine);
            pc++;
          }
        } else {
          pc++;
        }
      } else if (upper.startsWith('GOTO ')) {
        const targetNum = parseInt(text.slice(5).trim());
        const targetIdx = lines.findIndex(l => l.num === targetNum);
        if (targetIdx === -1) throw new Error(`Line ${targetNum} not found`);
        pc = targetIdx;
      } else if (upper.startsWith('FOR ')) {
        const match = text.match(/FOR\s+(\w+)\s*=\s*(\d+)\s+TO\s+(\d+)(?:\s+STEP\s+(-?\d+))?/i);
        if (!match) throw new Error('Invalid FOR syntax');
        const varName = match[1];
        const start = parseInt(match[2]);
        const limit = parseInt(match[3]);
        const step = match[4] ? parseInt(match[4]) : 1;
        variables[varName] = start;
        forStack.push({ varName, limit, step, lineIdx: pc });
        pc++;
      } else if (upper.startsWith('NEXT')) {
        const frame = forStack[forStack.length - 1];
        if (!frame) throw new Error('NEXT without FOR');
        const current = variables[frame.varName] as number;
        const next = current + frame.step;
        if ((frame.step > 0 && next <= frame.limit) || (frame.step < 0 && next >= frame.limit)) {
          variables[frame.varName] = next;
          pc = frame.lineIdx + 1;
        } else {
          forStack.pop();
          pc++;
        }
      } else if (upper.startsWith('REM') || upper.startsWith("'")) {
        pc++;
      } else {
        pc++;
      }
    }

    if (steps >= 5000) {
      return { output: output.join('\n'), error: 'Program ran too long (infinite loop?)' };
    }
  } catch (e) {
    return { output: output.join('\n'), error: (e as Error).message };
  }

  return { output: output.join('\n') };
}
