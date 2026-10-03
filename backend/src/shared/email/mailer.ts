import nodemailer from 'nodemailer';
import { config } from '../../config/env.js';

export type Email = { para: string; asunto: string; texto: string };
export type Mailer = { enviar(email: Email): Promise<void> };

// SMTP real: Mailpit en local, Resend en producción.
export function crearMailerSmtp(): Mailer {
  const transporte = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PUERTO,
    secure: config.SMTP_PUERTO === 465,
    auth: config.SMTP_USUARIO
      ? { user: config.SMTP_USUARIO, pass: config.SMTP_CLAVE }
      : undefined,
  });
  return {
    async enviar({ para, asunto, texto }) {
      await transporte.sendMail({
        from: config.EMAIL_REMITENTE,
        to: para,
        subject: asunto,
        text: texto,
      });
    },
  };
}
