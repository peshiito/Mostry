// Validación del checkout en el navegador (el servidor valida igual con Zod).
export function validarDatos(d, entrega) {
  const errores = {};
  if (d.nombre.trim().length < 2) errores.nombre = 'Escribí tu nombre.';
  const digitos = d.whatsapp.replace(/\D/g, '');
  if (digitos.length < 8 || digitos.length > 13)
    errores.whatsapp = 'Revisá el número: código de área y número, sin el 15.';
  if (entrega === 'envio' && d.direccion.trim().length < 5)
    errores.direccion = 'Necesitamos la dirección para el envío.';
  if (
    d.linkMaps &&
    !/^https:\/\/(maps\.app\.goo\.gl|www\.google\.com\/maps|goo\.gl\/maps)\//.test(
      d.linkMaps,
    )
  )
    errores.linkMaps = 'Pegá un link de Google Maps o dejalo vacío.';
  return errores;
}

// Es encargo si la tienda está fuera de horario o algún producto se hace a pedido.
export function esEncargo(items, estadoTienda) {
  return estadoTienda === 'cerrada' || items.some((i) => i.aceptaEncargo);
}
