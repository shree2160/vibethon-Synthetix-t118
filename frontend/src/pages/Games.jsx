import React, { useState } from 'react';
import { Target, Info, RefreshCw, Trophy, Zap, AlertTriangle } from 'lucide-react';

const Game = () => {
  const [score, setScore] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const items = [
    { text: "Predicting house prices based on size", category: "Regression" },
    { text: "Filtering emails into spam or not spam", category: "Classification" },
    { text: "Grouping customers by shopping habits", category: "Clustering" },
    { text: "Tagging objects in a video stream", category: "Classification" },
    { text: "Estimating future stock market trends", category: "Regression" },
    { text: "Identifying distinct types of flowers in a dataset", category: "Clustering" },
  ];

  const categories = ["Regression", "Classification", "Clustering"];

  const handleGuess = (category) => {
    if (feedback) return;

    const isCorrect = category === items[currentIdx].category;
    if (isCorrect) {
      setScore(score + 100);
      setFeedback({ type: 'correct', message: 'Correct! +100 XP' });
    } else {
      setFeedback({ type: 'incorrect', message: `Oops! That's actually ${items[currentIdx].category}.` });
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIdx < items.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        setFinished(true);
      }
    }, 1500);
  };

  const resetGame = () => {
    setScore(0);
    setCurrentIdx(0);
    setFinished(false);
    setFeedback(null);
  };

  return (
    <div className="flex flex-col min-h-screen pl-64 p-8 bg-slate-900">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mini-Games</h1>
          <p className="text-slate-400">Learn AIML concepts through interactive challenges</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score</p>
            <p className="text-xl font-bold text-primary">{score}</p>
          </div>
          <Trophy className="text-yellow-400" size={24} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        {!finished ? (
          <div className="glass rounded-[40px] p-12 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${((currentIdx + 1) / items.length) * 100}%` }}
              />
            </div>

            <div className="mb-12 flex justify-between items-center">
              <span className="bg-slate-800 text-slate-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                Question {currentIdx + 1} of {items.length}
              </span>
              <div className="flex items-center gap-2 text-primary">
                <Target size={18} />
                <span className="text-sm font-bold">Concept Classifier</span>
              </div>
            </div>

            <div className="text-center mb-16">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Task Description</h2>
              <p className="text-3xl font-bold text-white leading-tight">
                "{items[currentIdx].text}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleGuess(cat)}
                  disabled={feedback}
                  className={`py-6 rounded-3xl font-bold text-lg transition-all duration-300 border-2 ${
                    feedback && feedback.type === 'correct' && cat === items[currentIdx].category
                      ? 'bg-green-400/20 border-green-400 text-green-400 scale-105 shadow-xl shadow-green-400/20'
                      : feedback && feedback.type === 'incorrect' && cat === cat && cat === items[currentIdx].category
                      ? 'bg-green-400/20 border-green-400 text-green-400'
                      : feedback && feedback.type === 'incorrect' && cat === cat // highlight choice if wrong
                      ? 'bg-slate-800 border-white/5 text-slate-500 opacity-50'
                      : 'bg-white/5 border-white/5 text-slate-300 hover:bg-primary/10 hover:border-primary/50 hover:text-white hover:scale-105'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {feedback && (
              <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 px-8 py-3 rounded-2xl font-bold animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                feedback.type === 'correct' ? 'bg-green-400 text-slate-900 shadow-xl shadow-green-400/40' : 'bg-red-400 text-white shadow-xl shadow-red-400/40'
              }`}>
                {feedback.message}
              </div>
            )}
          </div>
        ) : (
          <div className="glass rounded-[40px] p-16 border border-white/10 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-8 text-yellow-500 shadow-2xl shadow-yellow-400/20">
              <Trophy size={48} />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Game Completed!</h2>
            <p className="text-slate-400 text-xl mb-12">
              You've earned <span className="text-primary font-bold">{score} XP</span> for your performance.
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <button 
                onClick={resetGame}
                className="flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10"
              >
                <RefreshCw size={20} />
                Try Again
              </button>
              <button className="flex items-center justify-center gap-2 py-4 bg-primary hover:bg-blue-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary/20">
                <Zap size={20} />
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass p-6 rounded-3xl border border-white/5 flex gap-4 items-start">
            <div className="p-2 bg-blue-400/10 text-blue-400 rounded-xl">
              <Info size={20} />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">How it works</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Drag each ML scenario into its correct mathematical category. This builds intuition for model selection in real projects.
              </p>
            </div>
          </div>
          <div className="glass p-6 rounded-3xl border border-white/5 flex gap-4 items-start">
            <div className="p-2 bg-yellow-400/10 text-yellow-400 rounded-xl">
              <Trophy size={20} />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Learning Bonus</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete a game streak to earn unique badges and multiply your daily XP rewards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
