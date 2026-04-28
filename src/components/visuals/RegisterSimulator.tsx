import { useState, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface RegisterState {
  A: number;
  B: number;
  C: number;
  D: number;
}

interface Step {
  instruction: string;
  registers: RegisterState;
  output?: string;
  changed?: string;
}

function computeSteps(code: string): Step[] {
  const regs: RegisterState = { A: 0, B: 0, C: 0, D: 0 };
  const steps: Step[] = [];
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
  let safety = 0;
  let cmpResult = 0;

  const getVal = (t: string): number => {
    const u = t.toUpperCase();
    if (u in regs) return regs[u as keyof RegisterState];
    return parseInt(t);
  };
  const setReg = (r: string, v: number) => { regs[r.toUpperCase() as keyof RegisterState] = v; };

  while (pc < instructions.length && safety < 200) {
    safety++;
    const instr = instructions[pc];
    const parts = instr.split(/[\s,]+/).filter(Boolean);
    const cmd = parts[0].toUpperCase();
    let changed = '';
    let output: string | undefined;

    switch (cmd) {
      case 'MOV': setReg(parts[1], getVal(parts[2])); changed = parts[1].toUpperCase(); pc++; break;
      case 'ADD': setReg(parts[1], getVal(parts[1]) + getVal(parts[2])); changed = parts[1].toUpperCase(); pc++; break;
      case 'SUB': setReg(parts[1], getVal(parts[1]) - getVal(parts[2])); changed = parts[1].toUpperCase(); pc++; break;
      case 'OUT': output = String(getVal(parts[1])); pc++; break;
      case 'CMP': cmpResult = getVal(parts[1]) - getVal(parts[2]); pc++; break;
      case 'JMP': pc = labels[parts[1]] ?? pc + 1; break;
      case 'JEQ': pc = cmpResult === 0 ? (labels[parts[1]] ?? pc + 1) : pc + 1; break;
      case 'JGT': pc = cmpResult > 0 ? (labels[parts[1]] ?? pc + 1) : pc + 1; break;
      case 'JLT': pc = cmpResult < 0 ? (labels[parts[1]] ?? pc + 1) : pc + 1; break;
      default: pc++; break;
    }

    steps.push({ instruction: instr, registers: { ...regs }, output, changed });
  }

  return steps;
}

export default function RegisterSimulator({ code, caption }: { code: string; caption?: string }) {
  const [steps] = useState(() => computeSteps(code));
  const [currentStep, setCurrentStep] = useState(-1);
  const [outputs, setOutputs] = useState<string[]>([]);

  const current = currentStep >= 0 ? steps[currentStep] : null;
  const regs = current ? current.registers : { A: 0, B: 0, C: 0, D: 0 };
  const done = currentStep >= steps.length - 1;

  const advance = useCallback(() => {
    const next = currentStep + 1;
    if (next < steps.length) {
      setCurrentStep(next);
      if (steps[next].output) {
        setOutputs(prev => [...prev, steps[next].output!]);
      }
    }
  }, [currentStep, steps]);

  const reset = () => {
    setCurrentStep(-1);
    setOutputs([]);
  };

  return (
    <div className="register-sim">
      <div className="register-code-panel">
        <div className="register-code-title">Program</div>
        {code.split('\n').filter(l => l.trim()).map((line, i) => {
          const isLabel = line.trim().endsWith(':');
          const isCurrent = current?.instruction === line.trim();
          return (
            <div key={i} className={`register-code-line ${isCurrent ? 'active' : ''} ${isLabel ? 'label' : ''}`}>
              {!isLabel && <span className="line-marker">{isCurrent ? '\u25B6' : ' '}</span>}
              <code>{line}</code>
            </div>
          );
        })}
      </div>

      <div className="register-state-panel">
        <div className="register-boxes">
          {(['A', 'B', 'C', 'D'] as const).map(name => (
            <div
              key={name}
              className={`register-box ${current?.changed === name ? 'changed' : ''}`}
            >
              <div className="register-name">{name}</div>
              <div className="register-value">{regs[name]}</div>
            </div>
          ))}
        </div>

        {outputs.length > 0 && (
          <div className="register-output">
            <div className="register-output-label">Output</div>
            <div className="register-output-values">{outputs.join(' ')}</div>
          </div>
        )}

        <div className="register-controls">
          <button className="btn btn-step-sim" onClick={advance} disabled={done}>
            <Play size={14} /> {currentStep < 0 ? 'Start' : done ? 'Done!' : 'Next Step'}
          </button>
          <button className="btn btn-reset" onClick={reset}>
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {caption && <div className="visual-caption">{caption}</div>}
    </div>
  );
}
