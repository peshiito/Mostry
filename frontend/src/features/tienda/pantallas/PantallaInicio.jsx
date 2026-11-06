import { RenderPagina } from '../../pagina/RenderPagina.jsx';
import { plantillaDesdeTienda } from '../../pagina/lib/plantilla.js';
import { BarraCarrito } from '../components/BarraCarrito.jsx';
import { PieTienda } from '../components/PieTienda.jsx';
import { useCatalogo } from '../hooks/useCatalogo.js';
import { useTienda } from '../hooks/useTienda.js';
import { BarraSitio } from '../sitio/BarraSitio.jsx';
import { AvisoCerrada } from '../vitrina/AvisosVitrina.jsx';
import css from './PantallaInicio.module.css';

// Inicio de la tienda: la página que armó el comercio ("Armá tu página") o, si
// todavía no armó ninguna, la de siempre. Cada estilo le pone su firma.
export function PantallaInicio() {
  const { tienda, estado } = useTienda();
  const c = useCatalogo();
  const pagina = tienda.pagina ?? plantillaDesdeTienda(tienda);
  return (
    <>
      <BarraSitio />
      <main id="contenido" tabIndex={-1} className={css.vitrina}>
        <RenderPagina
          pagina={pagina}
          tienda={tienda}
          c={c}
          despues={<AvisoCerrada estado={estado} />}
        />
      </main>
      <PieTienda />
      <BarraCarrito />
    </>
  );
}
