import { useEffect, useState } from 'react';
import css from './CarruselFotos.module.css';

const quieto = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Fotos de la portada que van pasando solas cada `segundos`. Se frena al pasar
// el mouse, al tocarla o con el foco adentro, y con "reducir movimiento" no se
// mueve sola. Los puntitos permiten elegir una a mano.
export function CarruselFotos({ fotos, segundos = 5, transicion = 'fundido' }) {
  const [actual, setActual] = useState(0);
  const [pausa, setPausa] = useState(false);
  useEffect(() => {
    if (pausa || fotos.length < 2 || quieto()) return undefined;
    const t = setInterval(() => {
      if (!document.hidden) setActual((i) => (i + 1) % fotos.length);
    }, segundos * 1000);
    return () => clearInterval(t);
  }, [pausa, fotos.length, segundos]);
  const i = actual % fotos.length;
  return (
    <div
      className={css.carrusel}
      data-v="carrusel"
      data-transicion={transicion}
      onPointerEnter={() => setPausa(true)}
      onPointerLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={() => setPausa(false)}
    >
      {fotos.map((url, n) => (
        <img
          key={url}
          src={url}
          alt=""
          className={css.foto}
          data-actual={n === i || undefined}
          data-antes={n < i || undefined}
          loading={n === 0 ? 'eager' : 'lazy'}
          decoding="async"
        />
      ))}
      <div className={css.puntos}>
        {fotos.map((url, n) => (
          <button
            key={url}
            type="button"
            className={css.punto}
            aria-label={`Ver la imagen ${n + 1} de ${fotos.length}`}
            aria-pressed={n === i}
            onClick={() => setActual(n)}
          />
        ))}
      </div>
    </div>
  );
}
