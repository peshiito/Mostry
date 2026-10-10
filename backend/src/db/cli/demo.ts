import { config } from '../../config/env.js';
import { db } from '../../shared/db/db.js';
import { logger } from '../../shared/logger.js';
import { abrirParaDemo } from '../seed/demo/abrirParaDemo.js';
import { escenaAyuda } from '../seed/demo/escenaAyuda.js';
import { escenaCaja } from '../seed/demo/escenaCaja.js';
import { escenaLibreta } from '../seed/demo/escenaLibreta.js';
import { escenaPedidos } from '../seed/demo/escenaPedidos.js';
import { idsDe } from '../seed/demo/ids.js';
import { sesion } from '../seed/demo/sesion.js';

// Datos de demo encima del seed: pedidos en todos los estados, caja, gastos,
// fiados, reportes y soporte. Todo pasa por la API real (mismas reglas que un
// usuario). Para empezar de cero: npm run db:reset && npm run db:demo.
async function cargarDemo(): Promise<void> {
  if (config.NODE_ENV === 'production') throw new Error('La demo no corre en producción');
  const { tiendaId, producto } = await idsDe('dona-rosa');
  const yaHay = await db
    .selectFrom('pedidos')
    .select('id')
    .where('tiendaId', '=', tiendaId)
    .executeTakeFirst();
  if (yaHay) {
    logger.warn(
      'Doña Rosa ya tiene pedidos: la demo ya estaba cargada (para empezar de cero: npm run db:reset).',
    );
    return;
  }
  const rosa = await sesion('dona-rosa', 'rosa@dona-rosa.test');
  const admin = await sesion('admin', 'admin@mostry.test');
  const tienda = await abrirParaDemo(tiendaId);
  try {
    await escenaCaja(rosa, tiendaId);
    await escenaPedidos({ rosa, tiendaId, producto, tienda });
    await escenaLibreta(rosa);
    await escenaAyuda(rosa, admin, tiendaId, producto('Docena surtida'));
  } finally {
    await tienda.restaurar();
  }
  logger.warn(
    '✔ Demo cargada: Doña Rosa con pedidos, caja, fiados y reportes; Heladería por vencer.',
  );
}

try {
  await cargarDemo();
} catch (err) {
  logger.error({ err }, 'Falló la carga de la demo');
  process.exitCode = 1;
} finally {
  await db.destroy();
}
