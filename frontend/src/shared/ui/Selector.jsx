import css from './Campo.module.css';

// <select> nativo con el estilo de los campos. Se usa dentro de <Campo>.
export function Selector({ c, opciones, ...props }) {
  return (
    <div className={`${css.caja} ${c.invalido ? css.invalida : ''}`}>
      <select id={c.id} aria-describedby={c.describedBy} className={css.input} {...props}>
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
    </div>
  );
}
