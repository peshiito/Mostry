import css from './Formularios.module.css';

const BOTONES = [
  ['agregar', 'Agregar al pedido'],
  ['ver', 'Ver producto'],
  ['whatsapp', 'Consultar por WhatsApp'],
];

// Qué botones lleva cada tarjeta de producto (hasta 2). Sin carrito no hay "Agregar".
export function BotonesDeTarjeta({ ajustes, cambiar }) {
  const elegidos = ajustes.tarjeta.botones;
  const opciones = BOTONES.filter(([b]) => ajustes.carrito || b !== 'agregar');
  function alternar(b) {
    const nuevos = elegidos.includes(b)
      ? elegidos.filter((x) => x !== b)
      : [...elegidos, b].slice(-2);
    cambiar({ tarjeta: { ...ajustes.tarjeta, botones: nuevos } });
  }
  return (
    <fieldset className={css.opcion}>
      <legend className={css.etiqueta}>Botones de cada producto (hasta 2)</legend>
      <div className={css.elegidos}>
        {opciones.map(([b, texto]) => (
          <label key={b}>
            <input
              type="checkbox"
              checked={elegidos.includes(b)}
              onChange={() => alternar(b)}
            />
            {texto}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
