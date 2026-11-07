import { FormAjustes } from '../formularios/FormAjustes.jsx';
import { PanelBloque } from './PanelBloque.jsx';

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
