import { useState } from 'react';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { EsqueletoFormulario } from '../../../shared/ui/esqueletos/index.js';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { REGISTRO } from '../../pagina/bloques/registro.js';
import { useCatalogo } from '../../tienda/hooks/useCatalogo.js';
import { BarraEditor } from '../components/BarraEditor.jsx';
import { ColumnaBloques } from '../components/ColumnaBloques.jsx';
import { ColumnaVista } from '../components/ColumnaVista.jsx';
import { PanelBloque } from '../components/PanelBloque.jsx';
import { useMedios } from '../hooks/useMedios.js';
import { usePaginaEditor } from '../hooks/usePaginaEditor.js';
import { usePantallaGrande } from '../hooks/usePantallaGrande.js';
import css from './PantallaArmarPagina.module.css';

// "Armá tu página": los bloques (se agregan, se arrastran, se editan) y la
// vista previa. En la compu el bloque se edita a la derecha; en el celu, en una hoja.
export function PantallaArmarPagina() {
  const e = usePaginaEditor();
  const grande = usePantallaGrande();
  const c = useCatalogo();
  const medios = useMedios();
  const [elegido, setElegido] = useState(null);
  if (e.error) return <ErrorCarga error={e.error} que="tu página" />;
  if (!e.doc || !e.valor) return <EsqueletoFormulario />;
  const ctx = { c, medios, bloques: e.doc.bloques, tienda: e.valor.tienda };
  const bloque = e.doc.bloques.find((b) => b.id === elegido);
  const panel = bloque ? (
    <PanelBloque
      bloque={bloque}
      despachar={e.despachar}
      ctx={ctx}
      onListo={() => setElegido(null)}
    />
  ) : null;
  return (
    <Pagina ancho="completo">
      <TituloPagina
        migas="Mi tienda"
        titulo="Armá tu página"
        bajada="Sumá, mové y editá los bloques de tu inicio. Cuando te guste, publicalo."
      />
      <BarraEditor e={e} />
      <div className={css.editor}>
        <ColumnaBloques e={e} elegido={elegido} onEditar={setElegido} />
        <ColumnaVista valor={e.valor} doc={e.doc} medios={medios.lista} />
        {grande ? (
          <aside className={css.ajustes} aria-label="Editar bloque">
            {panel ?? <p className={css.vacio}>Tocá un bloque para editarlo.</p>}
          </aside>
        ) : (
          <Hoja
            abierta={Boolean(bloque)}
            onCerrar={() => setElegido(null)}
            titulo={bloque ? REGISTRO[bloque.tipo].nombre : ''}
          >
            {panel}
          </Hoja>
        )}
      </div>
    </Pagina>
  );
}
