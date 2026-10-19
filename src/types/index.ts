export type ConditionalLevel = 'zero' | 'first' | 'second' | 'third' | 'mixed';

export interface Question {
  id: string;
  q: string;
  options: string[];
  why: string;
}

export interface LevelInfo {
  id: ConditionalLevel;
  n: number;
  name: string;
  subtitle: string;
  icon: string;
  tag: string;
  formula: string;
  description: string;
  situations: string[];
  examples: [string, string][];
  errors: string[];
  tips: string;
}

export interface Student {
  id: string;
  name: string;
  group: string;
  pin: string;
  token: string;
  createdAt: string;
  lastActiveAt?: string;
}

export interface PassRecord {
  studentId: string;
  level: ConditionalLevel;
  score: number;
  date: string;
  times: number;
}

export interface ExamAttempt {
  id: string;
  studentId: string;
  studentName?: string;
  studentGroup?: string;
  level: ConditionalLevel;
  mode: 'practice' | 'exam';
  items: {
    id: string;
    options: string[];
  }[];
  answers: Record<number, number>; // index -> choiceIndex
  violations: number;
  status: 'active' | 'completed' | 'annulled';
  score: number;
  startedAt: string;
  finishedAt?: string;
}

export interface EmailNotification {
  id: string;
  recipient: string; // 'profeluisingles@gmail.com'
  studentName: string;
  studentGroup: string;
  level: ConditionalLevel;
  levelName: string;
  score: number;
  passed: boolean;
  violations: number;
  date: string;
  status: 'sent' | 'delivered' | 'simulated' | 'failed';
  subject: string;
  previewText: string;
  bodyHtml: string;
}

export interface StudentState {
  student: {
    id: string;
    name: string;
    group: string;
  };
  passed: Record<ConditionalLevel, { score: number; date: string; times: number }>;
  attempts: {
    id: string;
    level: ConditionalLevel;
    mode: 'practice' | 'exam';
    status: 'active' | 'completed' | 'annulled';
    score: number;
    date: string;
    violations: number;
  }[];
}

export interface TeacherStats {
  studentsCount: number;
  totalExamsCount: number;
  totalPassesCount: number;
  averageScore: number;
  passingRate: number; // percentage 0-100
  totalViolations: number;
  notificationsCount: number;
  levelStats: {
    level: ConditionalLevel;
    name: string;
    passedStudents: number;
    averageScore: number;
    attemptsCount: number;
  }[];
  groupStats: {
    group: string;
    studentsCount: number;
    passesCount: number;
    averageScore: number;
  }[];
  scoreDistribution: {
    range: string;
    count: number;
    label: string;
  }[];
  roster: {
    id: string;
    name: string;
    group: string;
    passedCount: number;
    levels: Record<ConditionalLevel, boolean>;
    bestScore: number;
    lastActive: string;
    violationsTotal: number;
    attemptsCount: number;
  }[];
  recentActivity: {
    id: string;
    studentName: string;
    studentGroup: string;
    level: ConditionalLevel;
    mode: 'practice' | 'exam';
    score: number;
    passed: boolean;
    date: string;
    violations: number;
  }[];
  notifications: EmailNotification[];
}
