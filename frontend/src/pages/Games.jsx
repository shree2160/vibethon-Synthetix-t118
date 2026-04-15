import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  ArrowLeft, 
  Layers, 
  ChevronRight, 
  Play, 
  Database, 
  BarChart3, 
  Network,
  GitFork,
  CheckCircle2,
  AlertTriangle,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Target,
  Activity,
  ArrowRight,
  Cpu,
  Zap,
  Terminal,
  Calculator,
  Workflow
} from 'lucide-react';

// --- DATASET GENERATORS ---
const generateTreeDataset = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i,
    feature_color: Math.random() > 0.5 ? 'Red' : 'Blue',
    feature_shape: Math.random() > 0.4 ? 'Circle' : 'Square',
    label: '' 
  })).map(item => ({
    ...item,
    label: (item.feature_color === 'Red' && item.feature_shape === 'Circle') || 
           (item.feature_color === 'Blue' && item.feature_shape === 'Square') ? 'Positive' : 'Negative'
  }));
};

const generateClassificationPackets = () => {
  const templates = [
    { text: "URGENT: Your account has been compromised! Click here.", isSpam: true },
    { text: "Meeting scheduled for Thursday at 2 PM.", isSpam: false },
    { text: "CONGRATULATIONS! You won $1,000,000 gift card!!!", isSpam: true },
    { text: "Hey, are we still on for lunch today?", isSpam: false },
    { text: "Invoice #4920 is attached for your review.", isSpam: false },
    { text: "Final Notice: Tax debt collection initiated.", isSpam: true },
    { text: "New comment on your recent code commit.", isSpam: false },
    { text: "Get rich quick with this one simple trick!", isSpam: true },
  ];
  return templates.sort(() => Math.random() - 0.5);
};

// --- MATH UTILS ---
const calculateEntropy = (data) => {
  if (data.length === 0) return 0;
  const pos = data.filter(d => d.label === 'Positive').length;
  const neg = data.length - pos;
  const pPos = pos / data.length;
  const pNeg = neg / data.length;
  return parseFloat(((pPos === 0 || pPos === 1 ? 0 : -pPos * Math.log2(pPos)) + 
                     (pNeg === 0 || pNeg === 1 ? 0 : -pNeg * Math.log2(pNeg))).toFixed(3));
};

const sigmoid = (x) => 1 / (1 + Math.exp(-x));

