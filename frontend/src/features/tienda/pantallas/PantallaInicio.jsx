import { BarraCarrito } from '../components/BarraCarrito.jsx';
import { PieTienda } from '../components/PieTienda.jsx';
import { useCatalogo } from '../hooks/useCatalogo.js';
import { useTienda } from '../hooks/useTienda.js';
import { AvisoCerrada } from '../vitrina/AvisosVitrina.jsx';
import { Cinta } from '../vitrina/Cinta.jsx';
import { Portada } from '../vitrina/Portada.jsx';
import { SeccionesInicio } from '../vitrina/SeccionesInicio.jsx';
import css from './PantallaInicio.module.css';

// Inicio de la tienda (Vidriera 2.0): portada, promo, categorías, lo más
// pedido, catálogo y lo que el comercio sume, en su orden. Cada estilo le pone su firma (estilos/*.css).
export function PantallaInicio() {
  const { tienda, estado } = useTienda();
  const c = useCatalogo();
  return (
    <>
      <Portada />
      <Cinta />
      <main id="contenido" tabIndex={-1} className={css.vitrina}>
        <AvisoCerrada estado={estado} />
        <SeccionesInicio tienda={tienda} c={c} />
      </main>
      <PieTienda />
      <BarraCarrito />
    </>
  );
}
