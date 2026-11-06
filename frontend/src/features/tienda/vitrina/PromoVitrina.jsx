import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './PromoVitrina.module.css';

// La promo vigente como banner grande, con un producto de la casa al lado
// (como el "Up to 50% off" de las tiendas grandes).
export function PromoVitrina({ promo, imagen }) {
  if (!promo) return null;
  return (
    <section className={css.promo} aria-label="Promoción" data-v="promo">
      <div className={css.textos}>
        <span className={css.sello} data-v="promo-sello">
          Promo
        </span>
        <h2 className={css.titulo} data-v="promo-titulo">
          {promo.titulo}
        </h2>
        {promo.descripcion ? <p className={css.texto}>{promo.descripcion}</p> : null}
        <a href="#productos" className={css.boton} data-v="promo-boton">
          Aprovechar <Icono nombre="arrow_forward" tamano={18} />
        </a>
      </div>
      {imagen ? <img className={css.imagen} src={imagen} alt="" loading="lazy" /> : null}
    </section>
  );
}
