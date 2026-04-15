import React, { useState } from 'react';
import { Brain, Send, BarChart3, Info, AlertCircle } from 'lucide-react';
import { analyzeSentiment } from '../api/client';

const Simulations = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSimulate = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeSentiment(text);
      setResult(data);
    } catch (err) {
      setError("Failed to connect to the simulation service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (classification) => {
    switch (classification) {
      case 'Positive': return 'text-green-400';
      case 'Negative': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getSentimentBg = (classification) => {
    switch (classification) {
      case 'Positive': return 'bg-green-400/10 border-green-400/20';
      case 'Negative': return 'bg-red-400/10 border-red-400/20';
      default: return 'bg-blue-400/10 border-blue-400/20';
    }
  };

  return (
    <div className="flex flex-col min-h-screen pl-64 p-8 bg-slate-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Simulations</h1>
        <p className="text-slate-400">See AI in action with real-time Sentiment Analysis</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Card */}
        <div className="flex flex-col glass rounded-3xl p-8 border border-white/5 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 rounded-xl text-primary">
              <Brain size={24} />
            </div>
            <h2 className="text-xl font-semibold text-white">Sentiment Analyzer</h2>
          </div>
          
          <p className="text-slate-400 mb-6 text-sm leading-relaxed">
            Enter any sentence or paragraph, and our AI will analyze its tone, emotion, and objectivity. This demonstrates standard Natural Language Processing (NLP) techniques.
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="E.g., I absolutely love learning about Machine Learning! It's so fascinating."
            className="w-full h-48 bg-slate-800/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none mb-6"
          />

          <button
            onClick={handleSimulate}
            disabled={loading || !text.trim()}
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-blue-600 text-white rounded-2xl font-bold transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Analyze Sentiment
                <Send size={18} />
              </>
            )}
          </button>
        </div>

        {/* Result Card */}
        <div className="flex flex-col gap-6">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-400/10 border border-red-400/20 rounded-2xl text-red-400">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {!result && !loading && (
            <div className="h-full glass rounded-3xl p-12 flex flex-col items-center justify-center text-center border border-dashed border-white/10">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-500">
                <BarChart3 size={40} />
              </div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No results yet</h3>
              <p className="text-slate-500 text-sm max-w-xs">
                Enter text in the analyzer to see the AI's interpretation and scores.
              </p>
            </div>
          )}

          {result && (
            <div className={`glass rounded-3xl p-8 border ${getSentimentBg(result.classification)} transition-all duration-500 animate-in fade-in slide-in-from-bottom-4`}>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-semibold text-white">Analysis Results</h3>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getSentimentBg(result.classification)} ${getSentimentColor(result.classification)}`}>
                  {result.classification}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-slate-400">Polarity</span>
                    <span className={`text-xl font-bold ${getSentimentColor(result.classification)}`}>
                      {(result.polarity * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${result.polarity >= 0 ? 'bg-green-400' : 'bg-red-400'} transition-all duration-1000`} 
                      style={{ width: `${Math.abs(result.polarity) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Negative to Positive scale</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-slate-400">Subjectivity</span>
                    <span className="text-xl font-bold text-blue-400">
                      {(result.subjectivity * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-400 transition-all duration-1000" 
                      style={{ width: `${result.subjectivity * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Objective to Subjective scale</p>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-3">
                <Info size={18} className="text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-slate-400 leading-relaxed italic">
                  "{text}"
                </p>
              </div>
            </div>
          )}
          
          <div className="glass rounded-3xl p-6 border border-white/5">
            <h4 className="text-sm font-semibold text-white mb-3">What are these metrics?</h4>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-primary mr-2 uppercase">Polarity:</span>
                <span className="text-xs text-slate-400">Measures how positive or negative the text is (range -1 to 1).</span>
              </div>
              <div>
                <span className="text-xs font-bold text-blue-400 mr-2 uppercase">Subjectivity:</span>
                <span className="text-xs text-slate-400">Measures amount of personal opinion vs factual information (range 0 to 1).</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulations;
