import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Zap, 
  ArrowLeft, 
  Target,
  LineChart,
  Cpu,
  ShieldCheck,
  Terminal,
  Activity,
  Layers,
  ChevronRight,
  Play,
  Settings,
  Binary,
  Circle,
  Square,
  Scan,
  Network
} from 'lucide-react';

const Games = () => {
  const [view, setView] = useState('hub'); // 'hub', 'tree', 'classification', 'neural'
  const [sessionScore, setSessionScore] = useState(0);

  // --- GAME 1: ENTROPY SPLIT (DECISION TREES) ---
  const DecisionTreeGame = () => {
    const [points, setPoints] = useState([]);
    const [message, setMessage] = useState("Scan the data nodes and select the optimal split feature.");

    const generate = () => {
      const p = [];
      for(let i=0; i<8; i++) p.push({ id: i, type: Math.random() > 0.5 ? 'ALPHA' : 'BETA', status: Math.random() > 0.5 ? 'ACTIVE' : 'STABLE' });
      setPoints(p);
    };

    useEffect(() => {
        generate();
    }, []);

    const split = (feat) => {
        const val = feat === 'type' ? 'ALPHA' : 'ACTIVE';
        const gA = points.filter(x => x[feat] === val);
        const gB = points.filter(x => x[feat] !== val);
        
        const typesA = gA.map(x => x.type);
        const typesB = gB.map(x => x.type);
        
        const pA = typesA.every(t => t === typesA[0]) || typesA.length === 0;
        const pB = typesB.every(t => t === typesB[0]) || typesB.length === 0;

        if (pA && pB) {
            setSessionScore(s => s + 100);
            setMessage("Symmetry Detected. Data Purified! +100 XP");
            setTimeout(() => { generate(); setMessage("Awaiting next data packet..."); }, 1500);
        } else {
            setMessage("High Entropy! Split is inefficient. Try again.");
        }
    };

    return (
        <div className="flex flex-col items-center gap-10 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
                <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-2">Algorithm: C4.5 Optimizer</p>
                <h2 className="text-4xl font-black text-white">Entropy Splitter</h2>
                <p className="text-slate-500 mt-2 font-medium">{message}</p>
            </div>

            <div className="grid grid-cols-4 gap-6 p-12 glass border border-white/10 rounded-[60px] bg-slate-950/40">
                {points.map(p => (
                    <div key={p.id} className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                        p.type === 'ALPHA' ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-indigo-500 bg-indigo-500/10 text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                    }`}>
                        {p.status === 'ACTIVE' ? <Circle size={28} /> : <Square size={28} />}
                    </div>
                ))}
            </div>

            <div className="flex gap-6">
                <button onClick={() => split('type')} className="px-10 py-5 glass border border-white/10 rounded-2xl font-black hover:border-primary transition-all flex items-center gap-3 active:scale-95">
                    Split by Node Type
                </button>
                <button onClick={() => split('status')} className="px-10 py-5 glass border border-white/10 rounded-2xl font-black hover:border-indigo-400 transition-all flex items-center gap-3 active:scale-95">
                    Split by Node Status
                </button>
            </div>
        </div>
    );
  };

  // --- GAME 2: VISION COMBAT (CLASSIFICATION) ---
  const ClassificationGame = () => {
    const [target, setTarget] = useState(null);
    const [time, setTime] = useState(20);
    const [active, setActive] = useState(true);

    const spawn = () => {
        const isAnomaly = Math.random() > 0.5;
        setTarget({ isAnomaly, label: isAnomaly ? 'ANOMALY DETECTED' : 'STABLE PACKET' });
    };

    useEffect(() => {
        spawn();
        const t = setInterval(() => {
            setTime(v => {
                if(v <= 1) { setActive(false); clearInterval(t); return 0; }
                return v - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, []);

    const classify = (choice) => {
        if(!target) return;
        if(choice === target.isAnomaly) { setSessionScore(s => s + 20); spawn(); }
        else { setTime(v => Math.max(0, v - 2)); spawn(); }
    };

    if(!active) return (
        <div className="text-center p-16 glass rounded-[60px] border border-white/10 animate-in zoom-in">
            <Trophy size={80} className="text-yellow-500 mx-auto mb-6" />
            <h2 className="text-5xl font-black mb-4">Transmission Ended</h2>
            <p className="text-slate-400 text-xl mb-10">Capture Accuracy Score: {sessionScore}</p>
            <button onClick={() => { setView('hub'); setSessionScore(0); }} className="px-12 py-5 bg-primary rounded-2xl font-black shadow-2xl">Return to Hub</button>
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-12 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between w-full items-end">
                <div>
                   <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Time Remaining</p>
                   <p className={`text-4xl font-black font-mono ${time < 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{time}s</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Score</p>
                   <p className="text-4xl font-black text-primary font-mono">{sessionScore}</p>
                </div>
            </div>

            <div className="w-full aspect-video glass rounded-[48px] border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid-white/[0.02]" />
                <Scan size={100} className="text-primary/10 absolute animate-pulse scale-150" />
                <div className={`text-4xl font-black italic tracking-tighter ${target?.isAnomaly ? 'text-red-500' : 'text-green-400'} relative z-10`}>
                    {target?.label}
                </div>
                <div className="mt-6 relative z-10">
                    <Activity className={target?.isAnomaly ? 'text-red-500' : 'text-green-400'} size={32} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 w-full">
                <button onClick={() => classify(true)} className="py-8 bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-[32px] font-black text-2xl transition-all shadow-xl text-red-500 hover:text-white">
                    DENY (ANOMALY)
                </button>
                <button onClick={() => classify(false)} className="py-8 bg-green-500/10 hover:bg-green-400 border border-green-400/20 rounded-[32px] font-black text-2xl transition-all shadow-xl text-green-400 hover:text-white">
                    ALLOW (STABLE)
                </button>
            </div>
        </div>
    );
  };

  // --- GAME 3: NEURO-LINK (NEURAL NETS) ---
  const NeuroLinkGame = () => {
    const [lr, setLr] = useState(0.01);
    const [power, setPower] = useState(0);

    return (
        <div className="flex flex-col items-center gap-10 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
                <h2 className="text-4xl font-black mb-2">Neuro-Link Tuner</h2>
                <p className="text-slate-500 font-medium">Calibrate neural weights to stabilize the synapse link.</p>
            </div>

            <div className="grid grid-cols-12 gap-8 w-full mt-8">
                <div className="col-span-12 lg:col-span-8 h-[400px] glass rounded-[50px] border border-white/10 p-12 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    <div className="relative z-10 w-full flex justify-between items-center px-12">
                        <div className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                            <Cpu className="text-primary" />
                        </div>
                        <div className="flex-1 h-1 bg-slate-800 mx-8 relative overflow-hidden">
                            <div className="h-full bg-primary animate-pulse" style={{ width: `${lr * 500}%` }} />
                        </div>
                        <div className="w-20 h-20 rounded-full border-4 border-indigo-400 flex items-center justify-center shadow-[0_0_30px_rgba(129,140,248,0.5)]">
                            <Binary className="text-indigo-400" />
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 glass rounded-[50px] border border-white/10 p-10 bg-slate-900/50 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold mb-8 uppercase text-xs tracking-widest text-slate-500">Manual Control</h3>
                        <div className="space-y-10">
                            <div>
                                <label className="flex justify-between text-xs font-bold mb-4">
                                    <span>Synapse Learning Rate</span>
                                    <span className="text-primary">{lr}</span>
                                </label>
                                <input type="range" min="0.001" max="0.1" step="0.001" value={lr} onChange={(e) => setLr(parseFloat(e.target.value))} className="w-full h-1.5 accent-primary bg-white/5 rounded-full appearance-none cursor-pointer" />
                            </div>
                            <div>
                                <label className="flex justify-between text-xs font-bold mb-4">
                                    <span>Signal Power</span>
                                    <span className="text-indigo-400">{power}%</span>
                                </label>
                                <input type="range" min="0" max="100" value={power} onChange={(e) => setPower(e.target.value)} className="w-full h-1.5 accent-indigo-400 bg-white/5 rounded-full appearance-none cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    <button 
                      onClick={() => setSessionScore(s => s + 50)}
                      className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all mt-10"
                    >
                        Synchronize Core
                    </button>
                </div>
            </div>
        </div>
    );
  };

  if (view === 'hub') {
    return (
      <div className="flex flex-col min-h-screen pl-64 bg-slate-900 text-white pb-20 overflow-y-auto">
        <div className="p-10 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="mb-12">
            <h1 className="text-6xl font-black tracking-tighter mb-4 italic uppercase">Sim-Centre Pro</h1>
            <p className="text-slate-400 text-xl font-medium max-w-xl">Advanced simulation environment for neural systems engineering.</p>
          </div>

          <div className="w-full glass border border-white/10 rounded-[48px] p-12 flex flex-col lg:flex-row items-center gap-10 bg-slate-950/40 mb-12 group hover:border-primary/30 transition-all">
              <div className="w-full lg:w-1/2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Featured Simulation</div>
                  <h2 className="text-5xl font-black mb-6 leading-tight">Neural Synapse<br/>Linkage Lab</h2>
                  <p className="text-slate-400 text-lg mb-8">Direct control over neural weight distribution. Master the fundamental math of backpropagation.</p>
                  <button onClick={() => setView('neural')} className="px-10 py-5 bg-primary text-white rounded-2xl font-black flex items-center gap-3 hover:bg-blue-600 transition-all shadow-2xl shadow-primary/20">
                      Initialize Core <ChevronRight size={20} />
                  </button>
              </div>
              <div className="flex-1 w-full max-w-md hidden lg:flex items-center justify-center">
                  <div className="aspect-square w-64 glass rounded-full border-4 border-white/10 flex items-center justify-center relative shadow-3xl">
                       <Network size={80} className="text-primary animate-pulse" />
                       <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping duration-[3s]" />
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div onClick={() => setView('tree')} className="glass p-10 rounded-[48px] border border-white/10 hover:border-primary transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Layers size={32} />
                  </div>
                  <h3 className="text-3xl font-black mb-2 tracking-tight">Entropy Splitter</h3>
                  <p className="text-slate-400 mb-8 font-medium">Master Decision Tree splitting logic. Purify data nodes to zero entropy.</p>
                  <div className="flex items-center gap-2 text-primary uppercase text-xs font-black tracking-widest font-mono"> Launch Sub-Sim <ArrowRight size={16} /></div>
              </div>

              <div onClick={() => setView('classification')} className="glass p-10 rounded-[48px] border border-white/10 hover:border-red-500 transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-red-400/10 text-red-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Scan size={32} />
                  </div>
                  <h3 className="text-3xl font-black mb-2 tracking-tight">Vision Combat</h3>
                  <p className="text-slate-400 mb-8 font-medium">Fast-paced classification under pressure. Detect anomalies in the transmission stream.</p>
                  <div className="flex items-center gap-2 text-red-500 uppercase text-xs font-black tracking-widest font-mono"> Launch Sub-Sim <ArrowRight size={16} /></div>
              </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white pb-20 overflow-y-auto">
      <header className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-950/20 backdrop-blur-md sticky top-0 z-50 pl-72">
            <button onClick={() => setView('hub')} className="flex items-center gap-3 text-slate-400 hover:text-white font-black uppercase text-xs tracking-widest transition-all">
                <ArrowLeft size={18} /> Disconnect Sim
            </button>
            <div className="text-right">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Session Data Transmitted</p>
                <p className="text-2xl font-black text-primary font-mono">{sessionScore} XP</p>
            </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-10 pl-72">
        {view === 'tree' && <DecisionTreeGame />}
        {view === 'classification' && <ClassificationGame />}
        {view === 'neural' && <NeuroLinkGame />}
      </main>
    </div>
  );
};

export default Games;
