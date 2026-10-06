import { useId } from 'react';
import { SeccionTitulo } from './SeccionTitulo.jsx';
import css from './Seccion.module.css';

// Sección con título (h2) y contenido separado parejo.
export function Seccion({ titulo, bajada, accion, children, className = '' }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={`${css.seccion} ${className}`}>
      <SeccionTitulo id={id} titulo={titulo} bajada={bajada} accion={accion} />
      {children}
    </section>
  );
}
