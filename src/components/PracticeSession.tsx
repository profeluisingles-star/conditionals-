import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { ConditionalLevel } from '../types';
import { getLevelMeta } from '../data/levels';

interface PracticeSessionProps {
  levelId: ConditionalLevel;
  attemptId: string;
  questions: { id: string; question: string; options: string[] }[];
  onCheckAnswer: (attemptId: string, index: number, choice: number) => Promise<{
    correct: boolean;
    correctIndex: number;
    explanation: string;
    done: boolean;
    points: number;
    total: number;
  }>;
  onFinish: (score: number) => void;
  onExit: () => void;
}

export const PracticeSession: React.FC<PracticeSessionProps> = ({
  levelId,
  attemptId,
  questions,
  onCheckAnswer,
  onFinish,
  onExit
}) => {
  const level = getLevelMeta(levelId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    correctIndex: number;
    explanation: string;
    done: boolean;
    points: number;
    total: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPoints, setCurrentPoints] = useState(0);

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectChoice = async (choiceIndex: number) => {
    if (selectedChoice !== null || isSubmitting) return;

    setSelectedChoice(choiceIndex);
    setIsSubmitting(true);

    try {
      const res = await onCheckAnswer(attemptId, currentIndex, choiceIndex);
      setFeedback(res);
      setCurrentPoints(res.points);
    } catch (e: any) {
      alert('Error al verificar respuesta: ' + e.message);
      setSelectedChoice(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (feedback?.done || currentIndex >= questions.length - 1) {
      onFinish(currentPoints);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedChoice(null);
      setFeedback(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Abandonar Práctica</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
            🎮 Quiz de Práctica
          </span>
          <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            Puntos: {currentPoints} / {questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-500">
          <span>Pregunta {currentIndex + 1} de {questions.length}</span>
          <span>{progressPercent}% completado</span>
        </div>
        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>{level.name}</span>
          <span>1 Punto</span>
        </div>

        <div className="text-xl sm:text-2xl font-black text-slate-900 leading-snug whitespace-pre-line">
          {currentQ.question}
        </div>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isSelected = selectedChoice === idx;
            const isCorrectOption = feedback?.correctIndex === idx;

            let cardStyle = 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-slate-800';

            if (feedback) {
              if (isCorrectOption) {
                cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20';
              } else if (isSelected && !feedback.correct) {
                cardStyle = 'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400/20';
              } else {
                cardStyle = 'border-slate-200 opacity-60 text-slate-500';
              }
            } else if (isSelected) {
              cardStyle = 'border-indigo-600 bg-indigo-50 text-indigo-950';
            }

            return (
              <button
                key={idx}
                disabled={feedback !== null || isSubmitting}
                onClick={() => handleSelectChoice(idx)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-semibold text-sm sm:text-base flex items-start gap-3.5 transition-all ${cardStyle}`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                    feedback && isCorrectOption
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : feedback && isSelected && !feedback.correct
                      ? 'bg-rose-500 text-white border-rose-600'
                      : isSelected
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

        {/* Feedback Alert Card */}
        {feedback && (
          <div
            className={`rounded-2xl p-5 border-2 space-y-2 animate-in fade-in zoom-in-95 duration-200 ${
              feedback.correct
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                : 'bg-amber-50/90 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-2 font-black text-sm sm:text-base">
              {feedback.correct ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>¡Excelente! Respuesta correcta (+1 pt)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Buen intento, pero no es la opción adecuada</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
              {feedback.explanation}
            </p>

            <div className="pt-3 flex justify-end">
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all shadow-md"
              >
                <span>{feedback.done || currentIndex >= questions.length - 1 ? 'Ver Resultado Final 🏁' : 'Siguiente Pregunta →'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
