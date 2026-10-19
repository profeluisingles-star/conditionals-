import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, ArrowLeft, ArrowRight, Check, AlertTriangle, Send, Flag } from 'lucide-react';
import { ConditionalLevel } from '../types';
import { getLevelMeta, TEACHER_EMAIL } from '../data/levels';

interface ExamSessionProps {
  levelId: ConditionalLevel;
  attemptId: string;
  questions: { id: string; question: string; options: string[] }[];
  initialViolations?: number;
  onReportViolation: (attemptId: string, count: number) => Promise<{ status: string; violations: number }>;
  onSubmitExam: (attemptId: string, answers: (number | null)[], violationsCount: number) => Promise<void>;
  onExit: () => void;
}

export const ExamSession: React.FC<ExamSessionProps> = ({
  levelId,
  attemptId,
  questions,
  initialViolations = 0,
  onReportViolation,
  onSubmitExam,
  onExit
}) => {
  const level = getLevelMeta(levelId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => {
    // try to restore from sessionStorage
    try {
      const saved = sessionStorage.getItem(`iflab_exam_${attemptId}`);
      if (saved) {
        const p = JSON.parse(saved);
        if (Array.isArray(p.answers)) return p.answers;
      }
    } catch {}
    return Array(questions.length).fill(null);
  });

  const [violations, setViolations] = useState(initialViolations);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const focusProtectionArmed = useRef(false);
  const lastIncidentTime = useRef(0);

  // Arm academic integrity listeners after grace period
  useEffect(() => {
    const timer = setTimeout(() => {
      focusProtectionArmed.current = true;
    }, 1800);

    const handleIncident = () => {
      if (!focusProtectionArmed.current) return;
      const now = Date.now();
      if (now - lastIncidentTime.current < 2500) return; // debounce
      lastIncidentTime.current = now;

      setViolations(prev => {
        const nextCount = prev + 1;
        onReportViolation(attemptId, nextCount).catch(console.error);

        if (nextCount >= 3) {
          // auto annul and submit
          onSubmitExam(attemptId, answers, nextCount).catch(console.error);
        } else {
          setShowIncidentModal(true);
        }
        return nextCount;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) handleIncident();
    };

    const handleWindowBlur = () => {
      handleIncident();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'p', 't', 'n'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [attemptId, answers, onReportViolation, onSubmitExam]);

  // Persist answers
  useEffect(() => {
    try {
      sessionStorage.setItem(`iflab_exam_${attemptId}`, JSON.stringify({ answers, violations }));
    } catch {}
  }, [answers, violations, attemptId]);

  const handleSelectAnswer = (choiceIdx: number) => {
    setAnswers(prev => {
      const copy = [...prev];
      copy[currentIndex] = choiceIdx;
      return copy;
    });
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const currentQ = questions[currentIndex];

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      focusProtectionArmed.current = false;
      await onSubmitExam(attemptId, answers, violations);
      sessionStorage.removeItem(`iflab_exam_${attemptId}`);
    } catch (e: any) {
      alert('Error al calificar examen: ' + e.message);
      setIsSubmitting(false);
      focusProtectionArmed.current = true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 select-none">
      {/* Top Banner with Integrity indicator */}
      <div className="bg-[#29265d] text-white p-4 sm:p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white transition-colors"
            title="Salir del examen"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
              Evaluación Oficial · 100 Puntos
            </div>
            <h1 className="text-lg font-black tracking-tight">
              {level.name}
            </h1>
          </div>
        </div>

        {/* Proctored Integrity Badge */}
        <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-2xl border border-white/15 text-xs">
          <ShieldAlert className={`w-4 h-4 ${violations > 0 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
          <span>
            Incidencias: <strong>{violations} / 3</strong>
          </span>
          {violations >= 2 && (
            <span className="text-[10px] bg-rose-500/80 px-2 py-0.5 rounded-full font-bold">
              ¡Riesgo de anulación!
            </span>
          )}
        </div>
      </div>

      {/* Question Number Pills Navigation */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
          <span>Navegador de Preguntas ({answeredCount} de {questions.length} respondidas)</span>
          <span className="text-emerald-600 font-extrabold">{answeredCount === 20 ? '✓ Examen Completo' : `${20 - answeredCount} pendientes`}</span>
        </div>

        <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5">
          {questions.map((_, idx) => {
            const isAnswered = answers[idx] !== null;
            const isCurrent = currentIndex === idx;

            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                  isCurrent
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-600/40 shadow-sm'
                    : isAnswered
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span className="uppercase tracking-wider">Pregunta {currentIndex + 1} de {questions.length}</span>
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-extrabold">5 Puntos</span>
        </div>

        <div className="text-xl sm:text-2xl font-black text-slate-900 leading-snug whitespace-pre-line">
          {currentQ.question}
        </div>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isSelected = answers[currentIndex] === idx;

            return (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-semibold text-sm sm:text-base flex items-start gap-3.5 transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 shadow-sm ring-1 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  {letter}
                </div>
                <div className="flex-1 leading-relaxed">
                  {opt}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <div className="text-xs font-bold text-slate-400">
            {answeredCount} / {questions.length} respondidas
          </div>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/30 flex items-center gap-2"
            >
              <span>Entregar Examen 🏁</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating submit bar if all answered */}
      {answeredCount === questions.length && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-emerald-900 text-xs sm:text-sm font-bold">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Has respondido todas las 20 preguntas. ¿Listo para calificar?</span>
          </div>
          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shrink-0"
          >
            Entregar Ahora 🏁
          </button>
        </div>
      )}

      {/* Incident Warning Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-slate-900">
                ⚠️ Advertencia de Supervisión
              </h2>
              <p className="text-xs text-slate-500">
                El sistema detectó que saliste de la pestaña del examen.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
              <p className="font-bold">
                Incidencias registradas: {violations} de 3
              </p>
              <p>
                Por honestidad académica no está permitido cambiar de aplicación ni consultar traductores. La 3ª incidencia anulará tu examen con nota 0 y notificará a tu docente.
              </p>
            </div>

            <button
              onClick={() => setShowIncidentModal(false)}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md"
            >
              Entendido, continuar mi examen
            </button>
          </div>
        </div>
      )}

      {/* Confirm Submission Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto text-3xl">
              <Send className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-slate-900">
                ¿Confirmar entrega del examen?
              </h2>
              <p className="text-xs text-slate-500">
                Has respondido <strong>{answeredCount} de {questions.length}</strong> preguntas.
              </p>
            </div>

            {answeredCount < questions.length && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-800">
                ⚠️ Tienes {questions.length - answeredCount} pregunta(s) sin responder que se calificarán con 0 puntos.
              </div>
            )}

            <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              Al confirmar, tu prueba se calificará automáticamente y el reporte oficial será enviado de inmediato al correo del docente: <strong>{TEACHER_EMAIL}</strong>.
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                disabled={isSubmitting}
                onClick={() => setShowConfirmSubmit(false)}
                className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Revisar respuestas
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md"
              >
                {isSubmitting ? 'Calificando y enviando…' : 'Sí, entregar ahora 🏁'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-black text-slate-900">
              ¿Deseas salir del examen?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tus respuestas quedarán guardadas en esta sesión y podrás retomarlo más tarde desde esta misma cuenta. No cuenta como una entrega calificada.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Continuar examen
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExit();
                }}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs"
              >
                Salir sin entregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
