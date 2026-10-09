import { api } from './cliente.js';

// Si varios componentes piden la misma ruta a la vez, sale un solo pedido y todos
// reciben esa respuesta. No guarda nada: terminado el pedido, el próximo va a la red.
const enVuelo = new Map();

const abortado = () => new DOMException('Consulta cancelada', 'AbortError');

function pedidoCompartido(ruta) {
  let p = enVuelo.get(ruta);
  if (!p) {
    const control = new AbortController();
    p = { usuarios: 0, control, promesa: api(ruta, { senal: control.signal }) };
    const soltar = () => enVuelo.get(ruta) === p && enVuelo.delete(ruta);
    p.promesa.then(soltar, soltar);
    enVuelo.set(ruta, p);
  }
  return p;
}

// `senal` cancela solo a este usuario; el pedido se corta cuando no queda ninguno.
export function getCompartido(ruta, senal) {
  if (senal?.aborted) return Promise.reject(abortado());
  const p = pedidoCompartido(ruta);
  p.usuarios += 1;
  return new Promise((resolver, rechazar) => {
    const salir = () => {
      p.usuarios -= 1;
      if (p.usuarios === 0) {
        if (enVuelo.get(ruta) === p) enVuelo.delete(ruta);
        p.control.abort();
      }
      rechazar(abortado());
    };
    senal?.addEventListener('abort', salir, { once: true });
    p.promesa
      .then(resolver, rechazar)
      .finally(() => senal?.removeEventListener('abort', salir));
  });
}
