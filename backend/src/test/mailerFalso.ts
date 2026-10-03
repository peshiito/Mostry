import type { Email, Mailer } from '../shared/email/mailer.js';

// Guarda los emails en memoria en vez de mandarlos.
export function crearMailerFalso() {
  const enviados: Email[] = [];
  const mailer: Mailer = {
    async enviar(email) {
      enviados.push(email);
    },
  };
  // Código de 6 dígitos del último email mandado a esa dirección.
  const ultimoCodigo = (para: string) => {
    const email = enviados.filter((e) => e.para === para).at(-1);
    return email?.texto.match(/\b\d{6}\b/)?.[0];
  };
  return { mailer, enviados, ultimoCodigo };
}
