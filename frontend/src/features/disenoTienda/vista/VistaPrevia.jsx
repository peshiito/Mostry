import { useEffect, useMemo } from 'react';
import { cargarFuentes } from '../../../shared/temaTienda/cargarFuentes.js';
import { derivarTokens } from '../../../shared/temaTienda/derivar.js';
import { CarritoProveedor } from '../../carrito/CarritoContexto.jsx';
import { Tienda } from '../../tienda/TiendaContexto.jsx';
import { useCatalogo } from '../../tienda/hooks/useCatalogo.js';
import { fotoEstrella } from '../../tienda/lib/fotoEstrella.js';
import { BarraSitio } from '../../tienda/sitio/BarraSitio.jsx';
import { Beneficios } from '../../tienda/sitio/Beneficios.jsx';
import { Portada } from '../../tienda/vitrina/Portada.jsx';
import { SeccionesInicio } from '../../tienda/vitrina/SeccionesInicio.jsx';
import css from './VistaPrevia.module.css';

function Inicio({ tienda }) {
  const c = useCatalogo();
  return (
    <>
      <BarraSitio />
      <Portada imagen={fotoEstrella(c)} />
      <Beneficios tienda={tienda} productos={c.productos} />
      <div className={css.cuerpo}>
        <SeccionesInicio tienda={tienda} c={c} />
      </div>
    </>
  );
}

// La vidriera de verdad (mismos componentes y datos) con el diseño que se está
// eligiendo, dentro de un celular. Es solo para mirar: no se puede tocar.
export function VistaPrevia({ valor, tema, modo }) {
  const { 'color-scheme': colorScheme, ...tokens } = useMemo(
    () => derivarTokens(tema, modo),
    [tema, modo],
  );
  useEffect(() => {
    cargarFuentes([tema.fuentes.titulos, tema.fuentes.texto]);
  }, [tema.fuentes.titulos, tema.fuentes.texto]);
  return (
    <div className={css.telefono}>
      <div className={css.pantalla} style={{ ...tokens, colorScheme }}>
        <CarritoProveedor slug={`vista-previa:${valor.tienda.slug}`}>
          <Tienda.Provider value={{ ...valor, tema }}>
            <div
              className={css.vidriera}
              data-estilo={tema.base}
              data-encabezado={tema.encabezado}
              data-forma={tema.forma}
              inert
            >
              <Inicio tienda={valor.tienda} />
            </div>
          </Tienda.Provider>
        </CarritoProveedor>
      </div>
    </div>
  );
}
