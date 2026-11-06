import { Link } from 'react-router';
import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './PromoVitrina.module.css';

// Banner grande con texto, botón y una imagen al lado (como el "Up to 50% off"
// de las tiendas grandes). Lo usa el bloque Banner: la promo vigente o uno propio.
export function PromoVitrina({ sello, titulo, texto, boton, imagen }) {
  if (!titulo) return null;
  const Enlace = boton?.interno ? Link : 'a';
  return (
    <section className={css.promo} aria-label={sello ?? titulo} data-v="promo">
      <div className={css.textos}>
        {sello ? (
          <span className={css.sello} data-v="promo-sello">
            {sello}
          </span>
        ) : null}
        <h2 className={css.titulo} data-v="promo-titulo">
          {titulo}
        </h2>
        {texto ? <p className={css.texto}>{texto}</p> : null}
        {boton ? (
          <Enlace
            {...(boton.interno ? { to: boton.href } : { href: boton.href })}
            {...(boton.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={css.boton}
            data-v="promo-boton"
          >
            {boton.texto} <Icono nombre="arrow_forward" tamano={18} />
          </Enlace>
        ) : null}
      </div>
      {imagen ? <img className={css.imagen} src={imagen} alt="" loading="lazy" /> : null}
    </section>
  );
}
