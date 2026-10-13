import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { EsqueletoDetalle } from '../../../shared/ui/esqueletos/index.js';
import { NoEncontrada } from '../../../shared/ui/NoEncontrada.jsx';

// Mientras carga la ficha de un cliente, o si no se pudo cargar.
// "No existe" solo si la API dijo 404: un corte de red no borra a nadie.
export function CargaCliente({ error, onReintentar }) {
  if (!error) return <EsqueletoDetalle bloques={2} />;
  if (error.status === 404) return <NoEncontrada zona="panel" volver="/panel/libreta" />;
  return (
    <ErrorCarga error={error} que="la cuenta del cliente" onReintentar={onReintentar} />
  );
}
