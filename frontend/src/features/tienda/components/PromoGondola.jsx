import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './PromoGondola.module.css';

// Promo vigente como cartelito de góndola (título y descripción, sección 5).
export function PromoGondola({ promo }) {
  if (!promo) return null;
  return (
    <section className={css.promo} aria-label="Promoción">
      <div className={css.textos}>
        <span className={css.sello}>
          <Icono nombre="sell" tamano={16} /> Promo
        </span>
        <h2 className={css.titulo}>{promo.titulo}</h2>
        {promo.descripcion ? <p>{promo.descripcion}</p> : null}
      </div>
    </section>
  );
}
