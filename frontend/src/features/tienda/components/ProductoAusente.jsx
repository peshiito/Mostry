import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { HeaderTienda } from './HeaderTienda.jsx';

// El producto no llegó: "ya no está" solo si la API dijo 404. Un corte o un
// error del servidor no significan que lo hayan sacado del catálogo.
export function ProductoAusente({ error, onReintentar }) {
  return (
    <>
      <HeaderTienda volver="/catalogo" />
      {error && error.status !== 404 ? (
        <ErrorCarga error={error} que="el producto" onReintentar={onReintentar} />
      ) : (
        <Pagina>
          <Estado nivel={1} icono="search_off" titulo="Ese producto ya no está">
            Puede que lo hayan sacado del catálogo.
          </Estado>
        </Pagina>
      )}
    </>
  );
}
