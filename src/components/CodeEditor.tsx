import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'binary' | 'assembly' | 'basic' | 'python' | 'spec';
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, language, readOnly }: CodeEditorProps) {
  const extensions = [];
  if (language === 'python') extensions.push(python());
  else if (language === 'basic' || language === 'assembly') extensions.push(javascript());

  if (language === 'spec') {
    return (
      <div className="spec-editor">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          placeholder="Write your spec here..."
          rows={12}
          className="spec-textarea"
        />
      </div>
    );
  }

  if (language === 'binary') {
    return (
      <div className="binary-editor">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="binary-input"
          placeholder="Type your answer..."
          readOnly={readOnly}
          spellCheck={false}
        />
      </div>
    );
  }

  return (
    <div className="code-editor">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={extensions}
        theme={oneDark}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: true,
          autocompletion: false,
        }}
        height="200px"
      />
    </div>
  );
}
