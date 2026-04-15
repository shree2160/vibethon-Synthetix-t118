import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, BookOpen, Clock, Zap, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../api/supabase';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recentModules, setRecentModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile(profileData || { username: user.email.split('@')[0], xp: 0 });

        // Fetch recent progress
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*, modules(*)')
          .eq('user_id', user.id)
          .limit(3);
        
        setRecentModules(progressData || []);
      } catch (err) {
        console.error("Dashboard data fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pl-64 bg-slate-900">
        <Loader2 className="text-primary animate-spin" size={40} />
      </div>
    );
  }

  const chartData = [
    { name: 'Mon', xp: 0 },
    { name: 'Tue', xp: 0 },
    { name: 'Wed', xp: 0 },
    { name: 'Thu', xp: 0 },
    { name: 'Fri', xp: 0 },
    { name: 'Sat', xp: 0 },
    { name: 'Sun', xp: profile?.xp || 0 },
  ];
  return (
    <div className="flex flex-col min-h-screen pl-64 p-8 bg-slate-900">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {profile?.username}! 👋</h1>
          <p className="text-slate-400">Your AI mastery journey is evolving. Keep going!</p>
        </div>
        <button 
          onClick={() => navigate('/leaderboard')}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all font-medium"
        >
          View Rankings
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Current Level', value: Math.floor((profile?.xp || 0) / 500) + 1, icon: <Zap size={22} />, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { label: 'Modules Ready', value: '12', icon: <BookOpen size={22} />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Total XP', value: profile?.xp || 0, icon: <Clock size={22} />, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Achievements', value: '4', icon: <Award size={22} />, color: 'text-pink-400', bg: 'bg-pink-400/10' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Progress Chart */}
        <div className="xl:col-span-2 glass p-8 rounded-3xl border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Learning Activity</h3>
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-xs font-bold">
              <TrendingUp size={14} />
              Live Progress
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="xp" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Continue Learning */}
        <div className="flex flex-col gap-6">
          <div className="glass p-8 rounded-3xl border border-white/5 flex-1">
            <h3 className="text-xl font-bold text-white mb-6">Resume Learning</h3>
            <div className="space-y-4">
              {recentModules.length > 0 ? (
                recentModules.map((item, i) => (
                  <div key={i} className="group cursor-pointer p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-semibold text-slate-200 group-hover:text-primary transition-colors text-sm">{item.modules?.title}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{item.modules?.level}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${item.progress}%` }}></div>
                    </div>
                    <p className="text-[10px] text-right text-slate-500 mt-2 font-medium">{item.progress}% Complete</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto text-slate-700 mb-2" size={32} />
                  <p className="text-slate-500 text-xs italic">No recent activity. Start a module!</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => navigate('/modules')}
              className="w-full mt-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all text-sm"
            >
              Explore All Modules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
