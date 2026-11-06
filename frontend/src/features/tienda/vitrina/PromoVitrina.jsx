import css from './PromoVitrina.module.css';

// La promo vigente como "cartel": póster, ticket, notita o pizarra según el estilo.
export function PromoVitrina({ promo }) {
  if (!promo) return null;
  return (
    <section className={css.promo} aria-label="Promoción" data-v="promo">
      <span className={css.sello} data-v="promo-sello">
        Promo
      </span>
      <h2 className={css.titulo} data-v="promo-titulo">
        {promo.titulo}
      </h2>
      {promo.descripcion ? <p className={css.texto}>{promo.descripcion}</p> : null}
    </section>
  );
}
