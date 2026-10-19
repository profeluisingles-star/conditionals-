import { ConditionalLevel, EmailNotification } from '../types';
import { TEACHER_EMAIL, getLevelMeta } from '../data/levels';

export function createEmailNotification(params: {
  studentName: string;
  studentGroup: string;
  level: ConditionalLevel;
  score: number;
  passed: boolean;
  violations: number;
  date?: string;
  isTest?: boolean;
}): EmailNotification {
  const { studentName, studentGroup, level, score, passed, violations, isTest } = params;
  const levelMeta = getLevelMeta(level);
  const now = params.date || new Date().toLocaleString('es-CR', {
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  const subject = isTest
    ? `🧪 IF LAB [Prueba]: Verificación de canal de alertas para ${TEACHER_EMAIL}`
    : passed
    ? `🎓 IF LAB: ¡${studentName} (${studentGroup}) aprobó ${levelMeta.name} con ${score}/100!`
    : `📝 IF LAB: ${studentName} (${studentGroup}) rindió examen de ${levelMeta.name} (${score}/100)`;

  const previewText = passed
    ? `${studentName} del grupo ${studentGroup} superó con éxito la evaluación de ${levelMeta.name} con calificación de ${score}/100.`
    : `${studentName} del grupo ${studentGroup} completó el examen de ${levelMeta.name} obteniendo ${score}/100.`;

  const integrityText = violations === 0
    ? '✅ Evaluación 100% íntegra (0 cambios de pestaña o salidas de ventana).'
    : `⚠️ Se registraron ${violations} incidencia(s) de foco/cambio de pestaña durante la prueba.`;

  const bodyHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6ff; margin: 0; padding: 24px; color: #182139; }
    .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #29265d 0%, #4f448f 100%); color: #ffffff; padding: 32px 28px; }
    .brand { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; display: inline-flex; align-items: center; gap: 8px; }
    .tag { background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 11px; text-transform: uppercase; font-weight: 700; margin-left: 8px; }
    .title { font-size: 24px; font-weight: 800; margin: 16px 0 6px 0; }
    .subtitle { font-size: 14px; color: #d6d3f8; margin: 0; }
    .content { padding: 28px; }
    .score-card { background: ${passed ? '#ecfdf5' : '#fffbeb'}; border: 1.5px solid ${passed ? '#a7f3d0' : '#fde68a'}; border-radius: 16px; padding: 20px; margin: 20px 0; text-align: center; }
    .score-val { font-size: 44px; font-weight: 900; color: ${passed ? '#065f46' : '#92400e'}; line-height: 1; }
    .score-label { font-size: 13px; font-weight: 700; color: ${passed ? '#047857' : '#b45309'}; text-transform: uppercase; margin-top: 6px; }
    .data-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    .data-table td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .data-table td.label { color: #64748b; font-weight: 600; width: 38%; }
    .data-table td.val { color: #0f172a; font-weight: 700; }
    .integrity-box { background: #f8fafc; border-radius: 12px; padding: 14px 16px; font-size: 13px; color: #475569; margin-top: 16px; }
    .footer { background: #f8fafc; padding: 20px 28px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="brand">
        <span>IF LAB · English Conditionals</span>
        <span class="tag">Notificación Docente</span>
      </div>
      <h1 class="title">${isTest ? 'Prueba de Sistema de Notificación' : passed ? '¡Nuevo Nivel Aprobado!' : 'Examen de Condicional Completado'}</h1>
      <p class="subtitle">Destinatario configurado: ${TEACHER_EMAIL}</p>
    </div>
    <div class="content">
      <p style="font-size: 15px; line-height: 1.5; margin-top: 0;">Estimado(a) <strong>Profesor Luis</strong>,</p>
      <p style="font-size: 14px; color: #475569;">
        ${previewText}
      </p>

      <div class="score-card">
        <div class="score-val">${score} <span style="font-size: 20px;">/ 100</span></div>
        <div class="score-label">${passed ? '⭐ APROBADO (Nota mínima 80/100 cumplida)' : '🌱 PENDIENTE DE APROBACIÓN'}</div>
      </div>

      <table class="data-table">
        <tr>
          <td class="label">Estudiante</td>
          <td class="val">${studentName}</td>
        </tr>
        <tr>
          <td class="label">Grupo / Sección</td>
          <td class="val">${studentGroup}</td>
        </tr>
        <tr>
          <td class="label">Nivel Académico</td>
          <td class="val">${levelMeta.icon} ${levelMeta.name} (${levelMeta.tag})</td>
        </tr>
        <tr>
          <td class="label">Fecha y Hora</td>
          <td class="val">${now}</td>
        </tr>
        <tr>
          <td class="label">Estado de Intento</td>
          <td class="val">${passed ? 'Aprobado y Desbloqueado' : 'Requiere Práctica Adicional'}</td>
        </tr>
      </table>

      <div class="integrity-box">
        <strong>Reporte de Supervisión Automática:</strong><br/>
        ${integrityText}
      </div>
    </div>
    <div class="footer">
      Este reporte fue generado automáticamente por la plataforma educativa <strong>IF LAB</strong>.<br/>
      Canal oficial de notificaciones: <strong>${TEACHER_EMAIL}</strong>.
    </div>
  </div>
</body>
</html>
  `.trim();

  return {
    id: 'notif_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    recipient: TEACHER_EMAIL,
    studentName,
    studentGroup,
    level,
    levelName: levelMeta.name,
    score,
    passed,
    violations,
    date: now,
    status: 'delivered',
    subject,
    previewText,
    bodyHtml
  };
}

export function openMailClient(notification: EmailNotification) {
  const subjectEncoded = encodeURIComponent(notification.subject);
  const bodyText = `
Reporte Oficial de Evaluación - IF LAB
Destinatario: ${notification.recipient}

Estudiante: ${notification.studentName}
Grupo: ${notification.studentGroup}
Nivel: ${notification.levelName}
Calificación: ${notification.score}/100
Estado: ${notification.passed ? 'APROBADO' : 'NO APROBADO'}
Fecha: ${notification.date}
Incidencias de Integridad: ${notification.violations}

Este es un reporte automático del Laboratorio de Condicionales IF LAB.
  `.trim();
  const bodyEncoded = encodeURIComponent(bodyText);
  window.open(`mailto:${notification.recipient}?subject=${subjectEncoded}&body=${bodyEncoded}`, '_blank');
}
