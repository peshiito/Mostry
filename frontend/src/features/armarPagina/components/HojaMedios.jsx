import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { SubirMedio } from './SubirMedio.jsx';
import css from './HojaMedios.module.css';

// Tus imágenes: subís fotos o GIF y elegís cuáles usa el bloque (en el orden en
// que las tocás). `max` 1 = una sola.
export function HojaMedios({ abierta, onCerrar, medios, elegidos, max, onElegir }) {
  function tocar(id) {
    if (max === 1) return onElegir([id]);
    const nuevos = elegidos.includes(id)
      ? elegidos.filter((x) => x !== id)
      : [...elegidos, id].slice(0, max);
    onElegir(nuevos);
  }
  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Tus imágenes" ancha>
      <p className={css.nota}>
        Fotos JPG o PNG, o un GIF animado (hasta 8 MB).{' '}
        {max > 1 ? `Elegí hasta ${max}.` : ''}
      </p>
      <SubirMedio subir={medios.subir} />
      <AvisoError error={medios.subir.error ?? medios.borrar.error} />
      <ul className={css.grilla}>
        {medios.lista.map((m) => {
          const n = elegidos.indexOf(m.id);
          return (
            <li key={m.id} className={css.item}>
              <button
                type="button"
                className={css.foto}
                aria-pressed={n >= 0}
                aria-label={`${m.tipo === 'animado' ? 'GIF' : 'Foto'} ${n >= 0 ? `elegida (${n + 1})` : ''}`}
                onClick={() => tocar(m.id)}
              >
                <img src={m.urlChica} alt="" loading="lazy" />
                {n >= 0 ? <span className={css.numero}>{n + 1}</span> : null}
              </button>
              <BotonIcono
                icono="delete"
                etiqueta="Borrar esta imagen"
                onClick={() => medios.borrar.ejecutar(m.id)}
              />
            </li>
          );
        })}
      </ul>
    </Hoja>
  );
}
