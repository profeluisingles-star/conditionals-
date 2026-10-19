import React from 'react';
import { Home, BookOpen, Target, Trophy, GraduationCap } from 'lucide-react';

interface MobileNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenTeacher: () => void;
  isTeacherMode: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onNavigate,
  onOpenTeacher,
  isTeacherMode
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 pb-safe shadow-2xl">
      <div className="grid grid-cols-5 gap-1">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-all ${
            currentView === 'home'
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Inicio</span>
        </button>

        <button
          onClick={() => onNavigate('learn')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-all ${
            currentView === 'learn'
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span>Lección</span>
        </button>

        <button
          onClick={() => onNavigate('choose')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-all ${
            currentView === 'choose' || currentView === 'session'
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Target className="w-5 h-5 mb-0.5" />
          <span>Retos</span>
        </button>

        <button
          onClick={() => onNavigate('progress')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-all ${
            currentView === 'progress'
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-5 h-5 mb-0.5" />
          <span>Logros</span>
        </button>

        <button
          onClick={onOpenTeacher}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-all ${
            isTeacherMode
              ? 'text-amber-800 bg-amber-100 font-extrabold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-5 h-5 mb-0.5" />
          <span>Docente</span>
        </button>
      </div>
    </nav>
  );
};
