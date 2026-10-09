import { URL_MAILPIT } from './entorno.js';

// Último código de 6 dígitos que le llegó a `email` (la API de prueba manda a Mailpit).
export async function ultimoCodigo(email, intentos = 20) {
  for (let i = 0; i < intentos; i++) {
    const r = await fetch(
      `${URL_MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:${email}`)}`,
    );
    const { messages = [] } = await r.json();
    if (messages.length) {
      const m = await (
        await fetch(`${URL_MAILPIT}/api/v1/message/${messages[0].ID}`)
      ).json();
      const codigo = m.Text.match(/\b\d{6}\b/)?.[0];
      if (codigo) return codigo;
    }
    await new Promise((listo) => setTimeout(listo, 250));
  }
  throw new Error(`No llegó ningún código a ${email}`);
}
