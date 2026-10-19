import React, { useState } from 'react';
import { Sparkles, ArrowRight, GraduationCap, ShieldCheck, Mail } from 'lucide-react';
import { TEACHER_EMAIL } from '../data/levels';

interface LoginModalProps {
  onLogin: (name: string, group: string, pin: string) => Promise<void>;
  onOpenTeacher: () => void;
  error?: string;
  isBusy?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onLogin,
  onOpenTeacher,
  error,
  isBusy
}) => {
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(name, group, pin);
  };

  const handleQuickDemo = (demoName: string, demoGroup: string) => {
    setName(demoName);
    setGroup(demoGroup);
    setPin('123456');
    onLogin(demoName, demoGroup, '123456');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#29265d] via-[#1e1b4b] to-[#0f172a] text-slate-900 flex items-center justify-center p-4 sm:p-6 select-none">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 space-y-6 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Banner */}
        <div className="bg-[#29265d] text-white rounded-2xl p-5 flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-300">
              <Sparkles className="w-3 h-3" />
              <span>English Conditionals</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              IF LAB ✦
            </h1>
            <p className="text-xs text-indigo-200">
              Aprende, practica y certifícate.
            </p>
          </div>
          <div className="text-5xl filter drop-shadow-md select-none animate-bounce duration-1000">
            🦉
          </div>
        </div>

        {/* Title & subtitle */}
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            ¡Hola! Tu aventura comienza aquí.
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ingresa con tu nombre, sección y una clave de 4 a 6 números. Si entras por primera vez, tu cuenta se crea al instante.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nombre y Apellidos
            </label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={80}
              placeholder="Ej.: Daniela Pérez Rodríguez"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Grupo o Sección
              </label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={40}
                placeholder="Ej.: 9-1 o CINDEA"
                value={group}
                onChange={e => setGroup(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Clave (4 a 6 números)
              </label>
              <input
                type="password"
                required
                inputMode="numeric"
                pattern="[0-9]{4,6}"
                maxLength={6}
                placeholder="••••••"
                value={pin}
                onChange={e => setPin(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isBusy}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{isBusy ? 'Iniciando sesión…' : '¡Comenzar a aprender! →'}</span>
          </button>
        </form>

        {/* Quick Demo Accounts */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            O entra con una cuenta de prueba:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('Daniela Pérez Rodríguez', '9-1')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-left border border-slate-200 transition-colors"
            >
              <div className="text-xs font-extrabold text-slate-800 truncate">Daniela Pérez</div>
              <div className="text-[10px] text-slate-400 font-semibold">4/5 Aprobados · G 9-1</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('Mariana Castro Solís', '10-3')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-left border border-slate-200 transition-colors"
            >
              <div className="text-xs font-extrabold text-slate-800 truncate">Mariana Castro</div>
              <div className="text-[10px] text-emerald-600 font-bold">5/5 Maestro · G 10-3</div>
            </button>
          </div>
        </div>

        {/* Switch to Teacher Mode */}
        <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onOpenTeacher}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <GraduationCap className="w-4 h-4 text-amber-700" />
            <span>Acceso al Panel Docente (Estadísticas y Correo)</span>
          </button>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span>Notificaciones a <strong>{TEACHER_EMAIL}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