const Games = () => {
  const [view, setView] = useState('hub');
  const [sessionXP, setSessionXP] = useState(0);

  // --- GAME 1 STATE (TREE) ---
  const [treeDataset, setTreeDataset] = useState([]);
  const [tree, setTree] = useState(null);

  // --- GAME 2 STATE (CLASSIFICATION) ---
  const [packets, setPackets] = useState([]);
  const [packetIndex, setPacketIndex] = useState(0);
  const [matrix, setMatrix] = useState({ tp: 0, tn: 0, fp: 0, fn: 0 });
  const [classGameEnded, setClassGameEnded] = useState(false);

  // --- GAME 3 STATE (NEURAL) ---
  const [nnWeights, setNnWeights] = useState({ w1: 0.5, w2: -0.2, bias: 0.1 });
  const [nnInput, setNnInput] = useState({ x1: 1, x2: 0 });
  const [nnTarget, setNnTarget] = useState(0.8);
  const [isTraining, setIsTraining] = useState(false);

  // --- ACTIONS ---
  const startTreeSim = () => {
    const data = generateTreeDataset();
    setTreeDataset(data);
    setTree({ name: 'Root Node', data: data, feature: null, children: [] });
    setView('tree');
  };

  const startClassificationSim = () => {
    setPackets(generateClassificationPackets());
    setPacketIndex(0);
    setMatrix({ tp: 0, tn: 0, fp: 0, fn: 0 });
    setClassGameEnded(false);
    setView('classification');
  };

  const startNeuralSim = () => {
    setNnWeights({ w1: Math.random(), w2: Math.random(), bias: Math.random() });
    setNnTarget(Math.random() > 0.5 ? 0.9 : 0.1);
    setView('neural');
  };

  const trainPerceptron = () => {
    setIsTraining(true);
    let currentW = { ...nnWeights };
    const learningRate = 0.5;
    
    // Simulate one step of gradient descent
    setTimeout(() => {
        const dotProduct = (nnInput.x1 * currentW.w1) + (nnInput.x2 * currentW.w2) + currentW.bias;
        const pred = sigmoid(dotProduct);
        const error = nnTarget - pred;
        
        const newW = {
            w1: currentW.w1 + (error * nnInput.x1 * learningRate),
            w2: currentW.w2 + (error * nnInput.x2 * learningRate),
            bias: currentW.bias + (error * learningRate)
        };
        
        setNnWeights(newW);
        setIsTraining(false);
        setSessionXP(s => s + 50);
    }, 800);
  };

  // --- SUB-VIEWS ---

  const NeuralSim = () => {
    const dotProduct = (nnInput.x1 * nnWeights.w1) + (nnInput.x2 * nnWeights.w2) + nnWeights.bias;
    const prediction = sigmoid(dotProduct);
    const loss = Math.pow(nnTarget - prediction, 2).toFixed(4);

    return (
        <div className="flex flex-col w-full max-w-6xl animate-in fade-in zoom-in duration-500">
            <div className="grid grid-cols-12 gap-8">
                {/* Main Circuit Board */}
                <div className="col-span-12 lg:col-span-8 glass border border-white/10 rounded-[40px] p-10 bg-slate-950/40 min-h-[600px] flex flex-col items-center justify-center relative">
                    <div className="absolute top-10 left-10">
                        <p className="text-primary font-mono text-[10px] uppercase tracking-[0.3em] mb-2 font-black text-blue-400">Layer: Output Perceptron v1.0</p>
                        <h2 className="text-4xl font-black text-white italic underline decoration-primary/40 underline-offset-8">Neural Engine Lab</h2>
                    </div>

                    <div className="relative w-full flex items-center justify-center h-full pt-10">
                        {/* Inputs */}
                        <div className="absolute left-10 space-y-32">
                            <div className="glass border border-white/10 p-4 rounded-2xl w-24 text-center">
                                <p className="text-[10px] text-slate-500 font-bold mb-1">X1</p>
                                <p className="text-xl font-black">{nnInput.x1}</p>
                            </div>
                            <div className="glass border border-white/10 p-4 rounded-2xl w-24 text-center">
                                <p className="text-[10px] text-slate-500 font-bold mb-1">X2</p>
                                <p className="text-xl font-black">{nnInput.x2}</p>
                            </div>
                        </div>

                        {/* Synapses (Paths) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                            <line x1="160" y1="35%" x2="50%" y2="50%" stroke="white" strokeWidth="2" />
                            <line x1="160" y1="65%" x2="50%" y2="50%" stroke="white" strokeWidth="2" />
                        </svg>

                        {/* Neuron Node */}
                        <div className={`w-48 h-48 rounded-full glass border-4 flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl relative z-10 ${isTraining ? 'border-primary animate-pulse scale-110 shadow-primary/40' : 'border-white/20'}`}>
                            <Calculator className="text-slate-500 mb-2" size={24} />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Sigmoid</p>
                            <p className="text-3xl font-black text-white">{prediction.toFixed(2)}</p>
                            <div className="absolute -bottom-10 whitespace-nowrap">
                                <div className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black rounded-full uppercase tracking-tighter">Activation Layer</div>
                            </div>
                        </div>

                        {/* Output */}
                        <div className="absolute right-10">
                             <div className="text-center">
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Target Output</p>
                                <div className={`w-32 h-32 rounded-3xl glass border-2 flex items-center justify-center transition-all ${Math.abs(prediction - nnTarget) < 0.1 ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-white/10 text-white'}`}>
                                    <p className="text-4xl font-black">{nnTarget}</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Weights & Biases Controls */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="glass p-8 rounded-[40px] bg-slate-900 border border-white/10">
                        <h3 className="text-xl font-black mb-8 flex items-center gap-2 italic uppercase tracking-tighter text-slate-400">
                           <Workflow size={20} /> Parameter Matrix
                        </h3>
                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-3">
                                    <span>Weight 1</span>
                                    <span className="text-primary">{nnWeights.w1.toFixed(3)}</span>
                                </div>
                                <input type="range" min="-1" max="1" step="0.01" value={nnWeights.w1} onChange={(e) => setNnWeights({...nnWeights, w1: parseFloat(e.target.value)})} className="w-full h-1.5 accent-primary bg-white/5 rounded-full appearance-none cursor-pointer" />
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-3">
                                    <span>Weight 2</span>
                                    <span className="text-primary">{nnWeights.w2.toFixed(3)}</span>
                                </div>
                                <input type="range" min="-1" max="1" step="0.01" value={nnWeights.w2} onChange={(e) => setNnWeights({...nnWeights, w2: parseFloat(e.target.value)})} className="w-full h-1.5 accent-primary bg-white/5 rounded-full appearance-none cursor-pointer" />
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-3">
                                    <span>Bias Component</span>
                                    <span className="text-primary">{nnWeights.bias.toFixed(3)}</span>
                                </div>
                                <input type="range" min="-1" max="1" step="0.01" value={nnWeights.bias} onChange={(e) => setNnWeights({...nnWeights, bias: parseFloat(e.target.value)})} className="w-full h-1.5 accent-primary bg-white/5 rounded-full appearance-none cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    {/* Loss Monitor */}
                    <div className="glass p-8 rounded-[40px] bg-gradient-to-br from-red-500/10 to-transparent border border-white/10">
                        <h4 className="font-bold mb-2 flex items-center gap-2 text-red-400 uppercase text-xs tracking-widest">
                            <Activity size={18} /> Error Gradient (MSE)
                        </h4>
                        <p className="text-4xl font-black text-white font-mono">{loss}</p>
                        <p className="text-[10px] text-slate-500 mt-2 italic leading-relaxed">Training aims to minimize this loss value through weight refinement.</p>
                    </div>

                    <button 
                        onClick={trainPerceptron}
                        disabled={isTraining}
                        className={`w-full py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl ${isTraining ? 'bg-slate-800 text-slate-600' : 'bg-white text-black hover:bg-primary hover:text-white shadow-primary/20 active:scale-95'}`}
                    >
                        {isTraining ? <Activity className="animate-spin" /> : <Zap fill="currentColor" />} {isTraining ? 'Backpropagating...' : 'Optimize Synapse'}
                    </button>
                </div>
            </div>
        </div>
    );
  };

  const ClassificationSim = () => {
    const precision = (matrix.tp / (matrix.tp + matrix.fp)) || 0;
    const recall = (matrix.tp / (matrix.tp + matrix.fn)) || 0;
    const accuracy = ((matrix.tp + matrix.tn) / packets.length) || 0;

    return (
        <div className="flex flex-col w-full max-w-6xl animate-in fade-in zoom-in duration-500">
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 glass border border-white/10 rounded-[40px] p-10 bg-slate-950/40 min-h-[500px] flex flex-col items-center justify-center relative">
                    {!classGameEnded ? (
                        <div className="w-full max-w-2xl text-center">
                            <div className="absolute top-10 left-10"><p className="text-primary text-[10px] font-black tracking-widest">SMART CLASSIFIER v2.0</p></div>
                            <div className="mb-12 glass border border-white/10 p-12 rounded-[48px] bg-slate-900 shadow-3xl">
                                <Mail size={80} className="mx-auto mb-6 text-slate-500/40" />
                                <h3 className="text-2xl font-bold text-white leading-relaxed">"{packets[packetIndex]?.text}"</h3>
                            </div>
                            <div className="flex gap-8 justify-center">
                                <button onClick={() => handleClassification(true)} className="px-12 py-6 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-3xl font-black text-xl flex items-center gap-3 transition-all active:scale-95"><ShieldAlert size={24} /> Spam</button>
                                <button onClick={() => handleClassification(false)} className="px-12 py-6 bg-green-500/20 hover:bg-green-500 text-green-500 hover:text-white border border-green-500/20 rounded-3xl font-black text-xl flex items-center gap-3 transition-all active:scale-95"><ShieldCheck size={24} /> Inbox</button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full max-w-5xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="glass p-6 rounded-3xl border border-green-500/20 bg-green-500/5"><p className="text-[10px] text-slate-500 font-black mb-1 uppercase">TP</p><p className="text-3xl font-black text-green-400">{matrix.tp}</p></div>
                                    <div className="glass p-6 rounded-3xl border border-red-500/20 bg-red-500/5"><p className="text-[10px] text-slate-500 font-black mb-1 uppercase">FP</p><p className="text-3xl font-black text-red-400">{matrix.fp}</p></div>
                                    <div className="glass p-6 rounded-3xl border border-orange-500/20 bg-orange-500/5"><p className="text-[10px] text-slate-500 font-black mb-1 uppercase">FN</p><p className="text-3xl font-black text-orange-400">{matrix.fn}</p></div>
                                    <div className="glass p-6 rounded-3xl border border-blue-500/20 bg-blue-500/5"><p className="text-[10px] text-slate-500 font-black mb-1 uppercase">TN</p><p className="text-3xl font-black text-blue-400">{matrix.tn}</p></div>
                                </div>
                                <div className="space-y-6">
                                    <div className="glass p-6 rounded-3xl border border-white/10 flex justify-between items-center"><p className="font-black italic">Precision</p><p className="text-2xl font-black text-primary">{(precision * 100).toFixed(0)}%</p></div>
                                    <div className="glass p-6 rounded-3xl border border-white/10 flex justify-between items-center"><p className="font-black italic">Recall</p><p className="text-2xl font-black text-primary">{(recall * 100).toFixed(0)}%</p></div>
                                    <div className="glass p-6 rounded-3xl border border-white/10 flex justify-between items-center"><p className="font-black italic text-lg">System Accuracy</p><p className="text-3xl font-black text-green-400">{(accuracy * 100).toFixed(0)}%</p></div>
                                    <button onClick={startClassificationSim} className="w-full py-5 bg-white text-black font-black rounded-3xl flex items-center justify-center gap-3">Re-train</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
  };

  const TreeSim = () => (
    <div className="flex flex-col w-full max-w-6xl animate-in fade-in zoom-in duration-500">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 glass border border-white/10 rounded-[40px] p-10 bg-slate-950/40 min-h-[600px] flex flex-col items-center justify-center relative">
          <div className="absolute top-10 left-10"><p className="text-primary text-[10px] font-black tracking-widest">TREE OPTIMIZER v1.2</p></div>
          <div className="space-y-20 w-full flex flex-col items-center">
            <div className="w-64 glass border-2 border-primary/40 p-6 rounded-3xl text-center shadow-3xl"><p className="text-xl font-black">{tree.feature ? `Split: ${tree.feature}` : 'Ready for Split'}</p></div>
            <div className="grid grid-cols-2 gap-10 w-full">
                {tree.children.map((child, i) => (
                    <div key={i} className={`glass p-6 rounded-3xl border ${calculateEntropy(child.data) === 0 ? 'border-green-500/40' : 'border-white/10'}`}><p className="text-lg font-black italic">Entropy: {calculateEntropy(child.data)}</p></div>
                ))}
            </div>
            {!tree.feature && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm rounded-[40px] z-20">
                    <div className="text-center p-10 glass border border-white/10 rounded-[40px] shadow-3xl">
                        <button onClick={() => performTreeSplit('feature_color')} className="w-full mb-4 py-4 bg-primary text-white rounded-2xl font-black">Split by Color</button>
                        <button onClick={() => performTreeSplit('feature_shape')} className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-black">Split by Shape</button>
                    </div>
                </div>
            )}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 glass p-8 rounded-[40px] bg-slate-900 border border-white/10">
            <h3 className="font-black mb-4 flex items-center gap-2 italic uppercase text-slate-500 tracking-tighter text-sm"><Database size={16} /> Dataset Monitor</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {treeDataset.map(row => (
                    <div key={row.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center text-[10px] font-black uppercase">
                        <div className="flex gap-4 items-center"><div className={`w-2 h-2 rounded-full ${row.feature_color === 'Red' ? 'bg-red-500' : 'bg-blue-500'}`} /><span>{row.feature_shape}</span></div>
                        <span className={row.label === 'Positive' ? 'text-green-400' : 'text-red-400'}>{row.label}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );

  const handleClassification = (choiceIsSpam) => {
    const current = packets[packetIndex];
    const actualIsSpam = current.isSpam;
    setMatrix(p => ({
        tp: p.tp + (choiceIsSpam && actualIsSpam ? 1 : 0),
        tn: p.tn + (!choiceIsSpam && !actualIsSpam ? 1 : 0),
        fp: p.fp + (choiceIsSpam && !actualIsSpam ? 1 : 0),
        fn: p.fn + (!choiceIsSpam && actualIsSpam ? 1 : 0)
    }));
    if (packetIndex < packets.length - 1) setPacketIndex(packetIndex + 1);
    else { setClassGameEnded(true); setSessionXP(s => s + 300); }
  };

  const performTreeSplit = (feature) => {
    if (tree.feature) return;
    const values = feature === 'feature_color' ? ['Red', 'Blue'] : ['Circle', 'Square'];
    const children = values.map(val => ({ name: `${feature}: ${val}`, data: tree.data.filter(d => d[feature] === val), feature: null, children: [] }));
    const infoGain = calculateEntropy(tree.data) - children.reduce((acc, c) => acc + (c.data.length / tree.data.length) * calculateEntropy(c.data), 0);
    setTree({ ...tree, feature, infoGain, children });
    setSessionXP(s => s + (infoGain > 0.5 ? 200 : 50));
  };

  const Hub = () => (
    <div className="flex flex-col w-full pl-64 bg-slate-900 min-h-screen text-white overflow-y-auto pb-20">
      <div className="p-10 bg-gradient-to-b from-primary/10 to-transparent">
        <h1 className="text-8xl font-black tracking-tighter mb-4 italic uppercase">Sim-Centre Pro</h1>
        <p className="text-slate-400 text-xl font-medium max-w-3xl mb-12 italic leading-relaxed">The elite neural simulation ecosystem for advanced machine learning researchers. Architect models, evaluate performance, and optimize weights in a high-fidelity sandbox.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { title: 'Tree Lab', icon: <GitFork />, color: 'primary', action: startTreeSim, desc: 'Information Theory & Entropy Architecture.' },
                { title: 'Classifier Hub', icon: <Target />, color: 'indigo-400', action: startClassificationSim, desc: 'Model Evaluation & Confusion Matrices.' },
                { title: 'Neural Engine', icon: <Cpu />, color: 'purple-400', action: startNeuralSim, desc: 'Backpropagation & Gradient Descent Lab.' }
            ].map((sim, i) => (
                <div key={i} onClick={sim.action} className="glass p-10 rounded-[52px] border border-white/10 hover:border-white/20 transition-all cursor-pointer group hover:-translate-y-4 shadow-3xl bg-slate-950/40 relative overflow-hidden">
                    <div className={`w-16 h-16 bg-white/5 text-white flex items-center justify-center rounded-3xl mb-8 group-hover:scale-110 transition-transform group-hover:bg-primary/20 group-hover:text-primary`}>
                        {sim.icon}
                    </div>
                    <h3 className="text-3xl font-black mb-2 italic uppercase tracking-tighter underline underline-offset-4 decoration-white/10">{sim.title}</h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{sim.desc}</p>
                    <div className="mt-10 flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] group-hover:text-white transition-colors">Start Simulation</span>
                         <ArrowRight size={20} className="text-slate-700 group-hover:text-primary group-hover:translate-x-3 transition-all" />
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-900 min-h-screen">
      {view === 'hub' ? <Hub /> : (
        <div className="flex flex-col min-h-screen pl-64 bg-slate-900 text-white overflow-hidden">
          <header className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-950/20 backdrop-blur-md sticky top-0 z-50">
            <button onClick={() => setView('hub')} className="flex items-center gap-3 text-slate-400 hover:text-white font-black uppercase text-[10px] tracking-[0.3em] transition-all">
                <ArrowLeft size={18} /> Disconnect Sim
            </button>
            <div className="text-right">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-1 italic">Simulation Score</p>
                <p className="text-2xl font-black text-primary font-mono tracking-tighter">+{sessionXP} XP</p>
            </div>
          </header>
          <main className="flex-1 flex items-center justify-center p-10 overflow-y-auto">
             {view === 'tree' && <TreeSim />}
             {view === 'classification' && <ClassificationSim />}
             {view === 'neural' && <NeuralSim />}
          </main>
        </div>
      )}
    </div>
  );
};

export default Games;
