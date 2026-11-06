import { AreaTexto, Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import css from './Contenido.module.css';

const REDES = [
  ['instagram', 'Instagram', 'https://instagram.com/tunegocio'],
  ['tiktok', 'TikTok', 'https://tiktok.com/@tunegocio'],
  ['facebook', 'Facebook', 'https://facebook.com/tunegocio'],
  ['web', 'Otra web', 'https://…'],
];

// "Sobre nosotros" y las redes de la tienda.
export function EditorTextos({ contenido, onCambio }) {
  const redes = (k) => (e) =>
    onCambio({ ...contenido, redes: { ...contenido.redes, [k]: e.target.value } });
  return (
    <fieldset className={css.grupo}>
      <legend className={css.leyenda}>Tu historia y tus redes</legend>
      <Campo
        etiqueta="Sobre nosotros"
        ayuda={`${contenido.sobreNosotros.length} de 1200 letras`}
      >
        {(c) => (
          <AreaTexto
            c={c}
            maxLength={1200}
            rows={5}
            value={contenido.sobreNosotros}
            onChange={(e) => onCambio({ ...contenido, sobreNosotros: e.target.value })}
          />
        )}
      </Campo>
      {REDES.map(([k, nombre, ejemplo]) => (
        <Campo key={k} etiqueta={nombre}>
          {(c) => (
            <Entrada
              c={c}
              type="url"
              placeholder={ejemplo}
              value={contenido.redes[k] ?? ''}
              onChange={redes(k)}
            />
          )}
        </Campo>
      ))}
    </fieldset>
  );
}
