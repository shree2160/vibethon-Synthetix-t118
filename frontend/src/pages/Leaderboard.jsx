import React, { useEffect, useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Target, 
  Crown, 
  ArrowUp, 
  ArrowDown, 
  User, 
  Shield, 
  Zap,
  Loader2,
  TrendingUp,
  Award
} from 'lucide-react';
import { supabase } from '../api/supabase';

const Leaderboard = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, xp')
          .order('xp', { ascending: false });

        if (error) throw error;
        setRankings(data || []);
      } catch (err) {
        console.error("Leaderboard fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();

    // Subscribe to live XP updates across all users
    const channel = supabase
      .channel('global_leaderboard')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles' 
      }, () => {
        fetchRankings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pl-64 bg-slate-900 text-white">
        <Loader2 className="text-primary animate-spin mb-4" size={48} />
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Synchronizing Hall of Fame...</p>
      </div>
    );
  }

  const topThree = rankings.slice(0, 3);
  const others = rankings.slice(3);

  return (
    <div className="flex flex-col min-h-screen pl-64 bg-slate-900 text-white pb-20">
      <div className="p-10 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="flex justify-between items-end mb-12">
            <div>
                <h1 className="text-6xl font-black tracking-tighter mb-4 italic uppercase">Hall of Fame</h1>
                <p className="text-slate-400 text-xl font-medium max-w-xl">Global rankings of the world's most elite AIML practitioners. Scale the heights of mastery.</p>
            </div>
            <div className="p-6 glass border border-white/10 rounded-[32px] bg-slate-900/40 text-center">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Active Researchers</p>
                <p className="text-4xl font-black text-white">{rankings.length}</p>
            </div>
        </div>

        {/* Podium Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-20 max-w-5xl mx-auto px-4">
            {/* Silver - Rank 2 */}
            {topThree[1] && (
                <div className="order-2 md:order-1 flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="w-24 h-24 rounded-full glass border-4 border-slate-300 flex items-center justify-center mb-6 relative shadow-[0_0_30px_rgba(148,163,184,0.2)]">
                        <User size={40} className="text-slate-300" />
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-400 rounded-full flex items-center justify-center border-4 border-slate-900">
                            <span className="text-xs font-black">2</span>
                        </div>
                    </div>
                    <div className="glass p-6 rounded-[32px] border border-white/5 bg-slate-900 w-full text-center">
                        <p className="text-xl font-black truncate mb-1">{topThree[1].username}</p>
                        <p className="text-sm font-black text-slate-400 font-mono tracking-tighter uppercase">{topThree[1].xp.toLocaleString()} XP</p>
                    </div>
                </div>
            )}

            {/* Gold - Rank 1 */}
            {topThree[0] && (
                <div className="order-1 md:order-2 flex flex-col items-center animate-in slide-in-from-bottom-12 duration-1000">
                    <Crown size={48} className="text-yellow-400 mb-4 animate-bounce" />
                    <div className="w-32 h-32 rounded-full glass border-4 border-yellow-400 flex items-center justify-center mb-6 relative shadow-[0_0_50px_rgba(250,204,21,0.3)]">
                        <User size={60} className="text-yellow-400" />
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center border-4 border-slate-900">
                            <span className="text-sm font-black">1</span>
                        </div>
                    </div>
                    <div className="glass p-8 rounded-[40px] border border-yellow-400/20 bg-yellow-400/5 w-full text-center scale-110">
                        <p className="text-2xl font-black truncate mb-1 text-yellow-400 uppercase tracking-tighter">Grandmaster</p>
                        <p className="text-xl font-black text-white truncate mb-1">{topThree[0].username}</p>
                        <p className="text-sm font-black text-slate-500 font-mono">{topThree[0].xp.toLocaleString()} XP</p>
                    </div>
                </div>
            )}

            {/* Bronze - Rank 3 */}
            {topThree[2] && (
                <div className="order-3 md:order-3 flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-200">
                    <div className="w-24 h-24 rounded-full glass border-4 border-amber-600 flex items-center justify-center mb-6 relative shadow-[0_0_30px_rgba(217,119,6,0.2)]">
                        <User size={40} className="text-amber-600" />
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center border-4 border-slate-900">
                            <span className="text-xs font-black">3</span>
                        </div>
                    </div>
                    <div className="glass p-6 rounded-[32px] border border-white/5 bg-slate-900 w-full text-center">
                        <p className="text-xl font-black truncate mb-1">{topThree[2].username}</p>
                        <p className="text-sm font-black text-slate-400 font-mono tracking-tighter uppercase">{topThree[2].xp.toLocaleString()} XP</p>
                    </div>
                </div>
            )}
        </div>

        {/* List Section */}
        <div className="max-w-5xl mx-auto space-y-4">
            <div className="grid grid-cols-12 gap-4 px-8 text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                <div className="col-span-1">Rank</div>
                <div className="col-span-5">Researcher Candidate</div>
                <div className="col-span-3">System Status</div>
                <div className="col-span-3 text-right">Total XP</div>
            </div>

            {others.map((player, idx) => (
                <div key={player.id} className="grid grid-cols-12 gap-4 p-6 glass rounded-[32px] border border-white/5 items-center hover:border-primary/40 hover:bg-slate-900 transition-all group animate-in slide-in-from-bottom-4" style={{ delay: `${(idx + 1) * 100}ms` }}>
                    <div className="col-span-1 flex items-center gap-2">
                        <span className="text-lg font-black text-slate-500 group-hover:text-white transition-colors">{idx + 4}</span>
                    </div>
                    <div className="col-span-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all font-black text-primary">
                            {player.username.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-lg font-black">{player.username}</p>
                    </div>
                    <div className="col-span-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Zap size={10} /> Stable
                        </div>
                    </div>
                    <div className="col-span-3 text-right">
                        <p className="text-xl font-black font-mono text-primary group-hover:text-white transition-all">{player.xp.toLocaleString()}</p>
                    </div>
                </div>
            ))}

            {others.length === 0 && rankings.length > 3 && (
                <div className="text-center py-20 glass rounded-[40px] border border-white/5">
                    <Award size={64} className="text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-600 font-bold italic tracking-tighter">The Hall is currently being populated by elite candidates.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
