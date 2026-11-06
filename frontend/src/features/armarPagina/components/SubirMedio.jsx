import { useId } from 'react';
import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './HojaMedios.module.css';

// Elegir un archivo del teléfono o la compu; se sube al toque.
export function SubirMedio({ subir }) {
  const id = useId();
  const p = subir.progreso;
  return (
    <label htmlFor={id} className={css.subir}>
      <Icono nombre="add_a_photo" />
      {p != null ? `Subiendo… ${Math.round(p * 100)} %` : 'Subir foto o GIF'}
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        className="soloLector"
        disabled={p != null}
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          if (f) subir.ejecutar(f);
        }}
      />
    </label>
  );
}
