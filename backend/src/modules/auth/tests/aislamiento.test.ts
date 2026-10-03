import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { beforeEach, describe, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { manejarErrores } from '../../../shared/middlewares/manejarErrores.js';
import { resolverTienda } from '../../../shared/middlewares/resolverTienda.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';
import { origenTienda } from '../../../test/sesionHttp.js';
import { tiendasRepo } from '../../tiendas/tiendas.repository.js';
import { requerirMiembro } from '../middlewares/requerirMiembro.js';
import { requerirSesion } from '../middlewares/requerirSesion.js';

// Una ruta del panel protegida igual que lo van a estar todas las de la Etapa 4.
const appPanel = express();
appPanel.use(cookieParser());
appPanel.get(
  '/panel',
  resolverTienda(tiendasRepo.buscarPorSlug),
  requerirSesion(),
  requerirMiembro,
  (req, res) => {
    res.json({ tienda: req.tienda?.slug });
  },
);
appPanel.use(manejarErrores);

describe('aislamiento entre tiendas con sesión', () => {
  let app: Express;
  let rosa: Awaited<ReturnType<typeof crearCuentaCompleta>>;

  beforeEach(async () => {
    await limpiarBase();
    const correo = crearMailerFalso();
    app = crearApp({ pingDb: async () => {}, mailer: correo.mailer });
    rosa = await crearCuentaCompleta(app, correo, 'dona-rosa');
    await crearCuentaCompleta(app, correo, 'heladeria');
  });

  it('la dueña de A entra al panel de A', async () => {
    await request(appPanel)
      .get('/panel')
      .set('Origin', origenTienda('dona-rosa'))
      .set('Cookie', rosa.cookie)
      .expect(200);
  });

  it('con la misma sesión NO puede operar en el panel de B', async () => {
    const res = request(appPanel).get('/panel').set('Origin', origenTienda('heladeria'));
    await res.set('Cookie', rosa.cookie).expect(403);
  });

  it('sin sesión no entra a ningún panel', async () => {
    await request(appPanel)
      .get('/panel')
      .set('Origin', origenTienda('dona-rosa'))
      .expect(401);
  });

  it('la cookie del panel no sirve en el admin', async () => {
    const yo = request(app).get('/auth/yo').set('Origin', 'http://admin.localhost:5173');
    await yo.set('Cookie', rosa.cookie).expect(401);
  });
});
