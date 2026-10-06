const ESPACIO = 12;

// Dónde va cada aviso: índice entre los activos (0 = adelante) y su desplazamiento
// cuando la pila está abierta (la suma de las alturas de los de adelante).
export function ubicar(lista, alturas, abierta) {
  const activos = lista.filter((a) => !a.saliendo);
  const altoFrente = alturas[activos[0]?.id] ?? 0;
  const desplazos = lista.reduce(
    ({ total, lista: l }, a) => ({
      total: a.saliendo ? total : total + (alturas[a.id] ?? 0) + ESPACIO,
      lista: [...l, total],
    }),
    { total: 0, lista: [] },
  );
  const posiciones = lista.map((a, i) => ({
    a,
    desplazo: desplazos.lista[i],
    indice: Math.max(0, activos.indexOf(a)),
  }));
  const cerrada = altoFrente + Math.max(0, activos.length - 1) * ESPACIO;
  return { posiciones, altoFrente, alto: abierta ? desplazos.total : cerrada };
}

// Variables CSS de una tarjeta (posición en la pila y arrastre).
export const estiloAviso = ({ indice, desplazo, alto, altoFrente, dx }) => ({
  '--i': indice,
  '--desplazo': `${desplazo}px`,
  '--alto-propio': `${alto}px`,
  '--alto-frente': `${altoFrente || alto}px`,
  ...(dx ? { '--dx': `${dx}px` } : null),
});
