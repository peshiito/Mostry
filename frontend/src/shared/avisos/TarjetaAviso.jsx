import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Icono } from '../ui/Icono.jsx';
import { cerrarAviso } from './avisos.js';
import p from './PartesAviso.module.css';
import { estiloAviso } from './pila.js';
import css from './TarjetaAviso.module.css';
import { useDeslizar } from './useDeslizar.js';
import { useTemporizador } from './useTemporizador.js';

const ICONO = { exito: 'check_circle', error: 'error', info: 'info' };

// Un aviso de la pila. `indice` 0 es el de adelante; `desplazo` es su lugar
// cuando la pila está abierta (hover). Entra deslizando y sale por donde vino.
export function TarjetaAviso({ aviso, indice, desplazo, altoFrente, abierta, onMedir }) {
  const contenido = useRef(null);
  const [montado, setMontado] = useState(false);
  const [alto, setAlto] = useState(0);
  const deslizar = useDeslizar(() => cerrarAviso(aviso.id));
  useTemporizador(aviso.id, aviso.duracion, abierta || deslizar.arrastrando);

  useEffect(() => {
    const cuadro = requestAnimationFrame(() => setMontado(true));
    return () => cancelAnimationFrame(cuadro);
  }, []);
  useLayoutEffect(() => {
    const medido = contenido.current.offsetHeight;
    setAlto(medido);
    onMedir(aviso.id, medido);
  }, [aviso.id, aviso.titulo, aviso.descripcion, onMedir]);

  const estilo = estiloAviso({ indice, desplazo, alto, altoFrente, dx: deslizar.dx });
  return (
    <li
      className={css.aviso}
      data-tipo={aviso.tipo}
      data-montado={montado}
      data-saliendo={Boolean(aviso.saliendo)}
      data-frente={indice === 0}
      data-abierta={abierta}
      data-arrastrando={deslizar.arrastrando}
      data-por-lado={deslizar.dx > 0}
      style={estilo}
      {...deslizar.manejadores}
    >
      <div ref={contenido} className={css.contenido}>
        <span className={p.icono} data-tipo={aviso.tipo}>
          <Icono nombre={ICONO[aviso.tipo]} tamano={20} />
        </span>
        <div className={p.textos}>
          <p className={p.titulo}>{aviso.titulo}</p>
          {aviso.descripcion ? (
            <p className={p.descripcion}>{aviso.descripcion}</p>
          ) : null}
        </div>
        <button
          type="button"
          className={p.cerrar}
          aria-label="Cerrar aviso"
          onClick={() => cerrarAviso(aviso.id)}
        >
          <Icono nombre="close" tamano={16} />
        </button>
      </div>
    </li>
  );
}
