import { ConditionalLevel, LevelInfo, Question } from '../types';
import questionBankRaw from './questionBank.json';

export const LEVELS: LevelInfo[] = [
  {
    id: 'zero',
    n: 1,
    name: 'Zero Conditional',
    subtitle: 'Hechos, leyes científicas y verdades universales',
    icon: '🌍',
    tag: 'El mundo real',
    formula: 'If + Present Simple, ... Present Simple',
    description: 'Se utiliza para describir hechos científicos, hábitos cotidianos, reglas y situaciones donde siempre que ocurre la condición A, invariablemente ocurre el resultado B.',
    situations: [
      'Hechos de la naturaleza y leyes de la física o química',
      'Hábitos, rutinas e instrucciones generales',
      'Relaciones directas de causa y efecto permanentes'
    ],
    examples: [
      ['If you heat ice, it melts.', 'Si calientas hielo, se derrite.'],
      ['If I am tired, I go to bed early.', 'Si estoy cansado, me acuesto temprano.'],
      ['When it rains, the streets get wet.', 'Cuando llueve, las calles se mojan.'],
      ['If people do not drink water, they become dehydrated.', 'Si la gente no toma agua, se deshidrata.']
    ],
    errors: [
      '❌ If you will heat ice, it melts. (Nunca uses will en la condición del zero conditional)',
      '✅ If you heat ice, it melts.'
    ],
    tips: 'Puedes sustituir “If” por “When” sin alterar el significado cuando se trata de una verdad general recurrente.'
  },
  {
    id: 'first',
    n: 2,
    name: 'First Conditional',
    subtitle: 'Posibilidades reales y consecuencias probables en el futuro',
    icon: '🚀',
    tag: 'El futuro posible',
    formula: 'If + Present Simple, ... will / won’t + Base Verb',
    description: 'Expresa una condición real o muy probable en el presente/futuro y su resultado esperado. Aunque la acción ocurrirá a futuro, la cláusula después de “if” va en presente simple.',
    situations: [
      'Predicciones fundamentadas sobre el futuro próximo',
      'Promesas, ofertas y advertencias importantes',
      'Condiciones necesarias para que ocurra un evento futuro'
    ],
    examples: [
      ['If it rains tomorrow, we will stay at home.', 'Si llueve mañana, nos quedaremos en casa.'],
      ['If you study hard, you will pass the exam.', 'Si estudias con dedicación, aprobarás el examen.'],
      ['Unless you hurry, you will miss the bus.', 'A menos que te apures, perderás el autobús.'],
      ['If he feels better tomorrow, he will go to school.', 'Si se siente mejor mañana, irá al colegio.']
    ],
    errors: [
      '❌ If it will rain tomorrow, we will stay home.',
      '✅ If it rains tomorrow, we will stay home.'
    ],
    tips: '“Unless” equivale a “If ... not” (a menos que / si no). En la cláusula con “if” NO usamos will.'
  },
  {
    id: 'second',
    n: 3,
    name: 'Second Conditional',
    subtitle: 'Situaciones hipotéticas, imaginarias o poco probables en el presente',
    icon: '💭',
    tag: 'Imagina que...',
    formula: 'If + Past Simple, ... would / wouldn’t + Base Verb',
    description: 'Se utiliza para situaciones irreales, sueños, suposiciones presentes o futuras, y para dar consejos empáticos (“If I were you...”).',
    situations: [
      'Sueños, fantasías y deseos hipotéticos',
      'Situaciones contrarias a la realidad actual',
      'Consejos y recomendaciones empáticas (If I were you...)'
    ],
    examples: [
      ['If I had more free time, I would learn Italian.', 'Si tuviera más tiempo libre, aprendería italiano.'],
      ['If I were you, I would apologize to her.', 'Si yo fuera tú, le pediría disculpas.'],
      ['If we lived near the beach, we would swim every morning.', 'Si viviéramos cerca de la playa, nadaríamos cada mañana.'],
      ['If I won the lottery, I would travel around the world.', 'Si ganara la lotería, viajaría por todo el mundo.']
    ],
    errors: [
      '❌ If I would have money, I would buy a car.',
      '✅ If I had money, I would buy a car.'
    ],
    tips: 'En el inglés formal e hipotético se usa preferentemente “were” para todas las personas gramaticales: “If I were...”, “If she were...”.'
  },
  {
    id: 'third',
    n: 4,
    name: 'Third Conditional',
    subtitle: 'Un pasado alternativo: lo que pudo haber sido pero no fue',
    icon: '⏳',
    tag: '¿Y si hubiera...?',
    formula: 'If + Past Perfect (had + V3), ... would have + Past Participle',
    description: 'Imagina cómo habría sido el resultado si una acción del pasado hubiese ocurrido de otra manera. Se utiliza principalmente para expresar arrepentimiento, alivio o análisis histórico.',
    situations: [
      'Reflexión sobre decisiones pasadas que ya no pueden alterarse',
      'Arrepentimientos y lecciones aprendidas',
      'Análisis de causas y efectos en eventos históricos o personales'
    ],
    examples: [
      ['If I had studied more, I would have passed the exam.', 'Si hubiera estudiado más, habría aprobado el examen.'],
      ['If we had left earlier, we would have caught the train.', 'Si hubiéramos salido antes, habríamos alcanzado el tren.'],
      ['If you had told me the truth, I would have helped you.', 'Si me hubieras dicho la verdad, te habría ayudado.'],
      ['If the alarm had rung, we would have woken up on time.', 'Si la alarma hubiera sonado, nos habríamos levantado a tiempo.']
    ],
    errors: [
      '❌ If I would have studied, I would have passed.',
      '✅ If I had studied, I would have passed.'
    ],
    tips: 'Recuerda que Past Perfect se forma con had + participio pasado (V3). Cuidado con los verbos irregulares como go-went-gone, see-saw-seen.'
  },
  {
    id: 'mixed',
    n: 5,
    name: 'Mixed Conditionals',
    subtitle: 'Conexión de dos tiempos diferentes: pasado y presente',
    icon: '🪄',
    tag: 'El puente temporal',
    formula: 'If + Past Perfect, ... would + Base Verb (Now)',
    description: 'Conecta una causa imaginaria en el pasado con una consecuencia en el presente (o viceversa: una condición permanente presente que afectó un resultado pasado).',
    situations: [
      'Causa pasada no realizada ➔ Consecuencia directa en el presente',
      'Condición o rasgo presente ➔ Consecuencia alternativa en el pasado',
      'Lectura de pistas temporales clave como “now”, “today”, “yesterday”'
    ],
    examples: [
      ['If I had gone to bed earlier, I would not be tired now.', 'Si me hubiera acostado antes, ahora no estaría cansado.'],
      ['If she had learned English as a child, she would speak it fluently now.', 'Si hubiera aprendido inglés de niña, ahora lo hablaría con fluidez.'],
      ['If I were more organized, I would have finished the project yesterday.', 'Si fuera más organizado (rasgo presente), ayer habría terminado el proyecto.'],
      ['If we had taken that job, we would live in another city today.', 'Si hubiéramos aceptado ese trabajo, hoy viviríamos en otra ciudad.']
    ],
    errors: [
      '❌ If I had slept earlier, I would have felt good now.',
      '✅ If I had slept earlier, I would feel good now. (Usa would + base verb para el resultado presente)'
    ],
    tips: 'Busca siempre marcadores temporales: si ves “now” o “today” en el resultado, apunta a la consecuencia en presente (would + infinitivo).'
  }
];

export const QUESTION_BANK: Record<ConditionalLevel, Question[]> = questionBankRaw as Record<ConditionalLevel, Question[]>;

export const TEACHER_EMAIL = 'profeluisingles@gmail.com';

export function getLevelMeta(level: ConditionalLevel): LevelInfo {
  return LEVELS.find(l => l.id === level) || LEVELS[0];
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
