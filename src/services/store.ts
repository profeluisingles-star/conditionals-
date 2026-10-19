import {
  ConditionalLevel,
  ExamAttempt,
  PassRecord,
  Student,
  StudentState,
  TeacherStats,
  EmailNotification
} from '../types';
import { LEVELS, QUESTION_BANK, getLevelMeta, shuffleArray, TEACHER_EMAIL } from '../data/levels';
import { createEmailNotification } from './emailNotifier';

const STORAGE_KEY = 'iflab_production_data_v4';

interface DatabaseSchema {
  students: Student[];
  attempts: ExamAttempt[];
  passes: PassRecord[];
  notifications: EmailNotification[];
}

function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Initial realistic seed data for demonstrative analytics
function getInitialSeedData(): DatabaseSchema {
  const seedStudents: Student[] = [
    { id: 'std_01', name: 'Daniela Pérez Rodríguez', group: '9-1', pin: '123456', token: 'tok_01', createdAt: '2026-10-15T09:30:00Z', lastActiveAt: '2026-10-19T10:15:00Z' },
    { id: 'std_02', name: 'Carlos Morales Brenes', group: '9-1', pin: '123456', token: 'tok_02', createdAt: '2026-10-15T10:00:00Z', lastActiveAt: '2026-10-19T11:40:00Z' },
    { id: 'std_03', name: 'Sofía Jiménez Vargas', group: '9-2', pin: '123456', token: 'tok_03', createdAt: '2026-10-16T08:15:00Z', lastActiveAt: '2026-10-19T12:05:00Z' },
    { id: 'std_04', name: 'Kevin Alvarado Montero', group: '9-2', pin: '123456', token: 'tok_04', createdAt: '2026-10-16T11:20:00Z', lastActiveAt: '2026-10-18T16:50:00Z' },
    { id: 'std_05', name: 'Mariana Castro Solís', group: '10-3', pin: '123456', token: 'tok_05', createdAt: '2026-10-17T09:00:00Z', lastActiveAt: '2026-10-19T13:10:00Z' },
    { id: 'std_06', name: 'Alejandro Segura Campos', group: '10-3', pin: '123456', token: 'tok_06', createdAt: '2026-10-17T14:30:00Z', lastActiveAt: '2026-10-18T18:20:00Z' },
    { id: 'std_07', name: 'Valeria Chaves Navarro', group: 'CINDEA 4P', pin: '123456', token: 'tok_07', createdAt: '2026-10-18T08:45:00Z', lastActiveAt: '2026-10-19T13:45:00Z' }
  ];

  const seedPasses: PassRecord[] = [
    { studentId: 'std_01', level: 'zero', score: 100, date: '15/10/2026, 10:15:00 a. m.', times: 1 },
    { studentId: 'std_01', level: 'first', score: 95, date: '16/10/2026, 11:30:00 a. m.', times: 1 },
    { studentId: 'std_01', level: 'second', score: 90, date: '17/10/2026, 02:40:00 p. m.', times: 1 },
    { studentId: 'std_01', level: 'third', score: 85, date: '18/10/2026, 09:20:00 a. m.', times: 1 },
    { studentId: 'std_02', level: 'zero', score: 90, date: '15/10/2026, 11:10:00 a. m.', times: 1 },
    { studentId: 'std_02', level: 'first', score: 85, date: '16/10/2026, 03:00:00 p. m.', times: 1 },
    { studentId: 'std_03', level: 'zero', score: 95, date: '16/10/2026, 09:00:00 a. m.', times: 1 },
    { studentId: 'std_03', level: 'first', score: 90, date: '17/10/2026, 10:30:00 a. m.', times: 1 },
    { studentId: 'std_03', level: 'second', score: 85, date: '18/10/2026, 11:15:00 a. m.', times: 1 },
    { studentId: 'std_05', level: 'zero', score: 100, date: '17/10/2026, 10:00:00 a. m.', times: 1 },
    { studentId: 'std_05', level: 'first', score: 100, date: '18/10/2026, 01:20:00 p. m.', times: 1 },
    { studentId: 'std_05', level: 'second', score: 95, date: '18/10/2026, 04:45:00 p. m.', times: 1 },
    { studentId: 'std_05', level: 'third', score: 90, date: '19/10/2026, 08:30:00 a. m.', times: 1 },
    { studentId: 'std_05', level: 'mixed', score: 85, date: '19/10/2026, 01:10:00 p. m.', times: 1 },
    { studentId: 'std_07', level: 'zero', score: 85, date: '18/10/2026, 09:40:00 a. m.', times: 1 }
  ];

  const seedAttempts: ExamAttempt[] = [
    {
      id: 'att_seed_01',
      studentId: 'std_05',
      studentName: 'Mariana Castro Solís',
      studentGroup: '10-3',
      level: 'mixed',
      mode: 'exam',
      items: [],
      answers: {},
      violations: 0,
      status: 'completed',
      score: 85,
      startedAt: '2026-10-19T12:45:00Z',
      finishedAt: '19/10/2026, 01:10:00 p. m.'
    },
    {
      id: 'att_seed_02',
      studentId: 'std_01',
      studentName: 'Daniela Pérez Rodríguez',
      studentGroup: '9-1',
      level: 'third',
      mode: 'exam',
      items: [],
      answers: {},
      violations: 0,
      status: 'completed',
      score: 85,
      startedAt: '2026-10-18T09:00:00Z',
      finishedAt: '18/10/2026, 09:20:00 a. m.'
    },
    {
      id: 'att_seed_03',
      studentId: 'std_04',
      studentName: 'Kevin Alvarado Montero',
      studentGroup: '9-2',
      level: 'zero',
      mode: 'exam',
      items: [],
      answers: {},
      violations: 1,
      status: 'completed',
      score: 75,
      startedAt: '2026-10-18T16:20:00Z',
      finishedAt: '18/10/2026, 16:50:00 p. m.'
    },
    {
      id: 'att_seed_04',
      studentId: 'std_06',
      studentName: 'Alejandro Segura Campos',
      studentGroup: '10-3',
      level: 'first',
      mode: 'exam',
      items: [],
      answers: {},
      violations: 3,
      status: 'annulled',
      score: 0,
      startedAt: '2026-10-18T18:10:00Z',
      finishedAt: '18/10/2026, 18:20:00 p. m.'
    }
  ];

  const seedNotifications: EmailNotification[] = [
    createEmailNotification({
      studentName: 'Mariana Castro Solís',
      studentGroup: '10-3',
      level: 'mixed',
      score: 85,
      passed: true,
      violations: 0,
      date: '19/10/2026, 01:10:00 p. m.'
    }),
    createEmailNotification({
      studentName: 'Daniela Pérez Rodríguez',
      studentGroup: '9-1',
      level: 'third',
      score: 85,
      passed: true,
      violations: 0,
      date: '18/10/2026, 09:20:00 a. m.'
    }),
    createEmailNotification({
      studentName: 'Kevin Alvarado Montero',
      studentGroup: '9-2',
      level: 'zero',
      score: 75,
      passed: false,
      violations: 1,
      date: '18/10/2026, 04:50:00 p. m.'
    })
  ];

  return {
    students: seedStudents,
    passes: seedPasses,
    attempts: seedAttempts,
    notifications: seedNotifications
  };
}

