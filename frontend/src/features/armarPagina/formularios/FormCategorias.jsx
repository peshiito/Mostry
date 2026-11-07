import { Opcion, TextoOpcional } from './campos.jsx';
import css from './Formularios.module.css';

const FORMA = [
  ['tarjetas', 'Tarjetas con foto'],
  ['circulos', 'Círculos chicos'],
];

// Categorías: cómo se ven y cuáles (ninguna marcada = todas).
export function FormCategorias({ datos, cambiar, ctx }) {
  const ids = datos.ids ?? [];
  const alternar = (id) =>
    cambiar({ ids: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id] });
  return (
    <div className={css.form}>
      <Opcion
        etiqueta="Cómo se ven"
        opciones={FORMA}
        valor={datos.forma}
        onCambio={(forma) => cambiar({ forma })}
      />
      {datos.forma === 'tarjetas' ? (
        <TextoOpcional
          etiqueta="Título"
          valor={datos.titulo}
          defecto="Explorá por categoría"
          max={60}
          onCambio={(titulo) => cambiar({ titulo })}
        />
      ) : null}
      <fieldset className={css.opcion}>
        <legend className={css.etiqueta}>Cuáles (si no marcás ninguna, van todas)</legend>
        <div className={css.elegidos}>
          {ctx.c.categorias.map((k) => (
            <label key={k.id}>
              <input
                type="checkbox"
                checked={ids.includes(k.id)}
                onChange={() => alternar(k.id)}
              />
              {k.nombre}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
