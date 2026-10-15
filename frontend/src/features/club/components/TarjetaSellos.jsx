import { Icono } from '../../../shared/ui/Icono.jsx';
import { textoPremio } from '../lib/textoPremio.js';
import css from './TarjetaSellos.module.css';

// La tarjeta de sellos de una tienda: una casilla por compra hasta el último
// premio; las casillas con premio llevan un regalo. Sirve de vista previa en el
// panel y, desde L3, en "Mis tiendas" del Club (con los sellos del cliente).
export function TarjetaSellos({ nombre, premios, sellos = 0, pie }) {
  const total = premios.at(-1)?.compras ?? 0;
  const conPremio = new Set(premios.map((p) => p.compras));
  return (
    <article className={css.tarjeta} aria-label={`Tarjeta de ${nombre}`}>
      <header className={css.cabeza}>
        <h3 className={css.nombre}>{nombre}</h3>
        <span className={css.cuenta}>
          {sellos} / {total}
        </span>
      </header>
      <ol className={css.casillas} aria-label={`${sellos} sellos de ${total}`}>
        {Array.from({ length: total }, (_, i) => (
          <li
            key={i}
            className={`${css.casilla} ${i < sellos ? css.llena : ''} ${
              conPremio.has(i + 1) ? css.premio : ''
            }`}
          >
            {conPremio.has(i + 1) ? (
              <Icono nombre="redeem" tamano={16} />
            ) : (
              <span aria-hidden="true">{i + 1}</span>
            )}
          </li>
        ))}
      </ol>
      <ul className={css.premios}>
        {premios.map((p) => (
          <li key={p.compras} className={sellos >= p.compras ? css.listo : ''}>
            <strong>A las {p.compras}:</strong> {textoPremio(p)}
          </li>
        ))}
      </ul>
      {pie ? <p className={css.pie}>{pie}</p> : null}
    </article>
  );
}
