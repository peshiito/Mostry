import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { NoEncontrada } from '../../../shared/ui/NoEncontrada.jsx';

// Mientras carga la ficha de un cliente, o si no se pudo cargar.
// "No existe" solo si la API dijo 404: un corte de red no borra a nadie.
export function CargaCliente({ error, onReintentar }) {
  if (!error) return <Esqueleto filas={3} alto={96} />;
  if (error.status === 404) return <NoEncontrada volver="/panel/libreta" />;
  return <ErrorCarga que="la cuenta del cliente" onReintentar={onReintentar} />;
}
