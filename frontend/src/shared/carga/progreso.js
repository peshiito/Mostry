// Progreso real de la carga actual: cuántas tareas (pantallas que se bajan y
// consultas GET) terminaron de las que empezaron. No inventa avances: si hay
// 3 tareas y terminaron 2, va por 2/3. Cuando no queda ninguna, se reinicia.
let empezadas = 0;
let terminadas = 0;
let foto = { activa: false, valor: 1 };
const oyentes = new Set();

function emitir() {
  const activa = terminadas < empezadas;
  foto = { activa, valor: empezadas ? terminadas / empezadas : 1 };
  oyentes.forEach((o) => o());
}

// Devuelve la función que la marca como terminada (salga bien o mal).
export function iniciarTarea() {
  if (terminadas === empezadas) {
    empezadas = 0;
    terminadas = 0;
  }
  empezadas += 1;
  emitir();
  let hecha = false;
  return () => {
    if (hecha) return;
    hecha = true;
    terminadas += 1;
    emitir();
  };
}

export const almacenProgreso = {
  leer: () => foto,
  suscribir(oyente) {
    oyentes.add(oyente);
    return () => oyentes.delete(oyente);
  },
};
