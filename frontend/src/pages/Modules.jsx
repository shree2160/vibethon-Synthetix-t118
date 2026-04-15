import React, { useEffect, useState } from 'react';
import { Book, CheckCircle2, Lock, ArrowRight, Filter, Loader2 } from 'lucide-react';
import { supabase } from '../api/supabase';

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const { data, error } = await supabase
          .from('modules')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        setModules(data || []);
      } catch (err) {
        console.error("Error fetching modules:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pl-64 bg-slate-900">
        <Loader2 className="text-primary animate-spin mb-4" size={40} />
        <p className="text-slate-400 font-medium tracking-wide">Loading Curriculum...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen pl-64 p-8 bg-slate-900">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Learning Modules</h1>
          <p className="text-slate-400">Master AIML step-by-step with structured content</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-slate-400">
            <Filter size={18} />
            <span className="text-sm font-medium">Filter by Level</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.length > 0 ? (
          modules.map((m) => (
            <div 
              key={m.id} 
              className={`group relative glass rounded-3xl p-6 border ${m.locked ? 'border-white/5 opacity-70' : 'border-white/10 hover:border-primary/50'} transition-all duration-300 flex flex-col`}
            >
              {m.locked && (
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] rounded-3xl z-10 flex items-center justify-center">
                  <div className="bg-slate-900 p-3 rounded-2xl border border-white/10 text-slate-500">
                    <Lock size={24} />
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${m.completed ? 'bg-green-400/10 text-green-400' : 'bg-primary/10 text-primary'}`}>
                  {m.completed ? <CheckCircle2 size={24} /> : <Book size={24} />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                  m.level === 'Beginner' ? 'bg-blue-400/10 text-blue-400' : 
                  m.level === 'Intermediate' ? 'bg-purple-400/10 text-purple-400' : 
                  'bg-pink-400/10 text-pink-400'
                }`}>
                  {m.level}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{m.title}</h3>
              <p className="text-sm text-slate-400 mb-6 flex-1">{m.description}</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-500">Progress</span>
                  <span className="text-white">{m.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${m.completed ? 'bg-green-400' : 'bg-primary'} rounded-full transition-all duration-1000`} style={{ width: `${m.progress}%` }}></div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500 font-medium">{m.duration}</span>
                  {!m.locked && (
                    <button className="flex items-center gap-1 text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                      {m.completed ? 'Review' : 'Continue'}
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 glass rounded-3xl border border-dashed border-white/10 text-center">
            <Book className="mx-auto text-slate-600 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No Modules Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">The curriculum is currently empty. Start by adding modules to your Supabase 'modules' table.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modules;
