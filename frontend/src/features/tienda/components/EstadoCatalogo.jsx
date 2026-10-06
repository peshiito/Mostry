import { Boton } from '../../../shared/ui/Boton.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';

// Mientras carga o si falló el catálogo. Devuelve null si está todo bien.
export function EstadoCatalogo({ cargando, error, onReintentar }) {
  if (cargando) return <Esqueleto filas={5} alto={96} />;
  if (error) {
    return (
      <Estado
        error
        titulo="No pudimos cargar los productos"
        accion={<Boton onClick={onReintentar}>Reintentar</Boton>}
      >
        Revisá tu conexión.
      </Estado>
    );
  }
  return null;
}
