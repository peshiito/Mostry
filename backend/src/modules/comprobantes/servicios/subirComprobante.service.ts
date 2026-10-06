import { randomUUID } from 'node:crypto';
import { borrarConCola } from '../../../shared/archivos/borrarConCola.js';
import { prefijoTienda } from '../../../shared/archivos/claves.js';
import { subirPrivado } from '../../../shared/archivos/privado.js';
import { procesarComprobante } from '../../../shared/archivos/validarComprobante.js';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { pedidosRepo } from '../../pedidos/repositorios/pedidos.repository.js';
import { verSeguimiento } from '../../pedidos/servicios/seguimiento.service.js';
import { comprobantesRepo } from '../repositorios/comprobantes.repository.js';
import { pedidoEsperandoPago, plazoVencido } from './pedidoEsperandoPago.js';

const noSePuede = () =>
  new AppError(
    409,
    'pedido_sin_pago_pendiente',
    'Este pedido no está esperando un comprobante.',
  );

// El comprador sube el comprobante desde su link de seguimiento. El plazo se frena.
export async function subirComprobante(
  tiendaId: TiendaId,
  token: string,
  archivo: Buffer,
) {
  const pedido = await pedidoEsperandoPago(tiendaId, token);
  const procesado = await procesarComprobante(archivo);
  const clave = `${prefijoTienda(tiendaId)}comprobantes/${pedido.id}/${randomUUID()}.${procesado.extension}`;
  await subirPrivado(clave, procesado.datos, procesado.contentType);

  try {
    await db.transaction().execute(async (tx) => {
      const p = await pedidosRepo.bloquear(tx, tiendaId, pedido.id);
      if (p?.estado !== 'pendiente_pago') throw noSePuede();
      // Se re-chequea acá: procesar y subir el archivo puede tardar unos segundos.
      if (p.venceComprobanteEn && p.venceComprobanteEn <= new Date())
        throw plazoVencido();
      await comprobantesRepo.insertar(tx, {
        tiendaId,
        pedidoId: p.id,
        tipo: p.tipo === 'encargo' ? 'sena' : 'pago',
        archivoClave: clave,
        archivoTipo: procesado.tipoOriginal,
        // Retención máxima aunque nadie lo revise (después se fija 2 h o 48 h).
        archivoBorrarEn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      await tx
        .updateTable('pedidos')
        .set({ estado: 'comprobante_enviado', venceComprobanteEn: null })
        .where('tiendaId', '=', tiendaId)
        .where('id', '=', p.id)
        .execute();
    });
  } catch (err) {
    await borrarConCola([clave], 'privado');
    throw err;
  }
  return verSeguimiento(tiendaId, token);
}
