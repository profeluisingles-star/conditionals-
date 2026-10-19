import React, { useState } from 'react';
import { Volume2, ArrowLeft, ArrowRight, Lightbulb, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { ConditionalLevel } from '../types';
import { getLevelMeta } from '../data/levels';

interface LessonViewProps {
  levelId: ConditionalLevel;
  onBack: () => void;
  onGoToChallenges: (levelId: ConditionalLevel) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  levelId,
  onBack,
  onGoToChallenges
}) => {
  const level = getLevelMeta(levelId);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const playAudio = (text: string, index: number) => {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador actual no admite síntesis de voz.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.88;
    utterance.onstart = () => setPlayingIndex(index);
    utterance.onend = () => setPlayingIndex(null);
    utterance.onerror = () => setPlayingIndex(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Top back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a la selección de niveles</span>
      </button>

      {/* Level Header Banner */}
      <div className="rounded-3xl bg-white border border-indigo-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 text-4xl flex items-center justify-center shrink-0 shadow-inner">
          {level.icon}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nivel {level.n} · {level.tag}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            {level.name}
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl">
            {level.subtitle}
          </p>
        </div>

        <button
          onClick={() => onGoToChallenges(level.id)}
          className="shrink-0 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5"
        >
          <span>Ir a los Retos</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Theory & Practice Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Explanation & Interactive Audio Examples */}
        <div className="lg:col-span-2 space-y-6">
          {/* Theory Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>📖 Estructura y Significado</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {level.description}
            </p>

            {/* Formula Block */}
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 sm:p-5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 block mb-1">
                Fórmula Gramatical Clave
              </span>
              <div className="text-base sm:text-lg font-mono font-black text-indigo-950">
                {level.formula}
              </div>
            </div>

            {/* Audio Examples */}
            <div className="space-y-3 pt-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">
                🔊 Ejemplos con Pronunciación en Audio
              </h3>
              <p className="text-xs text-slate-400">
                Toca el botón de audio para escuchar la pronunciación en inglés nativo.
              </p>

              <div className="space-y-2.5">
                {level.examples.map(([eng, es], idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm sm:text-base">
                        {eng}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {es}
                      </div>
                    </div>
                    <button
                      onClick={() => playAudio(eng, idx)}
                      className={`p-3 rounded-xl transition-all shrink-0 ${
                        playingIndex === idx
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-100'
                      }`}
                      title="Escuchar pronunciación"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Situations, Tips & Common Pitfalls */}
        <div className="space-y-6">
          {/* When to use */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>🧩 ¿Cuándo se utiliza?</span>
            </h3>
            <ul className="space-y-2.5">
              {level.situations.map((sit, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{sit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="text-base font-black text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Errores frecuentes a evitar</span>
            </h3>
            <div className="space-y-2">
              {level.errors.map((err, i) => (
                <div key={i} className="text-xs sm:text-sm text-amber-950 bg-white/70 p-3 rounded-xl border border-amber-200 font-medium leading-relaxed">
                  {err}
                </div>
              ))}
            </div>
          </div>

          {/* Pro-Tip */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 shadow-sm space-y-2">
            <h3 className="text-base font-black text-emerald-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Truco del Nivel</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
              {level.tips}
            </p>
          </div>

          {/* Action Card to begin tests */}
          <div className="rounded-3xl bg-gradient-to-br from-[#29265d] to-[#4537a6] text-white p-6 shadow-lg space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Listo para demostrarlo
            </div>
            <h3 className="text-lg font-black leading-tight">
              Pon a prueba tus conocimientos
            </h3>
            <p className="text-xs text-indigo-200">
              Tienes a disposición un Quiz de práctica con explicaciones inmediatas y el Examen oficial calificado.
            </p>
            <button
              onClick={() => onGoToChallenges(level.id)}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#29265d] font-black text-xs text-center transition-all shadow-md"
            >
              Comenzar Retos de {level.name} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
