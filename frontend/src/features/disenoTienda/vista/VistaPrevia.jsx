import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cargarFuentes } from '../../../shared/temaTienda/cargarFuentes.js';
import { derivarTokens } from '../../../shared/temaTienda/derivar.js';
import { CarritoProveedor } from '../../carrito/CarritoContexto.jsx';
import { AjustesProveedor } from '../../pagina/AjustesPagina.jsx';
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
// eligiendo, dentro de un celular. La tienda no se puede tocar; `capa` (opcional)
// dibuja encima, con la pantalla, lo que haga falta (el editor marca los bloques).
export function VistaPrevia({ valor, tema, modo, pagina, compu, capa }) {
  const pantalla = useRef(null);
  const [nodo, setNodo] = useState(null);
  const conPantalla = useCallback((n) => {
    pantalla.current = n;
    setNodo(n);
  }, []);
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
      <div ref={conPantalla} className={css.pantalla} style={{ ...tokens, colorScheme }}>
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
              <AjustesProveedor ajustes={(pagina ?? valor.tienda.pagina)?.ajustes}>
                <Inicio tienda={valor.tienda} pagina={pagina} />
              </AjustesProveedor>
            </div>
          </Tienda.Provider>
        </CarritoProveedor>
      </div>
      {nodo ? capa?.(nodo) : null}
    </div>
  );
}
