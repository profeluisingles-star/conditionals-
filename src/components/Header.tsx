import React from 'react';
import { BookOpen, Trophy, Home, UserCheck, Shield, Sparkles, LogOut, GraduationCap } from 'lucide-react';
import { Student } from '../types';
import { TEACHER_EMAIL } from '../data/levels';

interface HeaderProps {
  student: Student | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenTeacher: () => void;
  onLogout: () => void;
  isTeacherMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  currentView,
  onNavigate,
  onOpenTeacher,
  onLogout,
  isTeacherMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#29265d] text-white border-b border-indigo-900/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-300 text-[#29265d] font-black text-base flex items-center justify-center shadow-md transform -rotate-3 hover:rotate-0 transition-transform">
              IF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight">IF LAB</span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Condicionales
                </span>
              </div>
              <p className="text-xs text-indigo-200 font-medium hidden sm:block">
                Laboratorio Interactivo de Inglés
              </p>
            </div>
          </div>

          {/* Navigation Links for Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => onNavigate('home')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'home'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Niveles</span>
            </button>
            <button
              onClick={() => onNavigate('learn')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'learn'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Lección</span>
            </button>
            <button
              onClick={() => onNavigate('progress')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'progress'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Mis Logros</span>
            </button>
          </nav>

          {/* User profile / Teacher Toggle */}
          <div className="flex items-center gap-2.5">
            {/* Teacher Dashboard Button */}
            <button
              onClick={onOpenTeacher}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                isTeacherMode
                  ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-md ring-2 ring-amber-400/30'
                  : 'bg-white/10 hover:bg-white/15 text-indigo-100 border-white/20'
              }`}
              title={`Panel Docente (Notificaciones: ${TEACHER_EMAIL})`}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Panel Docente</span>
              <span className="inline sm:hidden">Docente</span>
            </button>

            {/* Student info badge */}
            {student && (
              <div className="flex items-center gap-2 pl-2 border-l border-white/15">
                <div className="w-9 h-9 rounded-full bg-emerald-400/90 text-slate-900 font-extrabold flex items-center justify-center text-sm shadow">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold leading-tight truncate max-w-[120px]">
                    {student.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-emerald-300 font-semibold">
                    Grupo {student.group}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title="Cerrar sesión"
                  className="p-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
