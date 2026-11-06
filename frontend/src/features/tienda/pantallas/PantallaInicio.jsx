import { BarraCarrito } from '../components/BarraCarrito.jsx';
import { PieTienda } from '../components/PieTienda.jsx';
import { useCatalogo } from '../hooks/useCatalogo.js';
import { useTienda } from '../hooks/useTienda.js';
import { fotoEstrella } from '../lib/fotoEstrella.js';
import { BarraSitio } from '../sitio/BarraSitio.jsx';
import { Beneficios } from '../sitio/Beneficios.jsx';
import { CierreContacto } from '../sitio/CierreContacto.jsx';
import { AvisoCerrada } from '../vitrina/AvisosVitrina.jsx';
import { Portada } from '../vitrina/Portada.jsx';
import { SeccionesInicio } from '../vitrina/SeccionesInicio.jsx';
import css from './PantallaInicio.module.css';

// Inicio de la tienda armado como una web de verdad: barra, hero, beneficios,
// las secciones que eligió el comercio, el cierre con WhatsApp y el pie.
// Cada estilo le pone su firma (estilos/*.css).
export function PantallaInicio() {
  const { tienda, estado } = useTienda();
  const c = useCatalogo();
  return (
    <>
      <BarraSitio />
      <Portada imagen={fotoEstrella(c)} />
      <Beneficios tienda={tienda} productos={c.productos} />
      <main id="contenido" tabIndex={-1} className={css.vitrina}>
        <AvisoCerrada estado={estado} />
        <SeccionesInicio tienda={tienda} c={c} />
        <CierreContacto tienda={tienda} />
      </main>
      <PieTienda />
      <BarraCarrito />
    </>
  );
}
