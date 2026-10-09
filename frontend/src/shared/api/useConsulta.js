import { useCallback, useEffect, useState } from 'react';
import { getCompartido } from './getCompartido.js';

// GET a la API con estados de carga y error. `ruta` null = no consultar todavía.
// "cargando" se deriva: la última respuesta no corresponde a la consulta actual.
export function useConsulta(ruta) {
  const [version, setVersion] = useState(0);
  const [res, setRes] = useState({ clave: null, datos: null, error: null });
  const clave = ruta ? `${ruta}#${version}` : null;
  useEffect(() => {
    if (!clave) return undefined;
    const control = new AbortController();
    getCompartido(ruta, control.signal)
      .then((datos) => setRes({ clave, datos, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setRes({ clave, datos: null, error });
      });
    return () => control.abort();
  }, [ruta, clave]);
  const recargar = useCallback(() => setVersion((v) => v + 1), []);
  const setDatos = useCallback((datos) => setRes((r) => ({ ...r, datos })), []);
  return {
    datos: res.datos,
    cargando: !!clave && res.clave !== clave,
    error: res.clave === clave ? res.error : null,
    recargar,
    setDatos,
  };
}
