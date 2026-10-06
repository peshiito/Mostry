import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { pedidoHasta } from '../../../test/flujoPedido.js';
import { tiendaLista } from '../../../test/tiendaLista.js';
import { borrarComprobantesVencidos } from '../borrarComprobantes.js';

// S3 simulado: la primera llamada falla para la primera clave; después anda.
let llamadas = 0;
vi.mock('../../../shared/archivos/borrarClaves.js', () => ({
  borrarClaves: async (claves: string[]) =>
    llamadas++ === 0 ? [{ clave: claves[0]!, error: 'InternalError' }] : [],
}));

describe('borrarComprobantesVencidos con S3 fallando', () => {
  beforeEach(() => {
    llamadas = 0;
  });

  it('lo que falla queda pendiente (con su clave), se corre 1 h y después se borra', async () => {
    const t = await tiendaLista();
    await pedidoHasta(t, 'pago_aprobado');
    await pedidoHasta(t, 'pago_aprobado');
    await db
      .updateTable('comprobantes')
      .set({ archivoBorrarEn: new Date(Date.now() - 1000) })
      .execute();

    expect(await borrarComprobantesVencidos()).toEqual({ borrados: 1, fallidos: 1 });
    const pendientes = await db
      .selectFrom('comprobantes')
      .select('id')
      .where('archivoClave', 'is not', null)
      .execute();
    expect(pendientes).toHaveLength(1);
    // Lo fallido se corrió 1 h: recién aparece en el turno de dentro de 2 h.
    expect(await borrarComprobantesVencidos()).toEqual({ borrados: 0, fallidos: 0 });
    expect(
      await borrarComprobantesVencidos(new Date(Date.now() + 2 * 3_600_000)),
    ).toEqual({ borrados: 1, fallidos: 0 });
  });
});
