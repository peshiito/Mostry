import { useCallback, useState } from 'react';
import css from './ImagenSuave.module.css';

// Foto que aparece con un fundido cuando terminó de bajar (no a medias).
// Si ya estaba en caché, o si falla, se muestra al toque.
export function ImagenSuave({ className = '', alt, ...resto }) {
  const [lista, setLista] = useState(false);
  const ref = useCallback((img) => {
    if (img?.complete) setLista(true);
  }, []);
  const mostrar = () => setLista(true);
  return (
    <img
      ref={ref}
      alt={alt}
      {...resto}
      onLoad={mostrar}
      onError={mostrar}
      className={`${className} ${css.imagen} ${lista ? css.lista : ''}`}
    />
  );
}
