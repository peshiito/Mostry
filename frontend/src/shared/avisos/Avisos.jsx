import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { almacenAvisos } from './avisos.js';
import { Anunciador } from './Anunciador.jsx';
import css from './Avisos.module.css';
import { ubicar } from './pila.js';
import { TarjetaAviso } from './TarjetaAviso.jsx';

// Región de avisos: se monta una vez. Es un popover para quedar en la capa superior
// (si no, una hoja abierta con <dialog> los taparía). Con el mouse encima, la pila se abre.
export function Avisos() {
  const lista = useSyncExternalStore(almacenAvisos.suscribir, almacenAvisos.leer);
  const region = useRef(null);
  const [abierta, setAbierta] = useState(false);
  const [alturas, setAlturas] = useState({});
  const medir = useCallback(
    (id, alto) => setAlturas((a) => (a[id] === alto ? a : { ...a, [id]: alto })),
    [],
  );

  // Cada aviso nuevo vuelve a poner la región arriba de todo (incluso de un diálogo).
  const hay = lista.length > 0;
  const ultimo = lista[0]?.id;
  useEffect(() => {
    const r = region.current;
    if (!r?.showPopover) return;
    if (r.matches(':popover-open')) r.hidePopover();
    if (hay) r.showPopover();
  }, [hay, ultimo]);
  if (!hay && abierta) setAbierta(false);

  const { posiciones, altoFrente, alto } = ubicar(lista, alturas, abierta);

  return (
    <>
      <Anunciador lista={lista} />
      <section
        ref={region}
        popover="manual"
        className={css.region}
        aria-label="Avisos"
        style={{ height: Math.max(alto, 0) }}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setAbierta(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setAbierta(false)}
      >
        <ol className={css.pila}>
          {posiciones.map(({ a, desplazo, indice }) => (
            <TarjetaAviso
              key={a.id}
              aviso={a}
              indice={indice}
              desplazo={desplazo}
              altoFrente={altoFrente}
              abierta={abierta}
              onMedir={medir}
            />
          ))}
        </ol>
      </section>
    </>
  );
}
