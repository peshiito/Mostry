import { urlAdmin, urlSitio, urlTienda } from '../../shared/lib/urls.js';
import { Fila } from '../../shared/ui/Fila.jsx';
import { Lista } from '../../shared/ui/Lista.jsx';
import { Pagina } from '../../shared/ui/Pagina.jsx';
import { Seccion } from '../../shared/ui/Seccion.jsx';
import { TituloPagina } from '../../shared/ui/TituloPagina.jsx';
import { RUTAS } from '../../test/rutas.js';

const URL = {
  sitio: urlSitio,
  tienda: (r) => urlTienda('dona-rosa', r),
  panel: (r) => urlTienda('dona-rosa', r),
  admin: urlAdmin,
};

// SOLO DESARROLLO: índice de todas las pantallas y variantes (?demo=...).
export default function IndicePantallas() {
  return (
    <Pagina ancho="lectura">
      <TituloPagina
        titulo="Pantallas de Mostry"
        bajada="Índice de desarrollo. La tienda de ejemplo es la del seed (dona-rosa)."
      />
      {Object.entries(RUTAS).map(([zona, rutas]) => (
        <Seccion key={zona} titulo={zona}>
          <Lista>
            {rutas.map((r) => (
              <Fila key={r} titulo={<a href={URL[zona](r)}>{r}</a>} />
            ))}
          </Lista>
        </Seccion>
      ))}
    </Pagina>
  );
}
