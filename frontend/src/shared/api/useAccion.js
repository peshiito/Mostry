import { useState } from 'react';
import { avisar } from '../avisos/avisos.js';
import { erroresDeCampos } from './cliente.js';

// Envuelve una llamada que modifica datos: estado "enviando", error general y por campo.
// ejecutar() nunca lanza: devuelve { ok, datos } y deja el error en el estado.
// `exito`: texto del aviso cuando sale bien (o función (datos, ...args) → texto o null).
export function useAccion(fn, { exito } = {}) {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [campos, setCampos] = useState({});
  async function ejecutar(...args) {
    setEnviando(true);
    setError(null);
    setCampos({});
    let datos;
    try {
      datos = await fn(...args);
    } catch (e) {
      setError(e);
      setCampos(erroresDeCampos(e));
      return { ok: false, error: e };
    } finally {
      setEnviando(false);
    }
    // Ya se guardó: si armar el aviso falla, igual es un éxito (no invita a repetir).
    try {
      const texto = typeof exito === 'function' ? exito(datos, ...args) : exito;
      if (texto) avisar.exito(texto);
    } catch {
      /* el aviso es solo un adorno: nunca convierte un guardado en error */
    }
    return { ok: true, datos };
  }
  return { ejecutar, enviando, error, campos, limpiar: () => setError(null) };
}
