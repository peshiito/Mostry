import { useRef, useState } from 'react';
import { LOCALES } from '../locales.js';
import { Celular } from './Celular.jsx';
import css from './Cuadra.module.css';
import { Local } from './Local.jsx';

const PANTALLAS = LOCALES.map((l) => ({
  src: `/landing/cuadra/${l.id}.webp`,
  alt: `Tienda de ${l.nombre} (${l.rubro.toLowerCase()}) hecha con Mostry`,
}));

// La cuadra: cinco comercios de distintos rubros, cada uno con su toldo.
// Elegís un local y el celular muestra su tienda real. Flechas para recorrerla.
export function Cuadra() {
  const [actual, setActual] = useState(0);
  const locales = useRef([]);
  const l = LOCALES[actual];
  function alTeclear(e) {
    const total = LOCALES.length;
    const destino = {
      ArrowRight: actual + 1,
      ArrowLeft: actual - 1,
      Home: 0,
      End: total - 1,
    }[e.key];
    if (destino === undefined) return;
    e.preventDefault();
    const n = (destino + total) % total;
    setActual(n);
    locales.current[n]?.focus();
  }
  return (
    <div className={css.cuadra}>
      <div
        role="tablist"
        aria-label="Comercios de ejemplo"
        className={css.calle}
        onKeyDown={alTeclear}
      >
        {LOCALES.map((loc, i) => (
          <Local
            key={loc.id}
            ref={(el) => (locales.current[i] = el)}
            local={loc}
            elegido={i === actual}
            onElegir={() => setActual(i)}
          />
        ))}
      </div>
      <div
        role="tabpanel"
        id="vidriera-local"
        aria-labelledby={`local-${l.id}`}
        className={css.vista}
      >
        <Celular imagenes={PANTALLAS} actual={actual} />
        <div key={l.id} className={css.ficha}>
          <p className={css.rubro}>{l.rubro}</p>
          <h3 className={css.nombre}>{l.nombre}</h3>
          <p className={css.dominio} translate="no">
            {l.dominio}.mostry.com.ar
          </p>
          <p className={css.uso}>{l.uso}</p>
        </div>
      </div>
    </div>
  );
}
