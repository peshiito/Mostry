import { useState } from 'react';
import css from './Celular.module.css';

// Celular con capturas reales de Mostry. Si llegan varias, se ve la `actual`
// y las demás quedan apiladas para el fundido. `prioridad`: se ve al abrir la página.
export function Celular({
  imagenes,
  actual = 0,
  tamano = 'md',
  prioridad,
  className = '',
}) {
  // Solo se descargan las pantallas que ya se mostraron (y quedan para el fundido).
  const [vistas, setVistas] = useState(() => new Set([actual]));
  if (!vistas.has(actual)) setVistas(new Set(vistas).add(actual));
  return (
    <div className={`${css.celular} ${css[tamano]} ${className}`}>
      {imagenes.map(({ src, alt }, i) =>
        !vistas.has(i) ? null : (
          <img
            key={src}
            src={src}
            alt={i === actual ? alt : ''}
            aria-hidden={i === actual ? undefined : 'true'}
            width="600"
            height="1298"
            loading={prioridad ? 'eager' : 'lazy'}
            fetchPriority={prioridad ? 'high' : undefined}
            decoding="async"
            className={css.pantalla}
            data-visible={i === actual}
          />
        ),
      )}
    </div>
  );
}
