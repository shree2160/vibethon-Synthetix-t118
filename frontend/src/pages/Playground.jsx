import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { Play, RotateCcw, Copy, Check, Terminal as TerminalIcon } from 'lucide-react';
import { executeCode } from '../api/client';

const Playground = () => {
  const [code, setCode] = useState('import numpy as np\n\n# Let\'s create a simple array and calculate mean\ndata = [1, 5, 10, 15, 20]\nmean = sum(data) / len(data)\n\nprint(f"Dataset: {data}")\nprint(f"The Mean is: {mean}")');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await executeCode(code);
      if (result.error) {
        setError(result.error);
        setOutput('');
      } else {
        setOutput(result.output);
        setError(null);
      }
    } catch (err) {
      setError("Failed to connect to the backend server. Make sure it's running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const resetCode = () => {
    setCode('# Write your Python code here\nprint("Hello, AI Learner!")');
    setOutput('');
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen pl-64 p-8 bg-slate-900 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Python Playground</h1>
          <p className="text-slate-400">Experiment with AIML concepts using code</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={resetCode}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
          >
            <RotateCcw size={18} />
            Reset
          </button>
          <button 
            onClick={handleRun}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play size={18} fill="currentColor" />
            )}
            Run Code
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div className="flex flex-col glass rounded-2xl overflow-hidden border border-white/5">
          <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Editor (main.py)</span>
          </div>
          <div className="flex-1 overflow-auto text-base">
            <CodeMirror
              value={code}
              height="100%"
              theme="dark"
              extensions={[python()]}
              onChange={(value) => setCode(value)}
              className="h-full"
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col glass rounded-2xl overflow-hidden border border-white/5 bg-slate-950/50">
          <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center gap-2">
            <TerminalIcon size={14} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Console Output</span>
          </div>
          <div className="flex-1 p-6 font-mono text-sm overflow-auto">
            {error ? (
              <div className="text-red-400 bg-red-400/10 p-4 rounded-lg border border-red-400/20">
                <p className="font-bold mb-1">Error:</p>
                <p>{error}</p>
              </div>
            ) : output ? (
              <pre className="text-green-300 whitespace-pre-wrap">{output}</pre>
            ) : (
              <p className="text-slate-600 italic">Run your code to see the output here...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
