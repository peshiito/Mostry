import { urlSitio } from '../../../shared/lib/urls.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { textoPremio } from '../../club/lib/textoPremio.js';
import { pieTarjeta } from '../../club/lib/pieTarjeta.js';
import css from './FranjaClub.module.css';

// La tienda tiene club (Lealtad L2): cómo se suman sellos y qué premios hay.
// Sin coral: el botón principal de la vidriera sigue siendo el de comprar.
export function FranjaClub({ club }) {
  if (!club) return null;
  const pie = pieTarjeta(club);
  return (
    <section className={css.franja} aria-labelledby="club-tienda">
      <div className={css.cabeza}>
        <span className={css.icono} aria-hidden="true">
          <Icono nombre="loyalty" />
        </span>
        <div>
          <h2 id="club-tienda" className={css.titulo}>
            Sumá sellos con el {club.nombre}
          </h2>
          <p className={css.bajada}>Mostrá tu QR del Club Mostry cada vez que comprás.</p>
        </div>
      </div>
      <ol className={css.escalera}>
        {club.premios.map((p) => (
          <li key={p.compras} className={css.escalon}>
            <span className={css.numero}>{p.compras}</span>
            <span>{textoPremio(p)}</span>
          </li>
        ))}
      </ol>
      {pie ? <p className={css.pie}>{pie}</p> : null}
      <Boton variante="secundario" icono="qr_code_2" href={urlSitio('/club')}>
        Quiero mi QR
      </Boton>
    </section>
  );
}
