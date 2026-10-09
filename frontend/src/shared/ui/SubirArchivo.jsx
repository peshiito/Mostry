import { useId, useState } from 'react';
import { Icono } from './Icono.jsx';
import css from './SubirArchivo.module.css';

const MAX = 5 * 1024 * 1024;

// Zona para elegir un archivo (comprobante, captura…). El servidor valida por
// magic bytes (sección 7); acá solo avisamos rápido si el archivo no va.
export function SubirArchivo({ archivo, onArchivo, tipos, titulo, ayuda, errorTipo }) {
  const id = useId();
  const [error, setError] = useState('');
  function elegir(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!tipos.includes(f.type)) return setError(errorTipo);
    if (f.size > MAX) return setError('El archivo pesa más de 5 MB.');
    setError('');
    onArchivo(f);
  }
  return (
    <div className={css.bloque}>
      <label htmlFor={id} className={`${css.zona} ${error ? css.error : ''}`}>
        <Icono nombre={archivo ? 'description' : 'upload_file'} tamano={32} />
        <span className={css.titulo}>{archivo ? archivo.name : titulo}</span>
        <span className={css.ayuda}>{archivo ? 'Tocá para cambiarlo' : ayuda}</span>
      </label>
      <input
        id={id}
        type="file"
        accept={tipos.join(',')}
        className="soloLector"
        onChange={elegir}
        aria-invalid={!!error || undefined}
      />
      {error ? (
        <p className={css.mensaje} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