class StoreService {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.load();
  }

  private load(): DatabaseSchema {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.students && parsed.passes) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    const initial = getInitialSeedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  // Auth & Student
  public loginStudent(name: string, group: string, pin: string): { student: Student; token: string } {
    const cleanName = name.trim();
    const cleanGroup = group.trim();
    const cleanPin = pin.trim();

    if (cleanName.length < 3) throw new Error('Ingresa un nombre y apellido válido (mínimo 3 caracteres).');
    if (cleanGroup.length < 2) throw new Error('Ingresa tu sección o grupo (ej.: 9-1 o CINDEA).');
    if (!/^[0-9]{4,6}$/.test(cleanPin)) throw new Error('La clave debe contener entre 4 y 6 dígitos numéricos.');

    let student = this.db.students.find(
      s => s.name.toLowerCase() === cleanName.toLowerCase() && s.group.toLowerCase() === cleanGroup.toLowerCase()
    );

    if (student) {
      if (student.pin !== cleanPin) {
        throw new Error('La clave ingresada no coincide con el registro previo de este estudiante.');
      }
      student.token = uid('tok');
      student.lastActiveAt = new Date().toISOString();
    } else {
      student = {
        id: uid('std'),
        name: cleanName,
        group: cleanGroup,
        pin: cleanPin,
        token: uid('tok'),
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString()
      };
      this.db.students.push(student);
    }

    this.save();
    return { student, token: student.token };
  }

  public getStudentByToken(token: string): Student | null {
    return this.db.students.find(s => s.token === token) || null;
  }

  public getStudentState(token: string): StudentState {
    const student = this.getStudentByToken(token);
    if (!student) throw new Error('Sesión no encontrada o expirada. Por favor ingresa nuevamente.');

    const passedMap: Record<ConditionalLevel, { score: number; date: string; times: number }> = {
      zero: { score: 0, date: '', times: 0 },
      first: { score: 0, date: '', times: 0 },
      second: { score: 0, date: '', times: 0 },
      third: { score: 0, date: '', times: 0 },
      mixed: { score: 0, date: '', times: 0 }
    };

    const studentPasses = this.db.passes.filter(p => p.studentId === student.id);
    for (const p of studentPasses) {
      passedMap[p.level] = { score: p.score, date: p.date, times: p.times };
    }

    const attempts = this.db.attempts
      .filter(a => a.studentId === student.id && a.status !== 'active')
      .slice(-30)
      .reverse()
      .map(a => ({
        id: a.id,
        level: a.level,
        mode: a.mode,
        status: a.status,
        score: a.score,
        date: a.finishedAt || a.startedAt,
        violations: a.violations
      }));

    return {
      student: {
        id: student.id,
        name: student.name,
        group: student.group
      },
      passed: passedMap,
      attempts
    };
  }

  // Attempt & Quizzes
  public startAttempt(token: string, level: ConditionalLevel, mode: 'practice' | 'exam'): {
    id: string;
    level: ConditionalLevel;
    mode: 'practice' | 'exam';
    violations: number;
    answered: number;
    questions: { id: string; question: string; options: string[] }[];
  } {
    const student = this.getStudentByToken(token);
    if (!student) throw new Error('Sesión inválida.');

    const levelIndex = LEVELS.findIndex(l => l.id === level);
    if (levelIndex < 0) throw new Error('Nivel inexistente.');

    // Progression requirement: must have passed previous level for exam or practice
    if (levelIndex > 0) {
      const prevLevel = LEVELS[levelIndex - 1].id;
      const hasPassedPrev = this.db.passes.some(p => p.studentId === student.id && p.level === prevLevel);
      if (!hasPassedPrev) {
        throw new Error(`Para acceder a ${LEVELS[levelIndex].name}, primero debes aprobar el examen de ${LEVELS[levelIndex - 1].name} con nota mínima de 80.`);
      }
    }

    // Reuse existing active attempt if available
    const existing = this.db.attempts.find(
      a => a.studentId === student.id && a.level === level && a.mode === mode && a.status === 'active'
    );

    if (existing) {
      return {
        id: existing.id,
        level: existing.level,
        mode: existing.mode,
        violations: existing.violations,
        answered: Object.keys(existing.answers).length,
        questions: existing.items.map(it => {
          const original = QUESTION_BANK[level].find(q => q.id === it.id);
          return {
            id: it.id,
            question: original ? original.q : '',
            options: it.options
          };
        })
      };
    }

    // Generate new attempt with 20 randomized questions
    const allQuestions = QUESTION_BANK[level] || [];
    const shuffledBank = shuffleArray(allQuestions).slice(0, 20);
    const items = shuffledBank.map(q => ({
      id: q.id,
      options: shuffleArray(q.options)
    }));

    const newAttempt: ExamAttempt = {
      id: uid('att'),
      studentId: student.id,
      studentName: student.name,
      studentGroup: student.group,
      level,
      mode,
      items,
      answers: {},
      violations: 0,
      status: 'active',
      score: 0,
      startedAt: new Date().toISOString()
    };

    this.db.attempts.push(newAttempt);
    this.save();

    return {
      id: newAttempt.id,
      level: newAttempt.level,
      mode: newAttempt.mode,
      violations: newAttempt.violations,
      answered: 0,
      questions: items.map(it => {
        const orig = allQuestions.find(q => q.id === it.id);
        return {
          id: it.id,
          question: orig ? orig.q : '',
          options: it.options
        };
      })
    };
  }

  public checkPractice(token: string, attemptId: string, index: number, choice: number) {
    const student = this.getStudentByToken(token);
    if (!student) throw new Error('Sesión no encontrada.');

    const attempt = this.db.attempts.find(a => a.id === attemptId && a.studentId === student.id);
    if (!attempt || attempt.status !== 'active' || attempt.mode !== 'practice') {
      throw new Error('Esta sesión de práctica no está activa.');
    }

    const item = attempt.items[index];
    if (!item) throw new Error('Pregunta no encontrada.');

    const original = QUESTION_BANK[attempt.level].find(q => q.id === item.id);
    if (!original) throw new Error('Pregunta original no encontrada en el banco.');

    const correctOptionString = original.options[0];
    const correctIndex = item.options.indexOf(correctOptionString);
    const isCorrect = choice === correctIndex;

    attempt.answers[index] = choice;

    // Calculate current points
    let points = 0;
    for (const [idxStr, selectedChoice] of Object.entries(attempt.answers)) {
      const it = attempt.items[Number(idxStr)];
      const orig = QUESTION_BANK[attempt.level].find(q => q.id === it.id);
      if (orig && it.options[selectedChoice] === orig.options[0]) {
        points += 1;
      }
    }

    const isDone = Object.keys(attempt.answers).length >= attempt.items.length;
    if (isDone) {
      attempt.status = 'completed';
      attempt.score = points;
      attempt.finishedAt = new Date().toLocaleString('es-CR');
    }

    this.save();

    return {
      correct: isCorrect,
      correctIndex,
      explanation: original.why,
      done: isDone,
      points,
      total: attempt.items.length
    };
  }

  public reportViolation(token: string, attemptId: string, count: number) {
    const student = this.getStudentByToken(token);
    if (!student) throw new Error('Sesión no encontrada.');

    const attempt = this.db.attempts.find(a => a.id === attemptId && a.studentId === student.id);
    if (!attempt || attempt.mode !== 'exam') return { status: 'unknown', violations: 0 };

    attempt.violations = Math.max(attempt.violations, count);
    if (attempt.violations >= 3) {
      attempt.status = 'annulled';
      attempt.score = 0;
      attempt.finishedAt = new Date().toLocaleString('es-CR');

      // Dispatch alert notification to teacher
      const notif = createEmailNotification({
        studentName: student.name,
        studentGroup: student.group,
        level: attempt.level,
        score: 0,
        passed: false,
        violations: attempt.violations
      });
      notif.subject = `⚠️ ALERTA ACADÉMICA IF LAB: Examen de ${student.name} anulado por incidencias (3/3)`;
      this.db.notifications.unshift(notif);
    }

    this.save();
    return { status: attempt.status, violations: attempt.violations };
  }

  public finishExam(token: string, attemptId: string, answers: (number | null)[], violationsCount: number) {
    const student = this.getStudentByToken(token);
    if (!student) throw new Error('Sesión no encontrada.');

    const attempt = this.db.attempts.find(a => a.id === attemptId && a.studentId === student.id);
    if (!attempt || attempt.mode !== 'exam') {
      throw new Error('El examen no se encuentra activo o ya fue completado.');
    }

    attempt.violations = Math.max(attempt.violations, violationsCount);
    const isAnnulled = attempt.violations >= 3;

    let correctCount = 0;
    const answerRecord: Record<number, number> = {};

    attempt.items.forEach((it, idx) => {
      const selected = answers[idx];
      if (selected !== null && selected !== undefined) {
        answerRecord[idx] = selected;
        const orig = QUESTION_BANK[attempt.level].find(q => q.id === it.id);
        if (orig && it.options[selected] === orig.options[0]) {
          correctCount++;
        }
      }
    });

    attempt.answers = answerRecord;
    const finalScore = isAnnulled ? 0 : correctCount * 5; // 20 questions * 5 pts = 100
    attempt.score = finalScore;
    attempt.status = isAnnulled ? 'annulled' : 'completed';
    attempt.finishedAt = new Date().toLocaleString('es-CR');

    const passed = !isAnnulled && finalScore >= 80;

    if (passed) {
      let passRecord = this.db.passes.find(p => p.studentId === student.id && p.level === attempt.level);
      if (passRecord) {
        passRecord.score = Math.max(passRecord.score, finalScore);
        passRecord.times++;
        passRecord.date = attempt.finishedAt;
      } else {
        this.db.passes.push({
          studentId: student.id,
          level: attempt.level,
          score: finalScore,
          date: attempt.finishedAt,
          times: 1
        });
      }
    }

    // AUTOMATIC NOTIFICATION DISPATCH TO profeluisingles@gmail.com
    const notification = createEmailNotification({
      studentName: student.name,
      studentGroup: student.group,
      level: attempt.level,
      score: finalScore,
      passed,
      violations: attempt.violations,
      date: attempt.finishedAt
    });

    this.db.notifications.unshift(notification);
    this.save();

    return {
      status: attempt.status,
      score: finalScore,
      passed,
      correct: correctCount,
      total: attempt.items.length,
      violations: attempt.violations,
      notificationSent: true,
      recipient: TEACHER_EMAIL
    };
  }

  // Teacher Panel & Analytics
  public getTeacherStats(): TeacherStats {
    const students = this.db.students;
    const passes = this.db.passes;
    const exams = this.db.attempts.filter(a => a.mode === 'exam' && a.status !== 'active');

    const totalStudents = students.length;
    const totalExams = exams.length;
    const totalPasses = passes.length;

    const avgScore = totalExams > 0
      ? Math.round(exams.reduce((sum, e) => sum + e.score, 0) / totalExams)
      : 0;

    const passingExams = exams.filter(e => e.score >= 80 && e.status === 'completed');
    const passingRate = totalExams > 0 ? Math.round((passingExams.length / totalExams) * 100) : 0;

    const totalViolations = exams.reduce((sum, e) => sum + (e.violations || 0), 0);

    // Level analytics
    const levelStats = LEVELS.map(l => {
      const levelPasses = passes.filter(p => p.level === l.id);
      const levelExams = exams.filter(e => e.level === l.id);
      const lAvg = levelExams.length > 0
        ? Math.round(levelExams.reduce((sum, e) => sum + e.score, 0) / levelExams.length)
        : 0;

      return {
        level: l.id,
        name: l.name,
        passedStudents: levelPasses.length,
        averageScore: lAvg,
        attemptsCount: levelExams.length
      };
    });

    // Group analytics
    const groupsSet = new Set<string>();
    students.forEach(s => groupsSet.add(s.group));
    const groupStats = Array.from(groupsSet).map(grp => {
      const grpStudents = students.filter(s => s.group === grp);
      const grpStudentIds = new Set(grpStudents.map(s => s.id));
      const grpPasses = passes.filter(p => grpStudentIds.has(p.studentId));
      const grpExams = exams.filter(e => grpStudentIds.has(e.studentId));
      const grpAvg = grpExams.length > 0
        ? Math.round(grpExams.reduce((sum, e) => sum + e.score, 0) / grpExams.length)
        : 0;

      return {
        group: grp,
        studentsCount: grpStudents.length,
        passesCount: grpPasses.length,
        averageScore: grpAvg
      };
    }).sort((a, b) => b.studentsCount - a.studentsCount);

    // Score distribution (0-59, 60-79, 80-89, 90-100)
    const scoreRanges = [
      { range: '0-59', label: 'Insuficiente (<60)', count: 0 },
      { range: '60-79', label: 'En Progreso (60-79)', count: 0 },
      { range: '80-89', label: 'Aprobado Notable (80-89)', count: 0 },
      { range: '90-100', label: 'Excelente (90-100)', count: 0 }
    ];

    exams.forEach(e => {
      if (e.status === 'annulled' || e.score < 60) scoreRanges[0].count++;
      else if (e.score < 80) scoreRanges[1].count++;
      else if (e.score < 90) scoreRanges[2].count++;
      else scoreRanges[3].count++;
    });

    // Complete Roster
    const roster = students.map(s => {
      const studentPasses = passes.filter(p => p.studentId === s.id);
      const studentExams = exams.filter(e => e.studentId === s.id);
      const bestScore = studentPasses.reduce((max, p) => Math.max(max, p.score), 0);
      const violationsTotal = studentExams.reduce((sum, e) => sum + (e.violations || 0), 0);

      const levelsRecord: Record<ConditionalLevel, boolean> = {
        zero: studentPasses.some(p => p.level === 'zero'),
        first: studentPasses.some(p => p.level === 'first'),
        second: studentPasses.some(p => p.level === 'second'),
        third: studentPasses.some(p => p.level === 'third'),
        mixed: studentPasses.some(p => p.level === 'mixed')
      };

      return {
        id: s.id,
        name: s.name,
        group: s.group,
        passedCount: studentPasses.length,
        levels: levelsRecord,
        bestScore,
        lastActive: s.lastActiveAt ? new Date(s.lastActiveAt).toLocaleDateString('es-CR') : 'Reciente',
        violationsTotal,
        attemptsCount: studentExams.length
      };
    }).sort((a, b) => b.passedCount - a.passedCount || a.name.localeCompare(b.name));

    // Recent Activity
    const recentActivity = exams.slice(-15).reverse().map(e => ({
      id: e.id,
      studentName: e.studentName || 'Estudiante',
      studentGroup: e.studentGroup || 'General',
      level: e.level,
      mode: e.mode,
      score: e.score,
      passed: e.score >= 80 && e.status === 'completed',
      date: e.finishedAt || e.startedAt,
      violations: e.violations
    }));

    return {
      studentsCount: totalStudents,
      totalExamsCount: totalExams,
      totalPassesCount: totalPasses,
      averageScore: avgScore,
      passingRate,
      totalViolations,
      notificationsCount: this.db.notifications.length,
      levelStats,
      groupStats,
      scoreDistribution: scoreRanges,
      roster,
      recentActivity,
      notifications: this.db.notifications
    };
  }

  public sendTestNotification(): EmailNotification {
    const testNotif = createEmailNotification({
      studentName: 'Prueba de Sistema (Simulación Docente)',
      studentGroup: 'Verificación',
      level: 'zero',
      score: 100,
      passed: true,
      violations: 0,
      isTest: true
    });
    this.db.notifications.unshift(testNotif);
    this.save();
    return testNotif;
  }

  public resetStudentProgress(studentId: string): void {
    this.db.passes = this.db.passes.filter(p => p.studentId !== studentId);
    this.db.attempts = this.db.attempts.filter(a => a.studentId !== studentId);
    this.save();
  }

  public exportRosterCSV(): string {
    const stats = this.getTeacherStats();
    const headers = ['Estudiante', 'Grupo', 'Niveles Aprobados (de 5)', 'Zero', 'First', 'Second', 'Third', 'Mixed', 'Mejor Calificacion', 'Examenes Rendidos', 'Incidencias Integridad'];
    const rows = stats.roster.map(r => [
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.group.replace(/"/g, '""')}"`,
      r.passedCount,
      r.levels.zero ? 'APROBADO' : 'PENDIENTE',
      r.levels.first ? 'APROBADO' : 'PENDIENTE',
      r.levels.second ? 'APROBADO' : 'PENDIENTE',
      r.levels.third ? 'APROBADO' : 'PENDIENTE',
      r.levels.mixed ? 'APROBADO' : 'PENDIENTE',
      r.bestScore,
      r.attemptsCount,
      r.violationsTotal
    ]);

    return '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
  }
}

export const store = new StoreService();
