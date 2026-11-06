import css from './Formularios.module.css';

// Elegir productos a mano (hasta 24), en el orden en que se marcan.
export function CampoElegidos({ ids, productos, onCambio }) {
  const alternar = (id) => {
    const nuevos = ids.includes(id)
      ? ids.filter((x) => x !== id)
      : [...ids, id].slice(0, 24);
    if (nuevos.length) onCambio(nuevos);
  };
  return (
    <fieldset className={css.opcion}>
      <legend className={css.etiqueta}>Productos ({ids.length} elegidos)</legend>
      <div className={css.elegidos}>
        {productos.map((p) => (
          <label key={p.id}>
            <input
              type="checkbox"
              checked={ids.includes(p.id)}
              onChange={() => alternar(p.id)}
            />
            {p.nombre}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
