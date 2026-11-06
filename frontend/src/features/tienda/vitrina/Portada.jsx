import { linkWhatsapp } from '../../../shared/lib/linkSeguro.js';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { LogoTienda } from '../../../shared/ui/LogoTienda.jsx';
import { EstadoApertura } from '../components/EstadoApertura.jsx';
import { fondoPortada } from '../components/fondoPortada.js';
import { useTienda } from '../hooks/useTienda.js';
import { BarraPortada } from './BarraPortada.jsx';
import css from './Portada.module.css';
import bandaCss from './PortadaBanda.module.css';

// Portada de la vidriera (Vidriera 2.0): la "cara" de la tienda. Nombre grande,
// frase, estado y cómo comprar. Con foto de portada si la subió; si no, el color
// y el fondo dibujado del tema. Cada estilo le pone su firma (estilos/*.css).
export function Portada() {
  const { tienda, tema } = useTienda();
  // En el estilo "centrado" la foto va como banda arriba, con el logo encima.
  const banda = tema?.encabezado === 'minimo' && tienda.portadaUrl;
  const wa = linkWhatsapp(tienda.whatsapp);
  return (
    <header
      className={css.portada}
      data-v="portada"
      data-foto={tienda.portadaUrl ? 'si' : 'no'}
      style={banda ? undefined : fondoPortada(tienda.portadaUrl)}
    >
      {banda ? (
        <span
          className={bandaCss.banda}
          data-v="banda"
          style={{ backgroundImage: fondoPortada(tienda.portadaUrl).backgroundImage }}
        />
      ) : null}
      <BarraPortada />
      <div className={css.centro}>
        <span className={css.logoGrande} data-v="logo-grande">
          <LogoTienda url={tienda.logoUrl} tamano={104} />
        </span>
        <span data-v="estado">
          <EstadoApertura />
        </span>
        <h1 className={css.nombre} data-v="nombre">
          {tienda.nombre}
        </h1>
        {tienda.frase ? <p className={css.frase}>{tienda.frase}</p> : null}
        <div className={css.acciones}>
          <a href="#productos" className={css.cta} data-v="cta">
            Ver productos <Icono nombre="arrow_forward" tamano={18} />
          </a>
          {wa ? (
            <a href={wa} className={css.cta2} data-v="cta2" rel="noopener noreferrer">
              <Icono nombre="chat" tamano={18} /> Escribinos
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}
