import { useEffect, useMemo, useRef } from 'react';
import { cargarFuentes } from '../../../shared/temaTienda/cargarFuentes.js';
import { derivarTokens } from '../../../shared/temaTienda/derivar.js';
import { CarritoProveedor } from '../../carrito/CarritoContexto.jsx';
import { Tienda } from '../../tienda/TiendaContexto.jsx';
import { useCatalogo } from '../../tienda/hooks/useCatalogo.js';
import { BarraSitio } from '../../tienda/sitio/BarraSitio.jsx';
import { RenderPagina } from '../../pagina/RenderPagina.jsx';
import { plantillaDesdeTienda } from '../../pagina/lib/plantilla.js';
import css from './VistaPrevia.module.css';
import { useZoom } from './useZoom.js';

// La página que se está armando (o la publicada, o la de siempre).
function Inicio({ tienda, pagina }) {
  const c = useCatalogo();
  const doc = pagina ?? tienda.pagina ?? plantillaDesdeTienda(tienda);
  return (
    <>
      <BarraSitio />
      <div className={css.cuerpo} data-contenedor>
        <RenderPagina pagina={doc} tienda={tienda} c={c} />
      </div>
    </>
  );
}

// La vidriera de verdad (mismos componentes y datos) con el diseño que se está
// eligiendo, dentro de un celular. Es solo para mirar: no se puede tocar.
export function VistaPrevia({ valor, tema, modo, pagina, compu }) {
  const pantalla = useRef(null);
  const zoom = useZoom(pantalla, 1280, compu);
  const { 'color-scheme': colorScheme, ...tokens } = useMemo(
    () => derivarTokens(tema, modo),
    [tema, modo],
  );
  useEffect(() => {
    cargarFuentes([tema.fuentes.titulos, tema.fuentes.texto]);
  }, [tema.fuentes.titulos, tema.fuentes.texto]);
  return (
    <div className={`${css.telefono} ${compu ? css.monitor : ''}`}>
      <div ref={pantalla} className={css.pantalla} style={{ ...tokens, colorScheme }}>
        <CarritoProveedor slug={`vista-previa:${valor.tienda.slug}`}>
          <Tienda.Provider value={{ ...valor, tema }}>
            <div
              className={css.vidriera}
              style={compu ? { zoom } : undefined}
              data-estilo={tema.base}
              data-encabezado={tema.encabezado}
              data-forma={tema.forma}
              inert
            >
              <Inicio tienda={valor.tienda} pagina={pagina} />
            </div>
          </Tienda.Provider>
        </CarritoProveedor>
      </div>
    </div>
  );
}
