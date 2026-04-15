import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle, Play, FileText, Code as CodeIcon, HelpCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../api/supabase';
import { useAuth } from '../context/AuthContext';

const LessonViewer = () => {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        // Fetch current lesson
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .single();
        
        if (lessonError) throw lessonError;
        setLesson(lessonData);

        // Fetch all lessons in this module for navigation
        const { data: listData } = await supabase
          .from('lessons')
          .select('id, title')
          .eq('module_id', moduleId)
          .order('order_index', { ascending: true });
        
        setAllLessons(listData || []);
      } catch (err) {
        console.error("Error fetching lesson:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLessonData();
  }, [lessonId, moduleId]);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      // In a full system, we'd update a 'lesson_progress' table here.
      // For now, let's navigate to the next lesson or back to module
      const currentIdx = allLessons.findIndex(l => l.id.toString() === lessonId);
      if (currentIdx < allLessons.length - 1) {
        const nextId = allLessons[currentIdx + 1].id;
        navigate(`/modules/${moduleId}/lessons/${nextId}`);
      } else {
        // Module complete logic could go here
        navigate(`/modules/${moduleId}`);
      }
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Lesson...</div>;

  return (
    <div className="flex flex-col min-h-screen pl-64 bg-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-800/80 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
        <button 
          onClick={() => navigate(`/modules/${moduleId}`)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-sm font-bold"
        >
          <ChevronLeft size={20} />
          Exit Lesson
        </button>
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Lesson {lesson?.order_index || 1}</p>
          <h2 className="text-sm font-bold truncate max-w-xs">{lesson?.title}</h2>
        </div>
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black text-xs">
          {Math.round(((allLessons.findIndex(l => l.id.toString() === lessonId) + 1) / allLessons.length) * 100)}%
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center p-8 overflow-y-auto">
        <div className="max-w-3xl w-full">
          {/* Content Type Decorator */}
          <div className="flex items-center gap-3 mb-8 text-primary">
             {lesson?.type === 'video' ? <Play size={24} /> : 
              lesson?.type === 'reading' ? <FileText size={24} /> :
              lesson?.type === 'code' ? <CodeIcon size={24} /> : <HelpCircle size={24} />}
             <span className="text-sm font-black uppercase tracking-widest">{lesson?.type} Session</span>
          </div>

          <h1 className="text-4xl font-black mb-8 leading-tight">{lesson?.title}</h1>

          {/* Body Content */}
          <div className="glass rounded-[40px] p-10 border border-white/10 mb-12">
            <div className="prose prose-invert prose-lg max-w-none">
               {lesson?.content ? (
                 <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                   {lesson.content}
                 </div>
               ) : (
                 <p className="text-slate-500 italic">No content available for this lesson.</p>
               )}
            </div>

            {lesson?.type === 'video' && (
              <div className="aspect-video w-full bg-slate-800 rounded-3xl mt-8 flex items-center justify-center border border-white/5 group cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                <div className="relative z-10 w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play size={40} className="text-white ml-2" fill="white" />
                </div>
                <p className="absolute bottom-6 text-sm text-slate-400 font-bold uppercase tracking-widest">Click to Play Lecture</p>
              </div>
            )}

            {lesson?.type === 'code' && (
              <div className="bg-slate-950 rounded-2xl p-6 mt-8 border border-white/5 font-mono text-sm">
                <p className="text-blue-400 mb-2"># Task: Define a weighted average</p>
                <p className="text-slate-300">def calculate_ai_score(data, weights):</p>
                <p className="text-slate-300 ml-4">return sum(d * w for d, w in zip(data, weights))</p>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="flex items-center justify-between pt-8 border-t border-white/5 pb-20">
            <button className="flex items-center gap-2 p-4 text-slate-500 hover:text-white transition-all">
              <ArrowLeft size={20} />
              Previous
            </button>
            <button 
              onClick={handleComplete}
              disabled={completing}
              className="px-10 py-4 bg-primary hover:bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95"
            >
              {completing ? 'Saving...' : 'Complete & Continue'}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
