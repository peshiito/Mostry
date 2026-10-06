import { useSearchParams } from 'react-router';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { HeaderSitio } from '../components/HeaderSitio.jsx';
import { LEGALES } from '../legales.js';
import css from './PantallaLegal.module.css';

const PESTANAS = [
  { valor: 'terminos', texto: 'Términos' },
  { valor: 'privacidad', texto: 'Privacidad' },
];

// Términos y privacidad (Stitch 03).
export function PantallaLegal() {
  const [params, setParams] = useSearchParams();
  const pestana = params.has('privacidad') ? 'privacidad' : 'terminos';
  return (
    <>
      <HeaderSitio />
      <Pagina ancho="lectura">
        <TituloPagina
          titulo={
            pestana === 'terminos' ? 'Términos y condiciones' : 'Política de privacidad'
          }
        />
        <Segmentado
          etiqueta="Documento"
          opciones={PESTANAS}
          valor={pestana}
          onCambio={(v) => setParams(v === 'privacidad' ? { privacidad: '' } : {})}
        />
        <Aviso tipo="alerta" titulo="Borrador para revisar con un abogado" />
        {LEGALES[pestana].map(([titulo, texto], i) => (
          <section key={titulo} className={css.seccion}>
            <h2 className={css.titulo}>
              {i + 1}. {titulo}
            </h2>
            <p>{texto}</p>
          </section>
        ))}
      </Pagina>
    </>
  );
}
