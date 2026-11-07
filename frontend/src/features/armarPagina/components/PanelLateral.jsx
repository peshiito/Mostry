import { FormAjustes } from '../formularios/FormAjustes.jsx';
import { REGISTRO } from '../../pagina/bloques/registro.js';
import { PanelBloque } from './PanelBloque.jsx';

// El título de lo que se está editando.
export const tituloPanel = (elegido, bloques) =>
  elegido === 'ajustes'
    ? 'Ajustes de la página'
    : (REGISTRO[bloques.find((x) => x.id === elegido)?.tipo]?.nombre ?? '');

// Lo que se edita al costado (compu) o en la hoja (celu): un bloque o los ajustes.
export function PanelLateral({ elegido, e, ctx, onListo }) {
  if (elegido === 'ajustes')
    return (
      <FormAjustes
        ajustes={e.doc.ajustes}
        ctx={ctx}
        cambiar={(cambio) => e.despachar({ tipo: 'ajustes', ajustes: cambio })}
      />
    );
  const bloque = e.doc.bloques.find((b) => b.id === elegido);
  if (!bloque) return null;
  return (
    <PanelBloque bloque={bloque} despachar={e.despachar} ctx={ctx} onListo={onListo} />
  );
}
