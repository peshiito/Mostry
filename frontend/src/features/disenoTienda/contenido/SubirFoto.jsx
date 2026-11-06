import { useId } from 'react';
import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './Contenido.module.css';

// Botón para elegir una foto (jpg o png). La foto se sube apenas se elige.
export function SubirFoto({ texto, onArchivo, subiendo, deshabilitado }) {
  const id = useId();
  return (
    <label htmlFor={id} className={css.subir} aria-disabled={deshabilitado || undefined}>
      <Icono nombre="add_a_photo" />
      {subiendo != null ? `Subiendo… ${Math.round(subiendo * 100)} %` : texto}
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png"
        className="soloLector"
        disabled={deshabilitado}
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          if (f) onArchivo(f);
        }}
      />
    </label>
  );
}
