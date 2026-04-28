interface RunResult {
  output: string;
  error?: string;
}

export function runPython(code: string): RunResult {
  const output: string[] = [];
  const variables: Record<string, unknown> = {};

  const lines = code.split('\n');

  const resolveValue = (expr: string): unknown => {
    expr = expr.trim();

    // Handle parenthesized sub-expressions: find outermost parens that wrap the expression
    // or appear as grouping (not function calls)
    if (expr.startsWith('(') && !expr.match(/^\w+\(/)) {
      let depth = 0;
      let closeIdx = -1;
      for (let i = 0; i < expr.length; i++) {
        if (expr[i] === '(') depth++;
        else if (expr[i] === ')') { depth--; if (depth === 0) { closeIdx = i; break; } }
      }
      if (closeIdx !== -1) {
        const inner = expr.slice(1, closeIdx);
        const rest = expr.slice(closeIdx + 1).trim();
        const innerVal = resolveValue(inner);
        if (!rest) return innerVal;
        // Handle: (expr) * something, (expr) / something, etc.
        if (rest.startsWith('*')) {
          const right = resolveValue(rest.slice(1).trim());
          // Could be chained: (f - 32) * 5 / 9
          return Number(innerVal) * Number(right);
        }
        if (rest.startsWith('/')) {
          const right = resolveValue(rest.slice(1).trim());
          return Number(innerVal) / Number(right);
        }
        if (rest.startsWith('+')) {
          const right = resolveValue(rest.slice(1).trim());
          if (typeof innerVal === 'number' && typeof right === 'number') return innerVal + right;
          return String(innerVal) + String(right);
        }
        if (rest.startsWith('-')) {
          const right = resolveValue(rest.slice(1).trim());
          return Number(innerVal) - Number(right);
        }
        if (rest.startsWith('%')) {
          const right = resolveValue(rest.slice(1).trim());
          return Number(innerVal) % Number(right);
        }
        return innerVal;
      }
    }

    if (expr.startsWith('f"') || expr.startsWith("f'")) {
      const inner = expr.slice(2, -1);
      return inner.replace(/\{([^}]+)\}/g, (_, e) => String(resolveValue(e)));
    }

    if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
      return expr.slice(1, -1);
    }

    if (expr.startsWith('[') && expr.endsWith(']')) {
      const inner = expr.slice(1, -1).trim();
      if (!inner) return [];
      const items = splitTopLevel(inner, ',');
      return items.map(i => resolveValue(i.trim()));
    }

    if (/^-?\d+\.\d+$/.test(expr)) return parseFloat(expr);
    if (/^-?\d+$/.test(expr)) return parseInt(expr);
    if (expr === 'True') return true;
    if (expr === 'False') return false;
    if (expr === 'None') return null;

    if (expr.includes('==')) {
      const [l, r] = expr.split('==');
      return resolveValue(l) === resolveValue(r);
    }
    if (expr.includes('!=')) {
      const [l, r] = expr.split('!=');
      return resolveValue(l) !== resolveValue(r);
    }
    if (expr.includes('>=')) {
      const [l, r] = expr.split('>=');
      return Number(resolveValue(l)) >= Number(resolveValue(r));
    }
    if (expr.includes('<=')) {
      const [l, r] = expr.split('<=');
      return Number(resolveValue(l)) <= Number(resolveValue(r));
    }
    if (expr.includes(' > ')) {
      const [l, r] = expr.split(' > ');
      return Number(resolveValue(l)) > Number(resolveValue(r));
    }
    if (expr.includes(' < ')) {
      const [l, r] = expr.split(' < ');
      return Number(resolveValue(l)) < Number(resolveValue(r));
    }

    const rangeMatch = expr.match(/^range\((.+)\)$/);
    if (rangeMatch) {
      const args = splitTopLevel(rangeMatch[1], ',').map(a => Number(resolveValue(a.trim())));
      const start = args.length >= 2 ? args[0] : 0;
      const end = args.length >= 2 ? args[1] : args[0];
      const step = args[2] || 1;
      const arr: number[] = [];
      for (let i = start; step > 0 ? i < end : i > end; i += step) arr.push(i);
      return arr;
    }

    const funcCallMatch = expr.match(/^(\w+)\((.*)?\)$/);
    if (funcCallMatch) {
      const fname = funcCallMatch[1];
      const argStr = funcCallMatch[2] || '';

      if (fname === 'len') {
        const val = resolveValue(argStr);
        if (Array.isArray(val)) return val.length;
        if (typeof val === 'string') return val.length;
        return 0;
      }
      if (fname === 'str') return String(resolveValue(argStr));
      if (fname === 'int') return parseInt(String(resolveValue(argStr)));
      if (fname === 'float') return parseFloat(String(resolveValue(argStr)));
      if (fname === 'abs') return Math.abs(Number(resolveValue(argStr)));
      if (fname === 'max') {
        const args = splitTopLevel(argStr, ',').map(a => Number(resolveValue(a.trim())));
        return Math.max(...args);
      }
      if (fname === 'min') {
        const args = splitTopLevel(argStr, ',').map(a => Number(resolveValue(a.trim())));
        return Math.min(...args);
      }

      if (fname in variables && typeof variables[fname] === 'function') {
        const args = argStr ? splitTopLevel(argStr, ',').map(a => resolveValue(a.trim())) : [];
        return (variables[fname] as Function)(...args);
      }
    }

    if (expr.includes(' + ')) {
      const parts = splitTopLevel(expr, '+');
      const resolved = parts.map(p => resolveValue(p.trim()));
      if (resolved.every(r => typeof r === 'number')) {
        return (resolved as number[]).reduce((a, b) => a + b, 0);
      }
      return resolved.map(r => String(r)).join('');
    }

    if (expr.includes(' - ')) {
      const parts = splitTopLevel(expr, '-');
      if (parts.length === 2) {
        const l = Number(resolveValue(parts[0].trim()));
        const r = Number(resolveValue(parts[1].trim()));
        return l - r;
      }
    }

    if (expr.includes(' * ')) {
      const parts = splitTopLevel(expr, '*');
      return parts.map(p => Number(resolveValue(p.trim()))).reduce((a, b) => a * b, 1);
    }

    if (expr.includes(' / ')) {
      const parts = splitTopLevel(expr, '/');
      if (parts.length === 2) {
        return Number(resolveValue(parts[0].trim())) / Number(resolveValue(parts[1].trim()));
      }
    }

    if (expr.includes(' % ')) {
      const parts = expr.split(' % ');
      if (parts.length === 2) {
        return Number(resolveValue(parts[0].trim())) % Number(resolveValue(parts[1].trim()));
      }
    }

    if (expr in variables) return variables[expr];

    return expr;
  };

  function splitTopLevel(s: string, delimiter: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = '';
    let inStr: string | null = null;

    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (inStr) {
        current += ch;
        if (ch === inStr) inStr = null;
        continue;
      }
      if (ch === '"' || ch === "'") {
        inStr = ch;
        current += ch;
        continue;
      }
      if (ch === '(' || ch === '[') { depth++; current += ch; continue; }
      if (ch === ')' || ch === ']') { depth--; current += ch; continue; }

      if (depth === 0) {
        if (delimiter.length === 1 && ch === delimiter) {
          parts.push(current);
          current = '';
          continue;
        }
        if (delimiter === '+' && ch === '+' && s[i-1] === ' ' && s[i+1] === ' ') {
          parts.push(current);
          current = '';
          continue;
        }
        if (delimiter === '-' && ch === '-' && s[i-1] === ' ' && s[i+1] === ' ') {
          parts.push(current);
          current = '';
          continue;
        }
        if (delimiter === '*' && ch === '*' && s[i-1] === ' ' && s[i+1] === ' ') {
          parts.push(current);
          current = '';
          continue;
        }
        if (delimiter === '/' && ch === '/' && s[i-1] === ' ' && s[i+1] === ' ') {
          parts.push(current);
          current = '';
          continue;
        }
      }
      current += ch;
    }
    parts.push(current);
    return parts;
  }

  function getIndent(line: string): number {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
  }

  function findBlockEnd(startIdx: number, baseIndent: number): number {
    let i = startIdx + 1;
    while (i < lines.length) {
      const line = lines[i];
      if (line.trim() === '' || line.trim().startsWith('#')) { i++; continue; }
      if (getIndent(line) <= baseIndent) break;
      i++;
    }
    return i;
  }

  function executeBlock(startIdx: number, endIdx: number): number {
    let i = startIdx;
    let steps = 0;

    while (i < endIdx && steps < 10000) {
      steps++;
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) { i++; continue; }

      const indent = getIndent(line);

      if (trimmed.startsWith('def ')) {
        const match = trimmed.match(/^def\s+(\w+)\(([^)]*)\)\s*:/);
        if (match) {
          const fname = match[1];
          const params = match[2].split(',').map(p => p.trim()).filter(Boolean);
          const blockEnd = findBlockEnd(i, indent);
          const bodyStart = i + 1;
          const bodyEnd = blockEnd;

          variables[fname] = (...args: unknown[]) => {
            const savedVars = { ...variables };
            params.forEach((p, idx) => { variables[p] = args[idx]; });

            let returnVal: unknown = undefined;
            let j = bodyStart;
            while (j < bodyEnd) {
              const bline = lines[j]?.trim();
              if (!bline || bline.startsWith('#')) { j++; continue; }

              if (bline.startsWith('return ')) {
                returnVal = resolveValue(bline.slice(7));
                break;
              }

              j = executeLine(j, bodyEnd);
            }

            Object.assign(variables, savedVars);
            params.forEach((p, idx) => { variables[p] = args[idx]; });

            return returnVal;
          };

          i = blockEnd;
        } else {
          i++;
        }
        continue;
      }

      i = executeLine(i, endIdx);
    }

    return i;
  }

  function executeLine(i: number, endIdx: number): number {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return i + 1;

    const indent = getIndent(line);

    if (trimmed.startsWith('print(')) {
      const inner = trimmed.slice(6, trimmed.lastIndexOf(')'));
      const val = resolveValue(inner);
      output.push(String(val));
      return i + 1;
    }

    if (trimmed.startsWith('for ')) {
      const match = trimmed.match(/^for\s+(\w+)\s+in\s+(.+):\s*$/);
      if (match) {
        const varName = match[1];
        const iterable = resolveValue(match[2]);
        const blockEnd = findBlockEnd(i, indent);

        if (Array.isArray(iterable)) {
          for (const item of iterable) {
            variables[varName] = item;
            let j = i + 1;
            while (j < blockEnd) {
              const bline = lines[j]?.trim();
              if (!bline || bline.startsWith('#')) { j++; continue; }
              j = executeLine(j, blockEnd);
            }
          }
        }
        return blockEnd;
      }
    }

    if (trimmed.startsWith('if ') || trimmed.startsWith('elif ')) {
      const isElif = trimmed.startsWith('elif ');
      const condStr = trimmed.slice(isElif ? 5 : 3, trimmed.lastIndexOf(':')).trim();
      const cond = resolveValue(condStr);
      const blockEnd = findBlockEnd(i, indent);

      if (cond && cond !== 0) {
        let j = i + 1;
        while (j < blockEnd) {
          const bline = lines[j]?.trim();
          if (!bline || bline.startsWith('#')) { j++; continue; }
          j = executeLine(j, blockEnd);
        }
        let skip = blockEnd;
        while (skip < endIdx) {
          const nextTrimmed = lines[skip]?.trim();
          if (!nextTrimmed || nextTrimmed.startsWith('#')) { skip++; continue; }
          if (getIndent(lines[skip]) === indent && (nextTrimmed.startsWith('elif ') || nextTrimmed.startsWith('else:'))) {
            skip = findBlockEnd(skip, indent);
          } else {
            break;
          }
        }
        return skip;
      } else {
        let next = blockEnd;
        if (next < endIdx) {
          const nextTrimmed = lines[next]?.trim();
          if (nextTrimmed?.startsWith('elif ') || nextTrimmed?.startsWith('else:')) {
            return executeLine(next, endIdx);
          }
        }
        return blockEnd;
      }
    }

    if (trimmed.startsWith('else:')) {
      const blockEnd = findBlockEnd(i, indent);
      let j = i + 1;
      while (j < blockEnd) {
        const bline = lines[j]?.trim();
        if (!bline || bline.startsWith('#')) { j++; continue; }
        j = executeLine(j, blockEnd);
      }
      return blockEnd;
    }

    const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignMatch) {
      variables[assignMatch[1]] = resolveValue(assignMatch[2]);
      return i + 1;
    }

    const funcCallMatch = trimmed.match(/^(\w+)\((.*)?\)$/);
    if (funcCallMatch) {
      resolveValue(trimmed);
      return i + 1;
    }

    return i + 1;
  }

  try {
    executeBlock(0, lines.length);
  } catch (e) {
    return { output: output.join('\n'), error: (e as Error).message };
  }

  return { output: output.join('\n') };
}
