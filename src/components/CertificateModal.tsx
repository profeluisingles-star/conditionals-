import React from 'react';
import { Award, Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { ConditionalLevel, Student } from '../types';
import { getLevelMeta, TEACHER_EMAIL } from '../data/levels';

interface CertificateModalProps {
  student: Student;
  levelId: ConditionalLevel;
  score: number;
  date?: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  student,
  levelId,
  score,
  date,
  onClose
}) => {
  const level = getLevelMeta(levelId);
  const formattedDate = date || new Date().toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const certId = `IFLAB-${levelId.toUpperCase()}-${student.id.slice(-4).toUpperCase()}-${Date.now().toString().slice(-4)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl space-y-6 relative border-4 border-double border-indigo-200 print:border-none print:shadow-none print:p-0">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Outer Frame */}
        <div className="border-2 border-indigo-600/30 rounded-2xl p-6 sm:p-8 text-center space-y-6 relative bg-gradient-to-b from-indigo-50/20 to-white">
          {/* Watermark / Seal Icon */}
          <div className="w-20 h-20 rounded-3xl bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center text-4xl shadow-inner border border-indigo-200">
            <Award className="w-12 h-12 text-indigo-700" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black tracking-widest text-indigo-600 uppercase">
              IF LAB · English Language Laboratory
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
              Certificado de Aprobación
            </h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest">
              Acreditación de Competencia Gramatical
            </p>
          </div>

          <div className="space-y-2 py-2">
            <p className="text-xs text-slate-500 italic">
              Por la presente se certifica que
            </p>
            <div className="text-2xl sm:text-3xl font-black text-indigo-950 border-b-2 border-indigo-200 pb-2 max-w-md mx-auto">
              {student.name}
            </div>
            <p className="text-xs font-bold text-slate-600">
              Grupo / Sección: {student.group}
            </p>
          </div>

          <div className="max-w-md mx-auto text-xs sm:text-sm text-slate-600 leading-relaxed">
            Ha superado satisfactoriamente la evaluación oficial de <strong>{level.name}</strong> ({level.tag}) demostrando pleno dominio de la estructura condicional con una calificación sobresaliente de:
          </div>

          {/* Grade Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-emerald-100/90 border border-emerald-300 text-emerald-950 shadow-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-xl font-black">{score} / 100</span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              (Aprobado)
            </span>
          </div>

          {/* Verification & Signatures */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200 text-xs">
            <div className="text-left space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                Docente de Inglés
              </div>
              <div className="font-serif font-black text-slate-900 text-sm">
                Prof. Luis
              </div>
              <div className="text-[10px] text-slate-500">
                {TEACHER_EMAIL}
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                Emisión & Serial
              </div>
              <div className="font-mono font-bold text-slate-800 text-[11px]">
                {certId}
              </div>
              <div className="text-[10px] text-slate-500">
                {formattedDate}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Buttons (hidden when printing) */}
        <div className="flex items-center justify-between gap-3 pt-2 print:hidden">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Documento verificable en plataforma</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
