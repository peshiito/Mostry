import { linkWhatsapp } from '../../../shared/lib/linkSeguro.js';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { EstadoApertura } from '../components/EstadoApertura.jsx';
import { useTienda } from '../hooks/useTienda.js';
import css from './Portada.module.css';

// El hero de la tienda: nombre grande, frase, estado y cómo comprar, con una
// imagen. Si el comercio subió foto de portada va a lo ancho detrás del texto;
// si no, se muestra su producto estrella al lado (estilos/portadas.css).
export function Portada({ imagen }) {
  const { tienda } = useTienda();
  const foto = tienda.portadaUrl ?? imagen;
  const wa = linkWhatsapp(tienda.whatsapp);
  return (
    <section
      className={css.hero}
      data-v="portada"
      data-foto={tienda.portadaUrl ? 'si' : 'no'}
      aria-labelledby="nombre-tienda"
    >
      <div className={css.texto} data-v="texto">
        <span data-v="estado">
          <EstadoApertura />
        </span>
        <h1 id="nombre-tienda" className={css.nombre} data-v="nombre">
          {tienda.nombre}
        </h1>
        {tienda.frase ? (
          <p className={css.frase} data-v="frase">
            {tienda.frase}
          </p>
        ) : null}
        <div className={css.acciones} data-v="acciones">
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
      {foto ? (
        <div className={css.imagen} data-v="imagen">
          <img src={foto} alt="" decoding="async" fetchPriority="high" />
        </div>
      ) : null}
    </section>
  );
}
