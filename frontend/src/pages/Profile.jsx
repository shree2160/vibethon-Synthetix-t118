import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../api/supabase';
import { User, Mail, Shield, Calendar, Award, Settings, Loader2, Zap } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        setProfile(data);
      } catch (err) {
        setProfile({
          username: user.email.split('@')[0],
          avatar_url: null,
          xp: 0,
          joined_at: user.created_at
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

    // Failsafe: exit loading state after 3 seconds regardless of DB status
    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pl-64 bg-slate-900 text-white">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pl-64 p-8 bg-slate-900 text-white">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight mb-2">My Profile</h1>
        <p className="text-slate-400">Manage your account and view your achievements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-[40px] p-8 border border-white/10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/30 to-secondary/30" />
            
            <div className="relative z-10">
              <div className="w-32 h-32 bg-slate-800 rounded-full border-4 border-slate-900 mx-auto mb-6 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={64} className="text-slate-500" />
                )}
              </div>
              <h2 className="text-2xl font-bold mb-1">{profile?.username}</h2>
              <p className="text-primary font-medium text-sm mb-6 flex items-center justify-center gap-2">
                <Shield size={14} />
                Level {Math.floor((profile?.xp || 0) / 500) + 1} AI Apprentice
              </p>

              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Total XP</p>
                  <p className="text-xl font-bold">{profile?.xp || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Rank</p>
                  <p className="text-xl font-bold">#42</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
             <div className="flex items-center gap-4 text-sm text-slate-400">
               <Mail size={18} className="text-slate-500" />
               <span className="truncate">{user?.email}</span>
             </div>
             <div className="flex items-center gap-4 text-sm text-slate-400">
               <Calendar size={18} className="text-slate-500" />
               <span>Joined {new Date(profile?.joined_at || user?.created_at).toLocaleDateString()}</span>
             </div>
             <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold transition-all border border-white/5">
                <Settings size={14} />
                Edit Profile
             </button>
          </div>
        </div>

        {/* Right Column - Stats & Achievements */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-3xl border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-400/10 text-yellow-500 rounded-xl">
                  <Award size={20} />
                </div>
                <h3 className="font-bold text-lg">Top Achievement</h3>
              </div>
              <p className="text-sm text-white font-semibold mb-1">Code Ninja</p>
              <p className="text-xs text-slate-500">Completed 50 playground exercises without errors.</p>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-400/10 text-blue-400 rounded-xl">
                  <Zap size={20} />
                </div>
                <h3 className="font-bold text-lg">Learning Streak</h3>
              </div>
              <p className="text-sm text-white font-semibold mb-1">7 Days 🔥</p>
              <p className="text-xs text-slate-500">You are in the top 5% of active learners this week.</p>
            </div>
          </div>

          <div className="glass rounded-[32px] p-8 border border-white/10">
            <h3 className="text-xl font-bold mb-6">Learning Activity</h3>
            <div className="space-y-6">
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                   <span>Neural Networks</span>
                   <span className="text-white">85%</span>
                 </div>
                 <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-primary rounded-full" style={{ width: '85%' }} />
                 </div>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                   <span>NLP Foundations</span>
                   <span className="text-white">40%</span>
                 </div>
                 <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-secondary rounded-full" style={{ width: '40%' }} />
                 </div>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                   <span>Computer Vision</span>
                   <span className="text-white">12%</span>
                 </div>
                 <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-accent rounded-full" style={{ width: '12%' }} />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
