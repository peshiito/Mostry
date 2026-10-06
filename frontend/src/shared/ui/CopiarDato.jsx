import { useState } from 'react';
import { avisar } from '../avisos/avisos.js';
import { Icono } from './Icono.jsx';
import css from './CopiarDato.module.css';

// Dato con botón "Copiar" (alias, monto, link). Avisa cuando se copió.
export function CopiarDato({ etiqueta, valor, textoACopiar, mono }) {
  const [copiado, setCopiado] = useState(false);
  async function copiar() {
    try {
      await navigator.clipboard.writeText(textoACopiar ?? valor);
      setCopiado(true);
      avisar.exito(`${etiqueta} copiado`);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
      avisar.error('No pudimos copiarlo', {
        descripcion: 'Mantené apretado el texto para copiarlo a mano.',
      });
    }
  }
  return (
    <div className={css.dato}>
      <div className={css.textos}>
        <span className={css.etiqueta}>{etiqueta}</span>
        <span className={`${css.valor} ${mono ? css.mono : ''}`}>{valor}</span>
      </div>
      <button type="button" className={css.boton} onClick={copiar}>
        <Icono nombre={copiado ? 'check' : 'content_copy'} tamano={18} />
        <span aria-live="polite">{copiado ? 'Copiado' : 'Copiar'}</span>
      </button>
    </div>
  );
}
