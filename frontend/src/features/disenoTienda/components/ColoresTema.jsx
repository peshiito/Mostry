import css from './Personalizar.module.css';

const COLORES = [
  ['principal', 'Color principal', 'Encabezado, links y pestañas'],
  ['acento', 'Color de los botones', 'Agregar, promos y etiquetas'],
  ['fondo', 'Fondo', 'Detrás de todo'],
];

// Colores libres: Mostry los ajusta solo para que todo se lea (contraste).
export function ColoresTema({ colores, onCambio }) {
  return (
    <fieldset className={css.grupo}>
      <legend className={css.leyenda}>Colores</legend>
      {COLORES.map(([clave, nombre, ayuda]) => (
        <label key={clave} className={css.color}>
          <input
            type="color"
            value={colores[clave]}
            onChange={(e) => onCambio({ ...colores, [clave]: e.target.value })}
          />
          <span>
            <strong>{nombre}</strong>
            <small>{ayuda}</small>
          </span>
        </label>
      ))}
      <p className={css.nota}>Si un color no se lee bien, Mostry ajusta el tono solo.</p>
    </fieldset>
  );
}
