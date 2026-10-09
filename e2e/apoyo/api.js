import { readFile } from 'node:fs/promises';
import { PUERTO_API, PUERTO_WEB } from './entorno.js';

const API = `http://localhost:${PUERTO_API}`;
const origen = (slug) => `http://${slug}.mostry.localhost:${PUERTO_WEB}`;

async function pedir(slug, ruta, opciones = {}) {
  const r = await fetch(API + ruta, {
    ...opciones,
    headers: { Origin: origen(slug), ...opciones.headers },
  });
  const datos = await r.json().catch(() => null);
  if (!r.ok) throw new Error(`${ruta} → ${r.status} ${JSON.stringify(datos)}`);
  return datos;
}

// Lo que haría un comprador por la API pública: pide `nombre` x1 (retiro)
// y, si `conComprobante`, sube el comprobante. Devuelve { numero, token }.
export async function pedidoDeComprador(slug, nombre, cliente, conComprobante = true) {
  const { productos } = await pedir(slug, '/publico/productos');
  const p = productos.find((x) => x.nombre === nombre);
  const pedido = await pedir(slug, '/publico/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tipo: 'inmediato',
      clienteNombre: cliente,
      clienteWhatsapp: '11 5555-0000',
      entrega: 'retiro',
      items: [{ productoId: p.id, cantidad: 1 }],
      totalEsperado: p.precio,
    }),
  });
  if (conComprobante) {
    const f = new FormData();
    const png = await readFile(new URL('../archivos/comprobante.png', import.meta.url));
    f.append('comprobante', new Blob([png], { type: 'image/png' }), 'comprobante.png');
    await pedir(slug, `/publico/pedidos/${pedido.token}/comprobante`, {
      method: 'POST',
      body: f,
    });
  }
  return pedido;
}
