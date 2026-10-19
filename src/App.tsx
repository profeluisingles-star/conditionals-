import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { StudentHome } from './components/StudentHome';
import { LessonView } from './components/LessonView';
import { ChallengeSelect } from './components/ChallengeSelect';
import { PracticeSession } from './components/PracticeSession';
import { ExamSession } from './components/ExamSession';
import { ResultScreen } from './components/ResultScreen';
import { StudentProgress } from './components/StudentProgress';
import { TeacherDashboard } from './components/TeacherDashboard';
import { LoginModal } from './components/LoginModal';
import { store } from './services/store';
import { ConditionalLevel, Student, StudentState, TeacherStats } from './types';
import { LEVELS, TEACHER_EMAIL } from './data/levels';

export default function App() {
  const [student, setStudent] = useState<Student | null>(null);
  const [studentState, setStudentState] = useState<StudentState | null>(null);
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentLevel, setCurrentLevel] = useState<ConditionalLevel>('zero');
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active attempt
  const [activeAttempt, setActiveAttempt] = useState<{
    id: string;
    level: ConditionalLevel;
    mode: 'practice' | 'exam';
    questions: { id: string; question: string; options: string[] }[];
    violations: number;
  } | null>(null);

  // Last exam/practice result
  const [lastResult, setLastResult] = useState<{
    level: ConditionalLevel;
    mode: 'practice' | 'exam';
    score: number;
    passed: boolean;
    isAnnulled: boolean;
    violations: number;
  } | null>(null);

  // Teacher statistics state
  const [teacherStats, setTeacherStats] = useState<TeacherStats>(() => store.getTeacherStats());

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  }, []);

  // Restore session
  useEffect(() => {
    const savedToken = localStorage.getItem('iflab_active_token');
    if (savedToken) {
      try {
        const s = store.getStudentByToken(savedToken);
        if (s) {
          setStudent(s);
          const st = store.getStudentState(savedToken);
          setStudentState(st);
        }
      } catch (e) {
        localStorage.removeItem('iflab_active_token');
      }
    }
  }, []);

  // Refresh student data & teacher stats
  const refreshData = useCallback(() => {
    if (student) {
      try {
        const st = store.getStudentState(student.token);
        setStudentState(st);
      } catch {}
    }
    setTeacherStats(store.getTeacherStats());
  }, [student]);

  // Auth
  const handleLogin = async (name: string, group: string, pin: string) => {
    setIsBusy(true);
    setLoginError('');
    try {
      const res = store.loginStudent(name, group, pin);
      setStudent(res.student);
      localStorage.setItem('iflab_active_token', res.token);
      const st = store.getStudentState(res.token);
      setStudentState(st);

      // Choose next unlocked level
      const nextUnlocked = LEVELS.find(
        (l, i) => (i === 0 || Boolean(st.passed[LEVELS[i - 1].id]?.score >= 80)) && !(st.passed[l.id]?.score >= 80)
      );
      if (nextUnlocked) setCurrentLevel(nextUnlocked.id);

      setCurrentView('home');
      setIsTeacherMode(false);
      showToast(`¡Bienvenido(a), ${res.student.name.split(' ')[0]}!`);
    } catch (e: any) {
      setLoginError(e.message || 'Error al iniciar sesión.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('iflab_active_token');
    setStudent(null);
    setStudentState(null);
    setActiveAttempt(null);
    setLastResult(null);
    setIsTeacherMode(false);
    setCurrentView('home');
    showToast('Sesión cerrada correctamente.');
  };

  // Level & Navigation Handlers
  const handleSelectLevel = (levelId: ConditionalLevel) => {
    setCurrentLevel(levelId);
    setCurrentView('learn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToChallenges = (levelId: ConditionalLevel) => {
    setCurrentLevel(levelId);
    setCurrentView('choose');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAttempt = async (mode: 'practice' | 'exam') => {
    if (!student) return;
    setIsBusy(true);
    try {
      const att = store.startAttempt(student.token, currentLevel, mode);
      setActiveAttempt({
        id: att.id,
        level: att.level,
        mode: att.mode,
        questions: att.questions,
        violations: att.violations
      });
      setCurrentView(mode);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      showToast(e.message);
    } finally {
      setIsBusy(false);
    }
  };

  // Practice check
  const handleCheckPractice = async (attemptId: string, index: number, choice: number) => {
    if (!student) throw new Error('Sesión requerida');
    const res = store.checkPractice(student.token, attemptId, index, choice);
    return res;
  };

  const handleFinishPractice = (score: number) => {
    setLastResult({
      level: currentLevel,
      mode: 'practice',
      score,
      passed: score >= 16,
      isAnnulled: false,
      violations: 0
    });
    setActiveAttempt(null);
    setCurrentView('result');
    refreshData();
  };

  // Exam violation report
  const handleReportViolation = async (attemptId: string, count: number) => {
    if (!student) return { status: 'unknown', violations: count };
    const res = store.reportViolation(student.token, attemptId, count);
    if (res.status === 'annulled') {
      showToast('⚠️ El examen ha sido anulado por exceder 3 incidencias de supervisión.');
    }
    refreshData();
    return res;
  };

  // Exam finish
  const handleSubmitExam = async (attemptId: string, answers: (number | null)[], violationsCount: number) => {
    if (!student) return;
    const res = store.finishExam(student.token, attemptId, answers, violationsCount);
    setLastResult({
      level: currentLevel,
      mode: 'exam',
      score: res.score,
      passed: res.passed,
      isAnnulled: res.status === 'annulled',
      violations: res.violations
    });
    setActiveAttempt(null);
    setCurrentView('result');
    refreshData();
    showToast(`Notificación de examen enviada al docente: ${TEACHER_EMAIL}`);
  };

  // Teacher Handlers
  const handleOpenTeacher = () => {
    setIsTeacherMode(true);
    setCurrentView('teacher');
    setTeacherStats(store.getTeacherStats());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendTestNotification = () => {
    store.sendTestNotification();
    setTeacherStats(store.getTeacherStats());
    showToast(`Notificación de prueba enviada a ${TEACHER_EMAIL}`);
  };

  const handleResetStudent = (studentId: string) => {
    store.resetStudentProgress(studentId);
    refreshData();
    showToast('Progreso del estudiante restablecido.');
  };

  const handleExportCSV = () => {
    const csvContent = store.exportRosterCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `IF_LAB_Estudiantes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Archivo CSV descargado con éxito.');
  };

  // View routing
  const renderCurrentView = () => {
    if (isTeacherMode || currentView === 'teacher') {
      return (
        <TeacherDashboard
          stats={teacherStats}
          onRefresh={refreshData}
          onSendTestNotification={handleSendTestNotification}
          onResetStudent={handleResetStudent}
          onExportCSV={handleExportCSV}
          onBackToStudent={() => {
            setIsTeacherMode(false);
            setCurrentView('home');
          }}
        />
      );
    }

    if (!student || !studentState) {
      return (
        <LoginModal
          onLogin={handleLogin}
          onOpenTeacher={handleOpenTeacher}
          error={loginError}
          isBusy={isBusy}
        />
      );
    }

    switch (currentView) {
      case 'home':
        return (
          <StudentHome
            state={studentState}
            onSelectLevel={handleSelectLevel}
            onNavigateToChallenges={handleGoToChallenges}
          />
        );

      case 'learn':
        return (
          <LessonView
            levelId={currentLevel}
            onBack={() => setCurrentView('home')}
            onGoToChallenges={handleGoToChallenges}
          />
        );

      case 'choose':
        return (
          <ChallengeSelect
            levelId={currentLevel}
            onBack={() => setCurrentView('learn')}
            onStartAttempt={handleStartAttempt}
          />
        );

      case 'practice':
        if (!activeAttempt) return null;
        return (
          <PracticeSession
            levelId={activeAttempt.level}
            attemptId={activeAttempt.id}
            questions={activeAttempt.questions}
            onCheckAnswer={handleCheckPractice}
            onFinish={handleFinishPractice}
            onExit={() => {
              setActiveAttempt(null);
              setCurrentView('choose');
            }}
          />
        );

      case 'exam':
        if (!activeAttempt) return null;
        return (
          <ExamSession
            levelId={activeAttempt.level}
            attemptId={activeAttempt.id}
            questions={activeAttempt.questions}
            initialViolations={activeAttempt.violations}
            onReportViolation={handleReportViolation}
            onSubmitExam={handleSubmitExam}
            onExit={() => {
              setActiveAttempt(null);
              setCurrentView('choose');
            }}
          />
        );

      case 'result':
        if (!lastResult) return null;
        return (
          <ResultScreen
            student={student}
            levelId={lastResult.level}
            mode={lastResult.mode}
            score={lastResult.score}
            passed={lastResult.passed}
            isAnnulled={lastResult.isAnnulled}
            violations={lastResult.violations}
            onContinue={() => {
              const nextIndex = LEVELS.findIndex(l => l.id === lastResult.level) + 1;
              if (lastResult.passed && nextIndex < LEVELS.length) {
                setCurrentLevel(LEVELS[nextIndex].id);
                setCurrentView('learn');
              } else {
                setCurrentView('home');
              }
            }}
            onRetry={() => {
              handleStartAttempt(lastResult.mode);
            }}
            onHome={() => setCurrentView('home')}
          />
        );

      case 'progress':
        return (
          <StudentProgress
            student={student}
            state={studentState}
            onSelectLevel={handleSelectLevel}
          />
        );

      default:
        return (
          <StudentHome
            state={studentState}
            onSelectLevel={handleSelectLevel}
            onNavigateToChallenges={handleGoToChallenges}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6ff] text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-[#29265d] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-bottom-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header (only if student logged in or teacher mode) */}
      {(student || isTeacherMode) && (
        <Header
          student={student}
          currentView={currentView}
          onNavigate={v => {
            setIsTeacherMode(false);
            setCurrentView(v);
          }}
          onOpenTeacher={handleOpenTeacher}
          onLogout={handleLogout}
          isTeacherMode={isTeacherMode}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderCurrentView()}
      </main>

      {/* Bottom Mobile Navigation for Students */}
      {student && !isTeacherMode && currentView !== 'exam' && currentView !== 'practice' && (
        <MobileNav
          currentView={currentView}
          onNavigate={v => setCurrentView(v)}
          onOpenTeacher={handleOpenTeacher}
          isTeacherMode={isTeacherMode}
        />
      )}
    </div>
  );
}
