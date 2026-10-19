import React, { useState, useMemo } from 'react';
import {
  Users,
  Award,
  BookOpen,
  TrendingUp,
  Mail,
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Eye,
  Send,
  Printer,
  ChevronRight,
  Shield,
  Sparkles,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { TeacherStats, EmailNotification, ConditionalLevel } from '../types';
import { TEACHER_EMAIL, LEVELS } from '../data/levels';
import { openMailClient } from '../services/emailNotifier';

interface TeacherDashboardProps {
  stats: TeacherStats;
  onRefresh: () => void;
  onSendTestNotification: () => void;
  onResetStudent: (studentId: string) => void;
  onExportCSV: () => void;
  onBackToStudent: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  stats,
  onRefresh,
  onSendTestNotification,
  onResetStudent,
  onExportCSV,
  onBackToStudent
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('iflab_teacher_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab: 'analytics' | 'roster' | 'notifications' | 'report'
  const [activeTab, setActiveTab] = useState<'analytics' | 'roster' | 'notifications' | 'report'>('analytics');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('ALL');

  // Modals
  const [selectedEmailPreview, setSelectedEmailPreview] = useState<EmailNotification | null>(null);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any | null>(null);
  const [testNotificationSuccess, setTestNotificationSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'docente123' || passwordInput.trim() === 'admin' || passwordInput.trim() === 'profeluis') {
      setIsAuthenticated(true);
      sessionStorage.setItem('iflab_teacher_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Contraseña incorrecta. Utilice la clave docente: docente123');
    }
  };

  const handleLogoutTeacher = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('iflab_teacher_auth');
  };

  const handleSendTest = () => {
    onSendTestNotification();
    setTestNotificationSuccess(true);
    setTimeout(() => setTestNotificationSuccess(false), 4000);
  };

  // Filtered Roster
  const filteredRoster = useMemo(() => {
    return stats.roster.filter(s => {
      const matchName = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchGroup = selectedGroupFilter === 'ALL' || s.group === selectedGroupFilter;
      return matchName && matchGroup;
    });
  }, [stats.roster, searchQuery, selectedGroupFilter]);

  // Unique groups
  const groupsList = useMemo(() => {
    const set = new Set<string>();
    stats.roster.forEach(s => set.add(s.group));
    return Array.from(set);
  }, [stats.roster]);

  // If not authenticated, show teacher PIN lock screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-3xl shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="text-center space-y-1">
          <div className="text-xs font-black uppercase tracking-wider text-amber-700">
            Acceso Restringido
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Panel de Control Docente
          </h2>
          <p className="text-xs text-slate-500">
            Seguimiento de estadísticas, estudiantes y notificaciones por correo ({TEACHER_EMAIL}).
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Clave de Acceso del Docente
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              placeholder="Ingresa la clave (ej.: docente123)"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium"
              autoFocus
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Clave predeterminada para demostración: <strong>docente123</strong>
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
              {authError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all"
          >
            Ingresar al Panel de Control →
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={onBackToStudent}
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            ← Volver a vista del estudiante
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      {/* Top Header Card */}
      <div className="bg-[#29265d] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xl shadow-md">
              👨‍🏫
            </span>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                Administración Académica
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Panel de Control &amp; Estadísticas del Docente
              </h1>
            </div>
          </div>

          {/* Teacher Email Indicator Banner */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-indigo-100">
            <Mail className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>
              Bandeja de notificaciones vinculada: <strong>{TEACHER_EMAIL}</strong>
            </span>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10 w-full md:w-auto">
          <button
            onClick={handleSendTest}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold text-xs flex items-center gap-2 shadow-md transition-all"
            title={`Enviar correo de prueba a ${TEACHER_EMAIL}`}
          >
            <Send className="w-4 h-4" />
            <span>Enviar Notificación de Prueba</span>
          </button>

          <button
            onClick={onExportCSV}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handleLogoutTeacher}
            className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 font-bold text-xs transition-colors"
          >
            Cerrar Panel
          </button>
        </div>
      </div>

      {/* Test Notification Banner Alert */}
      {testNotificationSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              ¡Notificación de prueba generada con éxito y dirigida a <strong>{TEACHER_EMAIL}</strong>! Puedes verla en la pestaña de notificaciones.
            </span>
          </div>
          <button
            onClick={() => setActiveTab('notifications')}
            className="underline text-emerald-800 text-xs font-black shrink-0"
          >
            Ver en bandeja →
          </button>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span>Estudiantes</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.studentsCount}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold">
            Matriculados activos
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span>Exámenes</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.totalExamsCount}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold">
            Calificados en total
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-500" />
            <span>Aprobaciones</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {stats.totalPassesCount}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold">
            Niveles superados
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
            <span>Tasa Aprobación</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600">
            {stats.passingRate}%
          </div>
          <div className="text-[11px] text-slate-500 font-semibold">
            Notas &gt;= 80 pts
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Promedio</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.averageScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <div className="text-[11px] text-slate-500 font-semibold">
            Calificación global
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-rose-500" />
            <span>Alertas Correo</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.notificationsCount}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold truncate">
            Enviadas al docente
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-3 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Estadísticas &amp; Gráficos</span>
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`px-5 py-3 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'roster'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registro de Estudiantes ({stats.roster.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-5 py-3 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'notifications'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Bandeja de Correo ({stats.notificationsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`px-5 py-3 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'report'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Reporte Imprimible</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS & CHARTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Level by level performance chart */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Rendimiento y Dificultad por Nivel de Condicional
                </h3>
                <p className="text-xs text-slate-500">
                  Comparativa de estudiantes que han aprobado y promedio de notas obtenidas en cada tipo de condicional.
                </p>
              </div>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl border border-indigo-100">
                Escala 0 - 100 pts
              </span>
            </div>

            <div className="grid gap-4">
              {stats.levelStats.map((lv, idx) => {
                const passRate = stats.studentsCount > 0 ? Math.round((lv.passedStudents / stats.studentsCount) * 100) : 0;
                const meta = LEVELS.find(l => l.id === lv.level);

                return (
                  <div key={lv.level} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{meta?.icon}</span>
                        <div>
                          <div className="text-sm font-black text-slate-900">
                            {lv.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {lv.passedStudents} de {stats.studentsCount} estudiantes aprobados ({passRate}%) · {lv.attemptsCount} exámenes rendidos
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-black text-slate-900">{lv.averageScore}</span>
                        <span className="text-xs text-slate-400 font-bold"> / 100 prom.</span>
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(passRate, 5)}%` }}
                        title={`Tasa de Aprobación: ${passRate}%`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Two Columns: Score Distribution & Groups comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Score Distribution */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-slate-900">
                Distribución de Calificaciones
              </h3>
              <p className="text-xs text-slate-500">
                Frecuencia de notas registradas en los exámenes.
              </p>

              <div className="space-y-3 pt-2">
                {stats.scoreDistribution.map(sd => {
                  const percent = stats.totalExamsCount > 0 ? Math.round((sd.count / stats.totalExamsCount) * 100) : 0;

                  return (
                    <div key={sd.range} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">{sd.label}</span>
                        <span className="text-slate-900 font-black">{sd.count} ({percent}%)</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            sd.range === '0-59'
                              ? 'bg-rose-500'
                              : sd.range === '60-79'
                              ? 'bg-amber-400'
                              : sd.range === '80-89'
                              ? 'bg-blue-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.max(percent, 3)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Groups Breakdown */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-slate-900">
                Rendimiento por Grupo / Sección
              </h3>
              <p className="text-xs text-slate-500">
                Comparativa entre secciones académicas.
              </p>

              <div className="space-y-3 pt-2">
                {stats.groupStats.map(grp => (
                  <div key={grp.group} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <div className="font-black text-slate-900 text-sm">
                        Grupo {grp.group}
                      </div>
                      <div className="text-xs text-slate-500">
                        {grp.studentsCount} estudiante(s) · {grp.passesCount} aprobaciones
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-indigo-700">
                        {grp.averageScore} pts
                      </div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Promedio
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROSTER OF STUDENTS */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Nómina de Estudiantes y Acreditación de Condicionales
              </h3>
              <p className="text-xs text-slate-500">
                Visualiza el avance individual, notas máximas e historial por estudiante.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar estudiante..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={selectedGroupFilter}
                onChange={e => setSelectedGroupFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Todos los Grupos</option>
                {groupsList.map(g => (
                  <option key={g} value={g}>Grupo {g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3 font-black">Estudiante</th>
                  <th className="py-3 px-3 font-black">Grupo</th>
                  <th className="py-3 px-3 font-black text-center">Niveles Aprobados</th>
                  <th className="py-3 px-3 font-black text-center">Zero</th>
                  <th className="py-3 px-3 font-black text-center">First</th>
                  <th className="py-3 px-3 font-black text-center">Second</th>
                  <th className="py-3 px-3 font-black text-center">Third</th>
                  <th className="py-3 px-3 font-black text-center">Mixed</th>
                  <th className="py-3 px-3 font-black text-center">Mejor Nota</th>
                  <th className="py-3 px-3 font-black text-center">Incidencias</th>
                  <th className="py-3 px-3 font-black text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoster.length > 0 ? (
                  filteredRoster.map(st => (
                    <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-black text-slate-900">{st.name}</div>
                        <div className="text-[10px] text-slate-400">Activo: {st.lastActive}</div>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-600">
                        {st.group}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                          st.passedCount === 5
                            ? 'bg-emerald-100 text-emerald-800'
                            : st.passedCount > 0
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {st.passedCount} / 5
                        </span>
                      </td>

                      {/* 5 Levels Status Pills */}
                      <td className="py-3 px-3 text-center">
                        {st.levels.zero ? <span className="text-emerald-600 font-black">✓</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {st.levels.first ? <span className="text-emerald-600 font-black">✓</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {st.levels.second ? <span className="text-emerald-600 font-black">✓</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {st.levels.third ? <span className="text-emerald-600 font-black">✓</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {st.levels.mixed ? <span className="text-emerald-600 font-black">✓</span> : <span className="text-slate-300">—</span>}
                      </td>

                      <td className="py-3 px-3 text-center font-black text-slate-900">
                        {st.bestScore > 0 ? `${st.bestScore}/100` : 'Sin nota'}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {st.violationsTotal > 0 ? (
                          <span className="text-rose-600 font-black">⚠️ {st.violationsTotal}</span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedStudentDetail(st)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs"
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-400 italic">
                      No se encontraron estudiantes con los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS LOG (profeluisingles@gmail.com) */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-1 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Canal activo y verificado</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Registro de Notificaciones Oficiales ({TEACHER_EMAIL})
              </h3>
              <p className="text-xs text-slate-500">
                Historial completo de alertas generadas tras cada examen completado o aprobado por los estudiantes.
              </p>
            </div>

            <button
              onClick={handleSendTest}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Alerta de Prueba Ahora</span>
            </button>
          </div>

          <div className="space-y-3">
            {stats.notifications.length > 0 ? (
              stats.notifications.map(notif => (
                <div
                  key={notif.id}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/40 border border-slate-200/90 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        notif.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {notif.passed ? '✓ Nivel Aprobado' : 'Examen Evaluado'}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {notif.date}
                      </span>
                      <span className="text-xs text-slate-500">
                        Para: <strong>{notif.recipient}</strong>
                      </span>
                    </div>

                    <div className="font-extrabold text-slate-900 text-sm">
                      {notif.subject}
                    </div>

                    <p className="text-xs text-slate-600 max-w-2xl line-clamp-1">
                      {notif.previewText}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedEmailPreview(notif)}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-indigo-700 border border-indigo-200 font-extrabold text-xs shadow-sm flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Correo HTML</span>
                    </button>

                    <button
                      onClick={() => openMailClient(notif)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5"
                      title="Abrir en cliente de correo"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Mailto</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400 italic">
                Aún no hay notificaciones en la bandeja.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: OFFICIAL PRINTABLE REPORT */}
      {activeTab === 'report' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-6 print:p-0 print:border-none print:shadow-none">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Vista de Impresión / Acta Oficial de Calificaciones
              </h3>
              <p className="text-xs text-slate-500">
                Formato institucional listo para imprimir o guardar en PDF.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Reporte</span>
            </button>
          </div>

          {/* Official Document Body */}
          <div className="space-y-6 text-slate-900">
            <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
              <h1 className="text-2xl font-black font-serif uppercase tracking-wider">
                Informe Académico de Calificaciones - IF LAB
              </h1>
              <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">
                Laboratorio de Condicionales en Inglés · Registro Docente
              </p>
              <p className="text-xs text-slate-500">
                Docente Responsable: <strong>Prof. Luis</strong> ({TEACHER_EMAIL}) · Fecha: {new Date().toLocaleDateString('es-CR')}
              </p>
            </div>

            {/* Quick Metrics Table */}
            <div className="grid grid-cols-4 gap-4 text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Estudiantes</div>
                <div className="text-xl font-black">{stats.studentsCount}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Exámenes</div>
                <div className="text-xl font-black">{stats.totalExamsCount}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Aprobaciones</div>
                <div className="text-xl font-black text-emerald-600">{stats.totalPassesCount}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Promedio General</div>
                <div className="text-xl font-black text-indigo-700">{stats.averageScore} / 100</div>
              </div>
            </div>

            {/* Detailed Table */}
            <table className="w-full text-left border-collapse text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 uppercase font-black border-b border-slate-300">
                  <th className="p-2.5 border-r border-slate-300">Estudiante</th>
                  <th className="p-2.5 border-r border-slate-300">Grupo</th>
                  <th className="p-2.5 border-r border-slate-300 text-center">Niveles (0-5)</th>
                  <th className="p-2.5 border-r border-slate-300 text-center">Nota Máx.</th>
                  <th className="p-2.5 text-center">Estado Académico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {stats.roster.map(r => (
                  <tr key={r.id}>
                    <td className="p-2.5 border-r border-slate-200 font-bold">{r.name}</td>
                    <td className="p-2.5 border-r border-slate-200">{r.group}</td>
                    <td className="p-2.5 border-r border-slate-200 text-center font-bold">{r.passedCount} / 5</td>
                    <td className="p-2.5 border-r border-slate-200 text-center font-black">{r.bestScore}/100</td>
                    <td className="p-2.5 text-center">
                      {r.passedCount === 5 ? (
                        <span className="font-bold text-emerald-700">COMPLETO (5/5)</span>
                      ) : r.passedCount >= 1 ? (
                        <span className="font-semibold text-indigo-700">EN PROGRESO</span>
                      ) : (
                        <span className="text-slate-400">INICIAL</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signatures */}
            <div className="pt-12 grid grid-cols-2 gap-12 text-center text-xs">
              <div className="border-t border-slate-400 pt-2">
                <div className="font-black text-slate-900 font-serif">Prof. Luis</div>
                <div className="text-slate-500">Docente de Inglés ({TEACHER_EMAIL})</div>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <div className="font-black text-slate-900 font-serif">Dirección / Coordinación</div>
                <div className="text-slate-500">Sello y Firma Institucional</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {selectedEmailPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="space-y-0.5">
                <div className="text-xs font-black text-indigo-600 uppercase">
                  Previsualización de Correo Electrónico
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {selectedEmailPreview.subject}
                </div>
              </div>
              <button
                onClick={() => setSelectedEmailPreview(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Rendered HTML Body Preview inside an iframe container */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-[60vh] overflow-y-auto bg-slate-50">
              <div dangerouslySetInnerHTML={{ __html: selectedEmailPreview.bodyHtml }} />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-500">
                Destinatario verificado: <strong>{selectedEmailPreview.recipient}</strong>
              </span>
              <button
                onClick={() => openMailClient(selectedEmailPreview)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-extrabold text-xs"
              >
                Abrir en Cliente de Correo ✉️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="text-xs font-black text-indigo-600 uppercase">
                  Ficha de Estudiante
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  {selectedStudentDetail.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Grupo: <strong>{selectedStudentDetail.group}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Aprobaciones</div>
                  <div className="text-lg font-black text-slate-900">{selectedStudentDetail.passedCount} / 5</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Mejor Nota</div>
                  <div className="text-lg font-black text-slate-900">{selectedStudentDetail.bestScore} / 100</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-extrabold text-slate-700">Estado por Condicional:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Zero Conditional: {selectedStudentDetail.levels.zero ? '✅ Aprobado' : '⏳ Pendiente'}</div>
                  <div>First Conditional: {selectedStudentDetail.levels.first ? '✅ Aprobado' : '⏳ Pendiente'}</div>
                  <div>Second Conditional: {selectedStudentDetail.levels.second ? '✅ Aprobado' : '⏳ Pendiente'}</div>
                  <div>Third Conditional: {selectedStudentDetail.levels.third ? '✅ Aprobado' : '⏳ Pendiente'}</div>
                  <div>Mixed Conditionals: {selectedStudentDetail.levels.mixed ? '✅ Aprobado' : '⏳ Pendiente'}</div>
                </div>
              </div>

              {selectedStudentDetail.violationsTotal > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl">
                  ⚠️ Se registraron {selectedStudentDetail.violationsTotal} incidencias de cambio de ventana durante evaluaciones.
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  if (confirm(`¿Reiniciar progreso y habilitar nuevos intentos para ${selectedStudentDetail.name}?`)) {
                    onResetStudent(selectedStudentDetail.id);
                    setSelectedStudentDetail(null);
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold underline"
              >
                Reiniciar intentos del estudiante
              </button>

              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
