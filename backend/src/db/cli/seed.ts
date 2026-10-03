import { config } from '../../config/env.js';
import { db } from '../../shared/db/db.js';
import { logger } from '../../shared/logger.js';
import { donaRosa } from '../seed/datos/donaRosa.js';
import { heladeria } from '../seed/datos/heladeria.js';
import { claveDelSeed } from '../seed/claveDelSeed.js';
import { insertarTienda } from '../seed/insertarTienda.js';

// Carga datos de prueba. Idempotente: saltea lo que ya existe.
async function sembrar(): Promise<void> {
  if (config.NODE_ENV === 'production') throw new Error('El seed no corre en producción');
  const hashClave = await claveDelSeed();

  const admin = await db
    .selectFrom('usuarios')
    .select('id')
    .where('email', '=', 'admin@mostry.test')
    .executeTakeFirst();
  if (!admin) {
    const datos = { email: 'admin@mostry.test', nombre: 'Admin Mostry', esAdmin: true };
    await db
      .insertInto('usuarios')
      .values({ ...datos, hashClave, emailVerificadoEn: new Date() })
      .execute();
    logger.info('✔ admin@mostry.test');
  }

  for (const datos of [donaRosa, heladeria]) {
    const { slug } = datos.tienda;
    const existe = await db
      .selectFrom('tiendas')
      .select('id')
      .where('slug', '=', slug)
      .executeTakeFirst();
    if (existe) {
      logger.info(`· ${slug} ya existía`);
      continue;
    }
    const id = await insertarTienda(db, datos, hashClave);
    logger.info(`✔ ${slug} (id ${id})`);
  }
}

try {
  await sembrar();
} catch (err) {
  logger.error({ err }, 'Falló el seed');
  process.exitCode = 1;
} finally {
  await db.destroy();
}
