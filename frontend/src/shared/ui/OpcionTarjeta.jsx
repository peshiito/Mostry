import css from './OpcionTarjeta.module.css';

// Opción seleccionable grande (radio con forma de tarjeta).
export function OpcionTarjeta({
  nombre,
  valor,
  elegido,
  onElegir,
  titulo,
  detalle,
  fin,
}) {
  return (
    <label className={css.opcion}>
      <input
        type="radio"
        name={nombre}
        value={valor}
        checked={elegido === valor}
        onChange={() => onElegir(valor)}
        className={css.radio}
      />
      <span className={css.textos}>
        <span className={css.titulo}>{titulo}</span>
        {detalle ? <span className={css.detalle}>{detalle}</span> : null}
      </span>
      {fin ? <span className={css.fin}>{fin}</span> : null}
    </label>
  );
}
