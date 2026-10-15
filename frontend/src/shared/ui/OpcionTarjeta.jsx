import css from './OpcionTarjeta.module.css';

// Opción seleccionable grande (radio con forma de tarjeta). Con `multiple` es una
// casilla: `elegido` es true/false y onElegir recibe el valor nuevo.
export function OpcionTarjeta({
  nombre,
  valor,
  elegido,
  onElegir,
  titulo,
  detalle,
  fin,
  multiple,
}) {
  return (
    <label className={css.opcion}>
      <input
        type={multiple ? 'checkbox' : 'radio'}
        name={nombre}
        value={valor}
        checked={multiple ? Boolean(elegido) : elegido === valor}
        onChange={() => onElegir(multiple ? !elegido : valor)}
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
