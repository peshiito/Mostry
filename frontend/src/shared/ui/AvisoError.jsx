import { Aviso } from './Aviso.jsx';

// Muestra el mensaje genérico que manda la API (nunca detalles internos).
export function AvisoError({ error, titulo }) {
  if (!error) return null;
  return <Aviso tipo="error" titulo={titulo ?? error.message} />;
}
