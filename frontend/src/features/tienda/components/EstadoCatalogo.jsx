import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { EsqueletoFilas } from '../../../shared/ui/esqueletos/index.js';

// Mientras carga o si falló el catálogo. Devuelve null si está todo bien.
export function EstadoCatalogo({ cargando, error, onReintentar }) {
  if (cargando) return <EsqueletoFilas foto filas={5} />;
  if (error) {
    return (
      <ErrorCarga
        error={error}
        que="los productos"
        onReintentar={onReintentar}
        conPagina={false}
      />
    );
  }
  return null;
}
