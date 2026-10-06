import css from './Kpis.module.css';

// Indicadores en fila: [{ etiqueta, valor, tono? }]
export function Kpis({ items }) {
  return (
    <dl className={css.kpis}>
      {items.map((k) => (
        <div key={k.etiqueta} className={css.kpi}>
          <dt className={css.etiqueta}>{k.etiqueta}</dt>
          <dd className={`${css.valor} ${k.tono ? css[k.tono] : ''}`}>{k.valor}</dd>
        </div>
      ))}
    </dl>
  );
}
