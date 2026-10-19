import React from 'react';
import { Sparkles, Trophy, CheckCircle2, Lock, ArrowRight, ShieldCheck, Mail, Target, Award } from 'lucide-react';
import { ConditionalLevel, StudentState } from '../types';
import { LEVELS, TEACHER_EMAIL } from '../data/levels';

interface StudentHomeProps {
  state: StudentState;
  onSelectLevel: (level: ConditionalLevel) => void;
  onNavigateToChallenges: (level: ConditionalLevel) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  state,
  onSelectLevel,
  onNavigateToChallenges
}) => {
  const passedLevelsCount = LEVELS.filter(l => Boolean(state.passed[l.id]?.score >= 80)).length;

  const isLevelUnlocked = (index: number): boolean => {
    if (index === 0) return true;
    const prevLevel = LEVELS[index - 1].id;
    return Boolean(state.passed[prevLevel]?.score >= 80);
  };

  // Find next level to continue
  const nextLevel = LEVELS.find((l, idx) => isLevelUnlocked(idx) && !(state.passed[l.id]?.score >= 80)) || LEVELS[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#29265d] via-[#352f75] to-[#493e96] text-white p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/10 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aprende a tu propio ritmo</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
              ¿Qué pasaría si...?
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
              Domina los <strong>5 condicionales del inglés</strong> paso a paso con explicaciones claras, audio nativo, retos prácticos y evaluaciones con certificación automática.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => onSelectLevel(nextLevel.id)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Continuar aventura ({nextLevel.name})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-xs text-indigo-200">
                <Mail className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Notificaciones directas a <strong>{TEACHER_EMAIL}</strong></span>
              </div>
            </div>
          </div>

          {/* Friendly Owl Mascot */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="text-8xl sm:text-9xl filter drop-shadow-xl select-none animate-bounce duration-1000 transform -rotate-6">
              🦉
            </div>
            <span className="mt-2 text-xs font-bold text-indigo-200 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Prof. Búho · Tu Tutor
            </span>
          </div>
        </div>
      </div>

      {/* Quick Statistics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-black shrink-0">
            🏆
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {passedLevelsCount} <span className="text-sm font-semibold text-slate-400">/ 5</span>
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Niveles Aprobados
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-black shrink-0">
            🎯
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              80 <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Nota Mínima Requerida
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-black shrink-0">
            📚
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              200
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Preguntas en Banco Aleatorio
            </div>
          </div>
        </div>
      </div>

      {/* Level Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Tu Mapa de Aprendizaje
            </h2>
            <p className="text-sm text-slate-500">
              Aprueba el examen de cada nivel con 80 o más para desbloquear el siguiente reto.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
            <ShieldCheck className="w-4 h-4" />
            Evaluación Supervisada
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {LEVELS.map((level, index) => {
            const unlocked = isLevelUnlocked(index);
            const passData = state.passed[level.id];
            const isPassed = Boolean(passData?.score >= 80);

            return (
              <div
                key={level.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 border ${
                  isPassed
                    ? 'bg-white border-emerald-300 shadow-md ring-1 ring-emerald-400/20'
                    : unlocked
                    ? 'bg-white border-indigo-200 shadow-md hover:shadow-xl hover:-translate-y-1'
                    : 'bg-slate-50/80 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100/60 flex items-center justify-center text-3xl shadow-inner">
                      {level.icon}
                    </div>

                    {isPassed ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aprobado ({passData.score}/100)
                      </span>
                    ) : unlocked ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black">
                        Disponible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
                        <Lock className="w-3 h-3" />
                        Bloqueado
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                    Nivel {level.n} · {level.tag}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                    {level.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mb-4 line-clamp-2">
                    {level.subtitle}
                  </p>

                  {/* Formula Preview Pill */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-mono font-bold text-indigo-900 mb-6 truncate">
                    {level.formula}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {unlocked ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSelectLevel(level.id)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                      >
                        📖 Estudiar
                      </button>
                      <button
                        onClick={() => onNavigateToChallenges(level.id)}
                        className={`w-full py-2.5 px-3 rounded-xl font-black text-xs transition-colors flex items-center justify-center gap-1 ${
                          isPassed
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        <span>{isPassed ? 'Repetir' : 'Reto'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-2 text-xs font-semibold text-slate-400">
                      Aprueba el nivel anterior para desbloquear
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Teacher Communication Notice */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-emerald-50 border border-indigo-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Notificaciones oficiales activas
            </h4>
            <p className="text-xs text-slate-600">
              Cada examen aprobado se reporta directamente al correo del docente: <strong>{TEACHER_EMAIL}</strong> con tu nombre y nota oficial.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-extrabold text-indigo-700 bg-white px-4 py-2 rounded-xl border border-indigo-200/80 shadow-sm shrink-0">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Certificado Digital Incluido</span>
        </div>
      </div>
    </div>
  );
};
