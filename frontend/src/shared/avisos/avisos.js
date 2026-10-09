// Avisos flotantes ("Se guardó con éxito"), al estilo de Sonner de Emil Kowalski.
// Sin contexto ni hooks para disparar: avisar.exito('Guardado') desde cualquier lado,
// y <Avisos /> montado una sola vez en main.jsx los dibuja.
const DURACION = { exito: 4000, info: 4000, error: 6000 };
const MAXIMO = 3;

let lista = [];
let proximoId = 1;
const oyentes = new Set();

const emitir = () => oyentes.forEach((o) => o());

export const almacenAvisos = {
  leer: () => lista,
  suscribir(oyente) {
    oyentes.add(oyente);
    return () => oyentes.delete(oyente);
  },
};

// Marca el aviso para salir (anima) y lo saca de la lista después.
export function cerrarAviso(id) {
  if (!lista.some((a) => a.id === id && !a.saliendo)) return;
  lista = lista.map((a) => (a.id === id ? { ...a, saliendo: true } : a));
  emitir();
  setTimeout(() => {
    lista = lista.filter((a) => a.id !== id);
    emitir();
  }, 260);
}

// `duracion: Infinity` lo deja fijo hasta que lo cierren; `accion`: { texto, alHacer }.
function crear(tipo, titulo, { descripcion, duracion, accion } = {}) {
  const aviso = {
    id: proximoId++,
    tipo,
    titulo,
    descripcion,
    accion,
    duracion: duracion ?? DURACION[tipo],
  };
  lista = [aviso, ...lista];
  // Los que quedan muy atrás en la pila salen solos (los fijos, como
  // "Hay una versión nueva", se quedan hasta que los cierren).
  lista
    .filter((a) => !a.saliendo && Number.isFinite(a.duracion))
    .slice(MAXIMO)
    .forEach((a) => cerrarAviso(a.id));
  emitir();
  return aviso.id;
}

export const avisar = {
  exito: (titulo, op) => crear('exito', titulo, op),
  error: (titulo, op) => crear('error', titulo, op),
  info: (titulo, op) => crear('info', titulo, op),
};
