import { Boton } from '../../../shared/ui/Boton.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { PLAN, TRADICIONAL } from '../contenido.js';
import css from './Precio.module.css';

// Web a medida vs. Mostry. El botón va en verde: el coral es el del hero.
export function Precio() {
  return (
    <div className={css.grilla}>
      <div className={`${css.plan} ${css.tradicional}`}>
        <p className={css.nombre}>Web a medida</p>
        <Monto centavos={20000000} tamano="lg" tachado />
        <p className={css.nota}>costo inicial, más mantenimiento</p>
        <ul className={css.lista}>
          {TRADICIONAL.map((t) => (
            <li key={t}>
              <Icono nombre="close" tamano={18} /> {t}
            </li>
          ))}
        </ul>
      </div>
      <div className={`${css.plan} ${css.mostry}`}>
        <p className={css.nombre}>Mostry</p>
        <p className={css.precio}>
          <Monto centavos={1000000} tamano="xl" tono="verde" /> <span>por mes</span>
        </p>
        <p className={css.nota}>Menos de lo que vendés en tres docenas de medialunas.</p>
        <ul className={css.lista}>
          {PLAN.map(([fuerte, resto]) => (
            <li key={fuerte}>
              <Icono nombre="check" tamano={18} />{' '}
              <span>
                <strong>{fuerte}</strong> {resto}
              </span>
            </li>
          ))}
        </ul>
        <Boton variante="verde" tamano="lg" anchoCompleto to="/registro">
          Empezar la prueba gratis
        </Boton>
      </div>
    </div>
  );
}
