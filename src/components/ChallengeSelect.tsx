import React, { useState } from 'react';
import { Gamepad2, Award, ArrowLeft, Check, ShieldAlert, Mail, BookOpen, AlertCircle } from 'lucide-react';
import { ConditionalLevel } from '../types';
import { getLevelMeta, TEACHER_EMAIL } from '../data/levels';

interface ChallengeSelectProps {
  levelId: ConditionalLevel;
  onBack: () => void;
  onStartAttempt: (mode: 'practice' | 'exam') => void;
}

export const ChallengeSelect: React.FC<ChallengeSelectProps> = ({
  levelId,
  onBack,
  onStartAttempt
}) => {
  const level = getLevelMeta(levelId);
  const [showRulesModal, setShowRulesModal] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Top back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a la lección de {level.name}</span>
      </button>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-3xl flex items-center justify-center mx-auto shadow-inner">
          {level.icon}
        </div>
        <div className="text-xs font-black uppercase tracking-wider text-indigo-600">
          Nivel {level.n} · Retos Disponibles
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Elige tu desafío para {level.name}
        </h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
          Practica para dominar la estructura o presenta el examen final oficial para obtener tu certificación.
        </p>
      </div>

      {/* Two Modes Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Practice Mode */}
        <div className="bg-white rounded-3xl border-2 border-indigo-100 p-6 sm:p-8 shadow-md hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl">
              <Gamepad2 className="w-8 h-8" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
              Modo Aprendizaje
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              Quiz de Práctica
            </h3>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Responde a tu ritmo sin presión. Recibe explicaciones didácticas inmediatas en cada respuesta para aprender de tus errores.
            </p>

            <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>20 preguntas</strong> seleccionadas aleatoriamente</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>1 punto</strong> por acierto (20 pts totales)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Explicación gramatical inmediata en cada opción</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Repeticiones ilimitadas sin afectar nota final</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onStartAttempt('practice')}
            className="mt-8 w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition-all shadow-md transform hover:-translate-y-0.5"
          >
            Comenzar Práctica Ahora →
          </button>
        </div>

        {/* Final Exam Mode */}
        <div className="bg-gradient-to-b from-white to-indigo-50/50 rounded-3xl border-2 border-indigo-300 p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl tracking-wider">
            Oficial
          </div>

          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl shadow-md">
              <Award className="w-8 h-8 text-amber-300" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black uppercase tracking-wider">
              Evaluación Calificada
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              Examen Final Oficial
            </h3>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Demuestra tu dominio total del condicional. Al aprobar, se notifica de inmediato a tu docente y se genera tu certificado digital.
            </p>

            <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                <span><strong>20 preguntas</strong> (5 puntos c/u = 100 pts)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Nota mínima para aprobar: <strong>80 / 100</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Supervisión de honestidad académica activa</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Notificación automática a <strong>{TEACHER_EMAIL}</strong></span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setShowRulesModal(true)}
            className="mt-8 w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition-all shadow-lg shadow-indigo-600/30 transform hover:-translate-y-0.5"
          >
            Ver Reglas e Iniciar Examen →
          </button>
        </div>
      </div>

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-2xl">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-900">
                Reglas de Honestidad Académica
              </h2>
              <p className="text-xs text-slate-500">
                Por favor lee con atención antes de comenzar tu prueba.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-950 space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-amber-900">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Durante el examen no está permitido:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Cambiar de pestaña o abrir ventanas secundarias.</li>
                <li>Utilizar traductores automáticos o extensiones de ayuda.</li>
                <li>Copiar o pegar texto durante las preguntas.</li>
              </ul>
              <p className="text-xs text-amber-800 pt-1 font-semibold">
                ⚠️ El sistema registra las salidas de ventana. Al acumular 3 incidencias, el examen se anula automáticamente y se reporta al docente.
              </p>
            </div>

            <div className="text-xs text-slate-600 text-center">
              Consta de 20 preguntas (100 pts). Necesitas <strong>80 puntos</strong> para superar el nivel.
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowRulesModal(false)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Volver a repasar
              </button>
              <button
                onClick={() => {
                  setShowRulesModal(false);
                  onStartAttempt('exam');
                }}
                className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md"
              >
                Comenzar Examen 🏁
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
