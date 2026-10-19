import React, { useState } from 'react';
import { Trophy, CheckCircle2, Clock, Award, ShieldAlert, BookOpen } from 'lucide-react';
import { Student, StudentState, ConditionalLevel } from '../types';
import { LEVELS } from '../data/levels';
import { CertificateModal } from './CertificateModal';

interface StudentProgressProps {
  student: Student;
  state: StudentState;
  onSelectLevel: (level: ConditionalLevel) => void;
}

export const StudentProgress: React.FC<StudentProgressProps> = ({
  student,
  state,
  onSelectLevel
}) => {
  const [selectedCertLevel, setSelectedCertLevel] = useState<ConditionalLevel | null>(null);

  const passedCount = LEVELS.filter(l => Boolean(state.passed[l.id]?.score >= 80)).length;
  const progressPercent = Math.round((passedCount / LEVELS.length) * 100);

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      {/* Header Profile Badge */}
      <div className="bg-gradient-to-r from-[#29265d] to-[#46399e] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className="w-16 h-16 rounded-3xl bg-emerald-300 text-slate-900 font-black text-2xl flex items-center justify-center shadow-lg">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Expediente del Estudiante
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {student.name}
            </h1>
            <p className="text-xs text-indigo-200 mt-0.5">
              Grupo / Sección: <strong>{student.group}</strong>
            </p>
          </div>
        </div>

        {/* Big Badge */}
        <div className="bg-white/10 border border-white/15 px-6 py-4 rounded-2xl text-center backdrop-blur-md">
          <div className="text-3xl font-black text-emerald-300">
            {passedCount} <span className="text-sm font-semibold text-white/60">/ 5</span>
          </div>
          <div className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">
            Niveles Acreditados
          </div>
        </div>
      </div>

      {/* Progress Path */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Ruta de Certificación
            </h2>
            <p className="text-xs text-slate-500">
              Supera la nota mínima de 80 en cada nivel para habilitar tu certificado.
            </p>
          </div>
          <div className="text-right">
            <span className="text-base font-black text-indigo-600">{progressPercent}%</span>
            <span className="text-xs text-slate-400 block font-semibold">Completado</span>
          </div>
        </div>

        <div className="grid gap-3">
          {LEVELS.map(level => {
            const pass = state.passed[level.id];
            const isPassed = Boolean(pass?.score >= 80);

            return (
              <div
                key={level.id}
                className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border transition-all ${
                  isPassed
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-2xl flex items-center justify-center shadow-sm shrink-0">
                    {level.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Nivel {level.n} · {level.tag}
                    </div>
                    <div className="font-black text-slate-900 text-base">
                      {level.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {isPassed
                        ? `Aprobado con ${pass.score}/100 pts · ${pass.date}`
                        : 'Evaluación pendiente de aprobación (Mínimo 80)'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isPassed ? (
                    <button
                      onClick={() => setSelectedCertLevel(level.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Award className="w-4 h-4 text-amber-300" />
                      <span>Ver Certificado</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectLevel(level.id)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-colors"
                    >
                      Estudiar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attempt History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-900">
          Historial de Intentos y Evaluaciones
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3 font-extrabold">Nivel</th>
                <th className="py-3 px-3 font-extrabold">Actividad</th>
                <th className="py-3 px-3 font-extrabold">Puntaje</th>
                <th className="py-3 px-3 font-extrabold">Estado</th>
                <th className="py-3 px-3 font-extrabold">Incidencias</th>
                <th className="py-3 px-3 font-extrabold">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {state.attempts.length > 0 ? (
                state.attempts.map((att, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900 capitalize">
                      {att.level} conditional
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">
                      {att.mode === 'exam' ? 'Examen Oficial' : 'Quiz Práctica'}
                    </td>
                    <td className="py-3 px-3 font-black text-slate-900">
                      {att.score} {att.mode === 'exam' ? '/ 100' : '/ 20'}
                    </td>
                    <td className="py-3 px-3">
                      {att.status === 'annulled' ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                          Anulado
                        </span>
                      ) : att.mode === 'exam' && att.score >= 80 ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          ✓ Aprobado
                        </span>
                      ) : att.mode === 'exam' ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                          No Aprobado
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                          Práctica
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">
                      {att.violations > 0 ? (
                        <span className="text-amber-700 font-bold">⚠️ {att.violations}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {att.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400 italic">
                    Aún no has registrado intentos. ¡Comienza con el Zero Conditional!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal if opened */}
      {selectedCertLevel && (
        <CertificateModal
          student={student}
          levelId={selectedCertLevel}
          score={state.passed[selectedCertLevel]?.score || 100}
          date={state.passed[selectedCertLevel]?.date}
          onClose={() => setSelectedCertLevel(null)}
        />
      )}
    </div>
  );
};
