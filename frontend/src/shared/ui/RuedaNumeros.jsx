import css from './RuedaNumeros.module.css';
import { useRueda } from './useRueda.js';

// Rueda que se desliza con el dedo y frena en una opción (scroll-snap).
// Tocar una opción también la elige. Al abrirse, se ubica en el valor actual.
// `ref.current.leer()` da lo que está en el centro AHORA (aunque siga girando).
export function RuedaNumeros({ valores, valor, onCambio, etiqueta, abierta, ref }) {
  const { lista, ir, alDeslizar, alTeclear } = useRueda({
    valores,
    valor,
    onCambio,
    abierta,
    ref,
  });
  return (
    <div className={css.rueda}>
      <div
        ref={lista}
        className={css.lista}
        onScroll={alDeslizar}
        onKeyDown={alTeclear}
        tabIndex={0}
        role="spinbutton"
        aria-label={etiqueta}
        aria-valuenow={Number(valor)}
        aria-valuetext={valor}
        aria-valuemin={Number(valores[0])}
        aria-valuemax={Number(valores.at(-1))}
      >
        {valores.map((v, i) => (
          <button
            key={v}
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            data-elegida={v === valor}
            className={css.opcion}
            onClick={() => ir(i)}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
