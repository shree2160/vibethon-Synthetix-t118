import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, PlayCircle, FileText, HelpCircle, ArrowRight, Loader2, Award } from 'lucide-react';
import { supabase } from '../api/supabase';

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const { data: moduleData, error: moduleError } = await supabase
          .from('modules')
          .select('*')
          .eq('id', id)
          .single();
        
        if (moduleError) throw moduleError;
        setModule(moduleData);

        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('*')
          .eq('module_id', id)
          .order('order_index', { ascending: true });
        
        setLessons(lessonsData || []);
      } catch (err) {
        console.error("Error fetching module data:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchModuleData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pl-64 bg-slate-900 text-white">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pl-64 bg-slate-900 text-white">
        <h2 className="text-2xl font-bold mb-4">Module not found</h2>
        <button onClick={() => navigate('/modules')} className="text-primary hover:underline">Back to Curriculum</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pl-64 bg-slate-900 text-white">
      {/* Header */}
      <div className="p-8 bg-slate-800/50 border-b border-white/5">
        <button 
          onClick={() => navigate('/modules')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-medium"
        >
          <ChevronLeft size={16} />
          Back to Curriculum
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                {module.category || 'Module'}
              </span>
              <span className="text-slate-500 text-sm font-medium">45 min total</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{module.title}</h1>
            <p className="text-slate-400 max-w-2xl">{module.description}</p>
          </div>
          <div className="flex flex-col items-center p-6 glass border border-white/10 rounded-3xl min-w-[200px]">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">XP Reward</p>
            <div className="flex items-center gap-2 text-3xl font-black text-primary">
              <Award size={28} />
              {module.xp_reward || 100}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Lesson List */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-xl font-bold mb-6">Course Content</h2>
          {lessons.length > 0 ? (
            lessons.map((lesson, idx) => (
              <div 
                key={lesson.id}
                className={`flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${
                  lesson.completed 
                    ? 'bg-slate-800/30 border-white/5 opacity-80' 
                    : 'glass border-white/10 hover:border-primary/50 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${
                    lesson.completed ? 'bg-green-400/10 text-green-400' : 'bg-white/5 text-slate-400'
                  }`}>
                    {lesson.completed ? <CheckCircle size={24} /> : 
                    lesson.type === 'video' ? <PlayCircle size={24} /> :
                    lesson.type === 'reading' ? <FileText size={24} /> :
                    <HelpCircle size={24} />}
                  </div>
                  <div>
                    <h3 className={`font-bold ${lesson.completed ? 'text-slate-400' : 'text-white'}`}>
                      {idx + 1}. {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                      {lesson.type} • {lesson.duration}
                    </p>
                  </div>
                </div>
                {!lesson.completed && (
                  <button 
                    onClick={() => navigate(`/modules/${id}/lessons/${lesson.id}`)}
                    className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-blue-600 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20"
                  >
                    Start
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="p-12 glass border border-dashed border-white/10 rounded-[32px] text-center">
              <p className="text-slate-500">No lessons available for this module yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-[40px] border border-white/10">
            <h3 className="text-lg font-bold mb-6">Instructor Notes</h3>
            <div className="prose prose-invert prose-sm">
              <p className="text-slate-400 leading-relaxed italic">
                "This module serves as the bedrock for your AIML journey. Pay close attention to the mathematical foundations as they reappear in every advanced model you'll build later."
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-800 rounded-full border border-white/10 flex items-center justify-center text-primary font-bold">AG</div>
               <div>
                  <p className="text-sm font-bold">Antigravity AI</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black">Lead Instructor</p>
               </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[40px] border border-white/10 bg-gradient-to-br from-primary/10 to-transparent">
             <h3 className="text-lg font-bold mb-4">Mastery Badge</h3>
             <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center text-primary border border-primary/20 shadow-2xl shadow-primary/20">
                <Award size={48} />
             </div>
             <p className="text-center text-xs text-slate-400 leading-relaxed">
                Complete all lessons and pass the final quiz to earn the <span className="text-white font-bold">"{module.title} Mastery"</span> digital badge for your profile.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
