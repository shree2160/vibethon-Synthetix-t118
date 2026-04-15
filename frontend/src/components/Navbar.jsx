import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Code, Gamepad2, LayoutDashboard, Trophy, BookOpen, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../api/supabase';

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState({ xp: 0 });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', user.id)
        .single();
      if (data) setProfile(data);
    };

    fetchProfile();

    // Subscribe to profile changes for real-time updates
    const channel = supabase
      .channel('profile_updates')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles',
        filter: `id=eq.${user?.id}`
      }, (payload) => {
        setProfile(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const level = Math.floor(profile.xp / 500) + 1;
  const progress = (profile.xp % 500) / 5; // Percentage toward next 500 XP
  
  const navItems = [
    { name: 'Profile', path: '/profile', icon: <UserCircle size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Modules', path: '/modules', icon: <BookOpen size={20} /> },
    { name: 'Games', path: '/games', icon: <Gamepad2 size={20} /> },
    { name: 'Playground', path: '/playground', icon: <Code size={20} /> },
    { name: 'Simulations', path: '/simulations', icon: <Brain size={20} /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={20} /> },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/10 p-6 flex flex-col z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="p-2 bg-primary rounded-lg">
          <Brain className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold gradient-text">AIML Learn</h1>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </div>

      <div className="mt-auto space-y-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-indigo-200 font-medium mb-1">Level {level}</p>
            <p className="text-2xl font-bold text-white mb-3">{profile.xp.toLocaleString()} XP</p>
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-1000" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-20">
            <Trophy size={80} />
          </div>
        </div>

        <button 
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-red-400/10 hover:text-red-400 rounded-xl transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>

    </nav>
  );
};

export default Navbar;
