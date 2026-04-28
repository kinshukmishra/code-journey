import { useState, useCallback } from 'react';
import type { Challenge } from '../data/curriculum';
import CodeEditor from './CodeEditor';
import BinaryToggle from './BinaryToggle';
import { runAssembly } from '../utils/assemblyRunner';
import { runBasic } from '../utils/basicRunner';
import { runPython } from '../utils/pythonRunner';
import { validateChallenge } from '../utils/validators';
import { Star, Lightbulb, RotateCcw, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface ChallengeCardProps {
  challenge: Challenge;
  isComplete: boolean;
  stars: number;
  onComplete: (id: string) => void;
  onAttempt: (id: string) => void;
  onHint: (id: string) => void;
  hintUsed: boolean;
  isLast: boolean;
  onNext: () => void;
}

interface ValidationResult {
  correct: boolean;
  message: string;
}

export default function ChallengeCard({
  challenge,
  isComplete,
  stars,
  onComplete,
  onAttempt,
  onHint,
  hintUsed,
  isLast,
  onNext,
}: ChallengeCardProps) {
  const [code, setCode] = useState(challenge.starterCode);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const runCode = useCallback(() => {
    onAttempt(challenge.id);

    try {
      let runnerOutput = undefined;

      if (challenge.type === 'assembly') {
        runnerOutput = runAssembly(code);
      } else if (challenge.type === 'basic') {
        runnerOutput = runBasic(code);
      } else if (challenge.type === 'python') {
        runnerOutput = runPython(code);
      }

      const validationResult = validateChallenge(challenge.id, code, runnerOutput);

      setResult(validationResult);

      if (validationResult.correct) {
        setIsAnimating(true);
        onComplete(challenge.id);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    } catch (e) {
      setResult({ correct: false, message: 'Something went wrong: ' + (e as Error).message });
    }
  }, [code, challenge, onAttempt, onComplete]);

  const reset = () => {
    setCode(challenge.starterCode);
    setResult(null);
  };

  const handleShowHint = () => {
    setShowHint(true);
    onHint(challenge.id);
  };

  const useBinaryToggle = challenge.type === 'binary' && challenge.starterCode === '00000000';

  return (
    <div className={`challenge-card ${isComplete ? 'complete' : ''} ${isAnimating ? 'celebrating' : ''}`}>
      <div className="challenge-header">
        <h3>{challenge.title}</h3>
        <div className="star-display">
          {[1, 2, 3].map(n => (
            <Star
              key={n}
              size={18}
              className={`star ${n <= stars ? 'earned' : 'empty'}`}
              fill={n <= stars ? '#f59e0b' : 'none'}
            />
          ))}
        </div>
      </div>

      <div className="challenge-instruction" dangerouslySetInnerHTML={{
        __html: challenge.instruction.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      }} />

      {useBinaryToggle ? (
        <BinaryToggle value={code} onChange={setCode} />
      ) : (
        <CodeEditor
          value={code}
          onChange={setCode}
          language={challenge.type}
        />
      )}

      <div className="challenge-actions">
        <button className="btn btn-run" onClick={runCode} disabled={isComplete}>
          {isComplete ? (
            <><CheckCircle size={16} /> Completed!</>
          ) : (
            <><ChevronRight size={16} /> Run & Check</>
          )}
        </button>

        {!isComplete && challenge.hint && (
          <button className="btn btn-hint" onClick={handleShowHint} disabled={showHint}>
            <Lightbulb size={16} />
            {showHint ? 'Hint shown below' : `Get Hint ${hintUsed ? '' : '(-1 star)'}`}
          </button>
        )}

        <button className="btn btn-reset" onClick={reset}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {showHint && challenge.hint && (
        <div className="hint-box">
          <Lightbulb size={16} /> <strong>Hint:</strong> {challenge.hint}
        </div>
      )}

      {result && (
        <div className={`result-box ${result.correct ? 'success' : 'error'}`}>
          {result.correct ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span>{result.message}</span>
        </div>
      )}

      {isComplete && !isLast && (
        <button className="btn btn-next" onClick={onNext}>
          Next Challenge <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
