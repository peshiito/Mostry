import { BloqueLanding } from '../components/BloqueLanding.jsx';
import { Cierre } from '../components/Cierre.jsx';
import { HeaderSitio } from '../components/HeaderSitio.jsx';
import { Hero } from '../components/Hero.jsx';
import { Precio } from '../components/Precio.jsx';
import { Preguntas } from '../components/Preguntas.jsx';
import { TarjetasIcono } from '../components/TarjetasIcono.jsx';
import { BENEFICIOS, PROBLEMAS } from '../contenido.js';

// Landing de Mostry (Stitch 01 y 02).
export function PantallaLanding() {
  return (
    <>
      <HeaderSitio />
      <main>
        <Hero />
        <BloqueLanding
          fondo="papel"
          cinta="El problema"
          titulo="Las apps de delivery se quedan con tu margen y una web propia sale una fortuna."
        >
          <TarjetasIcono items={PROBLEMAS} tono="problema" />
        </BloqueLanding>
        <BloqueLanding
          centrado
          cinta="Pensado para vos"
          titulo="Todo resuelto como en el mostrador"
        >
          <TarjetasIcono items={BENEFICIOS} />
        </BloqueLanding>
        <BloqueLanding
          fondo="papel"
          centrado
          cinta="Sin letra chica"
          titulo="Un precio claro para cualquier comercio"
        >
          <Precio />
        </BloqueLanding>
        <BloqueLanding cinta="Dudas habituales" titulo="Preguntas frecuentes">
          <Preguntas />
        </BloqueLanding>
      </main>
      <Cierre />
    </>
  );
}
