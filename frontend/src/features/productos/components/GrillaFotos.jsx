import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { useFotos } from '../hooks/useFotos.js';
import css from './GrillaFotos.module.css';

// Hasta 6 fotos; la primera es la portada. Se suben al toque (producto ya creado).
export function GrillaFotos({ productoId }) {
  const f = useFotos(productoId);
  const elegir = (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (archivo) f.agregar(archivo);
  };
  return (
    <>
      <AvisoError error={f.error} />
      <ul className={css.grilla}>
        {f.fotos.map((foto, i) => (
          <li key={foto.id} className={css.foto}>
            <img src={foto.chica} alt={`Foto ${i + 1}`} />
            {i === 0 ? <span className={css.portada}>Portada</span> : null}
            <span className={css.borrar}>
              <BotonIcono
                icono="delete"
                etiqueta={`Borrar foto ${i + 1}`}
                tono="borde"
                onClick={() => f.quitar(foto.id)}
              />
            </span>
          </li>
        ))}
        {f.fotos.length < 6 ? (
          <li>
            <label className={css.agregar}>
              <Icono nombre="add_a_photo" />
              {f.subiendo ? 'Subiendo…' : 'Agregar foto'}
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="soloLector"
                onChange={elegir}
              />
            </label>
          </li>
        ) : null}
      </ul>
    </>
  );
}
