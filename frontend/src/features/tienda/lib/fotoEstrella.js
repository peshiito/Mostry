const conFoto = (p) => p.fotoGrande && !p.fotoGrande.endsWith('/sin-foto.svg');

// La foto de un producto de la casa para el hero o la promo: primero los
// destacados, después el resto. `n` elige otra para no repetir la misma.
export function fotoEstrella(c, n = 0) {
  const lista = [...c.destacados, ...c.productos].filter(conFoto);
  const unicos = [...new Map(lista.map((p) => [p.id, p])).values()];
  return unicos[n]?.fotoGrande ?? unicos[0]?.fotoGrande ?? null;
}
