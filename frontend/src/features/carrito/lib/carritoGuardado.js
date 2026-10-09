// Lee el carrito guardado en sessionStorage sin confiar en él: cualquiera puede
// editarlo a mano. Se descarta lo que no tenga la forma esperada, así un valor
// roto no tira abajo la tienda. (Igual el servidor recalcula todo al comprar.)
const entero = (n, min, max) => Number.isInteger(n) && n >= min && n <= max;
const texto = (s) => typeof s === 'string' && s.length <= 2000;
// Foto: solo rutas propias o https (nada de javascript:, data:, etc.).
const fotoSegura = (f) => typeof f === 'string' && /^(\/(?!\/)|https?:\/\/)/.test(f);

const itemValido = (i) =>
  i !== null &&
  typeof i === 'object' &&
  entero(i.id, 1, Number.MAX_SAFE_INTEGER) &&
  texto(i.nombre) &&
  entero(i.precio, 0, 1e10) &&
  entero(i.cantidad, 1, 999);

const limpiar = (i) => ({
  id: i.id,
  nombre: i.nombre,
  precio: i.precio,
  cantidad: i.cantidad,
  foto: fotoSegura(i.foto) ? i.foto : '/sin-foto.svg',
  descripcion: texto(i.descripcion) ? i.descripcion : '',
  aceptaEncargo: i.aceptaEncargo === true,
});

export function leerCarrito(clave) {
  try {
    const guardado = JSON.parse(sessionStorage.getItem(clave));
    return Array.isArray(guardado) ? guardado.filter(itemValido).map(limpiar) : [];
  } catch {
    return []; // JSON roto o sin acceso al almacenamiento
  }
}
