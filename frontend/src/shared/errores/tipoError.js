// Clasifica un error de la API (ErrorApi de shared/api/cliente.js) para elegir
// qué pantalla o mensaje mostrar. Nunca muestra detalles internos.
export function tipoError(error) {
  if (!error) return null;
  const status = error.status;
  if (status === 0 || error.codigo === 'sin_conexion') return 'sin_conexion';
  if (status === 401) return 'sesion';
  if (status === 403) return 'permiso';
  if (status === 404 || status === 410) return 'no_existe';
  if (status === 429) return 'limite';
  if (status === 502 || status === 503 || status === 504) return 'mantenimiento';
  if (status >= 500) return 'servidor';
  return 'desconocido';
}
