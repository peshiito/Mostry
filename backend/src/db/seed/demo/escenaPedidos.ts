import sharp from 'sharp';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { abrirParaDemo } from './abrirParaDemo.js';
import { AL_DIA, type Escena } from './datosPedidos.js';
import { ESPECIALES } from './datosPedidosEspeciales.js';
import { aprobar, comprar, idPedido, subirComprobante } from './pedidos.js';
import type { Sesion } from './sesion.js';

type Ctx = {
  rosa: Sesion;
  tiendaId: TiendaId;
  producto: (n: string) => number;
  tienda: Awaited<ReturnType<typeof abrirParaDemo>>;
};

// Fecha del encargo: dentro de `dias` días, a esa hora de Argentina (UTC−3).
const enDias = ([dias, hora]: [number, number]) => {
  const f = new Date(Date.now() + dias * 86_400_000);
  f.setUTCHours(hora + 3, 0, 0, 0);
  return f;
};

// Un pedido en cada estado del circuito, para recorrer el panel sin cargar nada.
export async function escenaPedidos({ rosa, tiendaId, producto, tienda }: Ctx) {
  // Captura de transferencia de ejemplo (la API la valida y la pasa a WebP).
  const fondo = { width: 600, height: 900, channels: 3 as const, background: '#e9f2ee' };
  const img = await sharp({ create: fondo }).png().toBuffer();
  for (const e of [...AL_DIA, ...ESPECIALES]) await jugar(e);

  async function jugar(e: Escena) {
    if (e.sinSena) await tienda.sinSena();
    const fechaEncargo = e.encargoEnDias && enDias(e.encargoEnDias);
    const c = await comprar('dona-rosa', producto, e.lineas, { ...e, fechaEncargo });
    if (e.sinSena) await tienda.conSena();
    const id = await idPedido(tiendaId, c.numero);
    for (const paso of e.pasos) {
      if (paso === 'comprobante') await subirComprobante(c, img);
      else if (paso === 'aprobar') await aprobar(rosa, tiendaId, c, e.nombre);
      else if (paso === 'cancelar')
        await rosa.post(`/panel/pedidos/${id}/cancelar`, {
          motivo: 'El cliente avisó que no lo va a retirar',
        });
      else await rosa.post(`/panel/pedidos/${id}/estado`, { estado: paso });
    }
  }
}
