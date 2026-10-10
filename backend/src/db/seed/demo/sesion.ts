import request from 'supertest';
import { crearApp } from '../../../app.js';
import { config } from '../../../config/env.js';

const sinMails = { enviar: async () => {} };
const origen = (sub: string) =>
  `${config.ORIGEN_PROTOCOLO}://${sub}.${config.DOMINIO_BASE}`;
type Pedido = request.Test;

// Una "pestaña" contra la API real, en el mismo proceso: la demo pasa por las
// mismas reglas que un usuario de verdad. Cada sesión es una app nueva (sus
// límites de pedidos por minuto arrancan de cero).
export async function sesion(sub: string, email?: string) {
  const app = crearApp({ pingDb: async () => {}, mailer: sinMails });
  let cookie = '';
  const con = (t: Pedido) =>
    cookie
      ? t.set('Origin', origen(sub)).set('Cookie', cookie)
      : t.set('Origin', origen(sub));
  const ok = async (t: Pedido) => {
    const r = await t;
    if (r.status >= 300) {
      const e = new Error(`${r.status} ${JSON.stringify(r.body)}`) as Error & {
        body?: unknown;
      };
      e.body = r.body;
      throw e;
    }
    return r.body;
  };
  if (email) {
    const login = await con(request(app).post('/auth/login')).send({
      email,
      clave: config.SEED_CLAVE,
    });
    if (login.status !== 200)
      throw new Error(`No se pudo entrar como ${email}: ${login.status}`);
    const crudas = login.headers['set-cookie'] as unknown as string[];
    cookie = crudas.find((c) => c.startsWith('__Host-'))!.split(';')[0]!;
  }
  return {
    get: (ruta: string) => ok(con(request(app).get(ruta))),
    post: (ruta: string, cuerpo: object = {}) =>
      ok(con(request(app).post(ruta)).send(cuerpo)),
    patch: (ruta: string, cuerpo: object) =>
      ok(con(request(app).patch(ruta)).send(cuerpo)),
    subir: (ruta: string, campo: string, datos: Buffer) =>
      ok(
        con(request(app).post(ruta)).attach(campo, datos, {
          filename: 'captura.png',
          contentType: 'image/png',
        }),
      ),
  };
}
export type Sesion = Awaited<ReturnType<typeof sesion>>;
