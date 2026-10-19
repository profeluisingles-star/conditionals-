import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Mail, Award, Home } from 'lucide-react';
import { ConditionalLevel, Student } from '../types';
import { getLevelMeta, TEACHER_EMAIL } from '../data/levels';
import { CertificateModal } from './CertificateModal';

interface ResultScreenProps {
  student: Student;
  levelId: ConditionalLevel;
  mode: 'practice' | 'exam';
  score: number;
  passed: boolean;
  isAnnulled?: boolean;
  violations?: number;
  onContinue: () => void;
  onRetry: () => void;
  onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  student,
  levelId,
  mode,
  score,
  passed,
  isAnnulled,
  violations = 0,
  onContinue,
  onRetry,
  onHome
}) => {
  const level = getLevelMeta(levelId);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    if (passed && !isAnnulled) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [passed, isAnnulled]);

  const isExam = mode === 'exam';

  return (
    <div className="max-w-xl mx-auto space-y-6 text-center pb-20 pt-4">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 space-y-6 relative overflow-hidden">
        {/* Big Top Emoji/Icon */}
        <div className="text-6xl sm:text-7xl filter drop-shadow-md select-none animate-bounce duration-1000">
          {isAnnulled ? '🛡️' : passed ? '🎉' : isExam ? '🌱' : '🎮'}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="text-xs font-black uppercase tracking-wider text-indigo-600">
            {level.name} · {isExam ? 'Examen Oficial' : 'Quiz de Práctica'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {isAnnulled
              ? 'Examen Anulado'
              : passed
              ? '¡Excelente Trabajo! ¡Nivel Superado!'
              : isExam
              ? '¡Sigue Esforzándote!'
              : '¡Práctica Completada!'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {isAnnulled
              ? 'Se registraron 3 incidencias por salir de la ventana. Tu intento no tiene validez académica. Puedes volver a intentarlo.'
              : passed
              ? `Has demostrado un dominio ejemplar del ${level.name} cumpliendo la nota mínima de 80 puntos.`
              : isExam
              ? 'Necesitas al menos 80/100 para aprobar el nivel. Repasa la lección e inténtalo de nuevo.'
              : 'Cada práctica fortalece tu gramática inglesa. ¡Estás más cerca de dominar este tema!'}
          </p>
        </div>

        {/* Score Badge */}
        <div className="py-4">
          <div className="inline-flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 border-2 border-slate-200/80 min-w-[220px]">
            <div className={`text-5xl sm:text-6xl font-black tracking-tight leading-none ${
              isAnnulled ? 'text-rose-600' : passed ? 'text-emerald-600' : 'text-slate-800'
            }`}>
              {score}
              <span className="text-xl sm:text-2xl text-slate-400 font-bold">
                {isExam ? ' / 100' : ' / 20'}
              </span>
            </div>
            <div className={`mt-2 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
              isAnnulled
                ? 'bg-rose-100 text-rose-800'
                : passed
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {isAnnulled ? 'Anulado por Integridad' : passed ? '⭐ APROBADO' : isExam ? 'PENDIENTE (Mínimo 80)' : 'Completado'}
            </div>
          </div>
        </div>

        {/* Teacher Email Confirmation Banner (for exams) */}
        {isExam && (
          <div className="rounded-2xl bg-indigo-50/80 border border-indigo-200/80 p-4 text-xs sm:text-sm text-indigo-950 flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold">
                Notificación oficial registrada
              </div>
              <div className="text-xs text-indigo-800">
                Se envió el reporte con tu calificación al correo del docente: <strong>{TEACHER_EMAIL}</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Certificate Button (if passed) */}
        {passed && !isAnnulled && (
          <button
            onClick={() => setShowCertificate(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Award className="w-5 h-5 text-amber-300" />
            <span>Ver y Descargar Certificado de Aprobación 🎓</span>
          </button>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={onRetry}
            className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isExam ? 'Intentar Examen de Nuevo' : 'Hacer otra práctica'}</span>
          </button>

          <button
            onClick={onContinue}
            className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-colors"
          >
            <span>{passed ? 'Siguiente Nivel' : 'Ver Mapa de Niveles'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          student={student}
          levelId={levelId}
          score={score}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};
