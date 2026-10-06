import { useId, useState } from 'react';
import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './SubirComprobante.module.css';

const TIPOS = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX = 5 * 1024 * 1024;

// Zona para elegir el comprobante. El servidor valida por magic bytes (sección 7);
// acá solo avisamos rápido si el archivo no va.
export function SubirComprobante({ archivo, onArchivo }) {
  const id = useId();
  const [error, setError] = useState('');
  function elegir(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!TIPOS.includes(f.type)) return setError('Tiene que ser JPG, PNG o PDF.');
    if (f.size > MAX) return setError('El archivo pesa más de 5 MB.');
    setError('');
    onArchivo(f);
  }
  return (
    <div className={css.bloque}>
      <label htmlFor={id} className={`${css.zona} ${error ? css.error : ''}`}>
        <Icono nombre={archivo ? 'description' : 'upload_file'} tamano={32} />
        <span className={css.titulo}>
          {archivo ? archivo.name : 'Subí la captura o el PDF'}
        </span>
        <span className={css.ayuda}>
          {archivo ? 'Tocá para cambiarlo' : 'JPG, PNG o PDF, hasta 5 MB'}
        </span>
      </label>
      <input
        id={id}
        type="file"
        accept={TIPOS.join(',')}
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
