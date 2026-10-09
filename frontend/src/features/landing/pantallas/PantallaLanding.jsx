import { BloqueLanding } from '../components/BloqueLanding.jsx';
import { Cierre } from '../components/Cierre.jsx';
import { Cuadra } from '../components/Cuadra.jsx';
import { HeaderSitio } from '../components/HeaderSitio.jsx';
import { Hero } from '../components/Hero.jsx';
import { PanelBolsillo } from '../components/PanelBolsillo.jsx';
import { PasosPedido } from '../components/PasosPedido.jsx';
import { Precio } from '../components/Precio.jsx';
import { Preguntas } from '../components/Preguntas.jsx';
import { TarjetasIcono } from '../components/TarjetasIcono.jsx';
import { VideoTrailer } from '../components/VideoTrailer.jsx';
import { BENEFICIOS, PROBLEMAS } from '../contenido.js';
import { SECCIONES as S } from '../secciones.js';

// Landing de Mostry: problema → la cuadra (rubros) → un pedido paso a paso →
// el panel → el video → beneficios, precio y preguntas.
export function PantallaLanding() {
  return (
    <>
      <HeaderSitio />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <BloqueLanding fondo="papel" {...S.problema}>
          <TarjetasIcono items={PROBLEMAS} tono="problema" />
        </BloqueLanding>
        <BloqueLanding id="rubros" {...S.cuadra}>
          <Cuadra />
        </BloqueLanding>
        <BloqueLanding fondo="papel" id="como-funciona" {...S.pasos}>
          <PasosPedido />
        </BloqueLanding>
        <BloqueLanding {...S.panel}>
          <PanelBolsillo />
        </BloqueLanding>
        <BloqueLanding fondo="papel" id="video" centrado {...S.video}>
          <VideoTrailer />
        </BloqueLanding>
        <BloqueLanding centrado {...S.beneficios}>
          <TarjetasIcono items={BENEFICIOS} />
        </BloqueLanding>
        <BloqueLanding fondo="papel" id="precio" centrado {...S.precio}>
          <Precio />
        </BloqueLanding>
        <BloqueLanding {...S.preguntas}>
          <Preguntas />
        </BloqueLanding>
      </main>
      <Cierre />
    </>
  );
}
