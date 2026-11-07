import { REGISTRO } from './bloques/registro.js';
import css from './RenderPagina.module.css';

// Pinta los bloques visibles de la página, en su orden. Cada uno queda envuelto
// con su id (para los botones que llevan "a una sección") y su tipo. `despues`
// va justo después de la portada (el aviso de "cerrado").
export function RenderPagina({ pagina, tienda, c, despues }) {
  const visibles = pagina.bloques.filter((b) => b.visible && REGISTRO[b.tipo]);
  return visibles.map((b, i) => {
    const { Componente } = REGISTRO[b.tipo];
    return (
      <div
        key={b.id}
        id={`b-${b.id}`}
        data-bloque={b.tipo}
        data-id-bloque={b.id}
        className={css.bloque}
      >
        <Componente bloque={b} datos={b.datos} tienda={tienda} c={c} />
        {i === 0 ? despues : null}
      </div>
    );
  });
}
