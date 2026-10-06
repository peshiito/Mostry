import css from './BarrasDias.module.css';

// Barras simples de ventas por día (en miles de pesos). Con texto para lectores.
export function BarrasDias({ valores, etiquetas }) {
  const max = Math.max(...valores);
  return (
    <figure className={css.figura}>
      <div className={css.barras} aria-hidden="true">
        {valores.map((v, i) => (
          <div key={etiquetas[i]} className={css.columna}>
            <span className={css.barra} style={{ height: `${(v / max) * 100}%` }} />
            <span className={css.dia}>{etiquetas[i]}</span>
          </div>
        ))}
      </div>
      <figcaption className="soloLector">
        {valores.map((v, i) => `${etiquetas[i]}: ${v} mil pesos`).join(', ')}
      </figcaption>
    </figure>
  );
}
