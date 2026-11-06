import { Boton } from '../../../shared/ui/Boton.jsx';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import css from './BarraEditor.module.css';

const ESTADO = {
  'al-dia': 'Cambios guardados',
  pendiente: 'Guardando en un ratito…',
  guardando: 'Guardando…',
  error: 'No se pudo guardar. Revisá la conexión.',
};

// Arriba del editor: si está guardado, deshacer y rehacer, y "Publicar".
// Lo publicado es lo que ve el cliente; el borrador queda guardado igual.
export function BarraEditor({ e }) {
  return (
    <div className={css.barra}>
      <p
        className={css.estado}
        role="status"
        data-error={e.guardado === 'error' || undefined}
      >
        {ESTADO[e.guardado]}
      </p>
      <BotonIcono
        icono="undo"
        etiqueta="Deshacer"
        disabled={!e.puedeDeshacer}
        onClick={() => e.despachar({ tipo: 'deshacer' })}
      />
      <BotonIcono
        icono="redo"
        etiqueta="Rehacer"
        disabled={!e.puedeRehacer}
        onClick={() => e.despachar({ tipo: 'rehacer' })}
      />
      <Boton
        variante="principal"
        icono="publish"
        cargando={e.publicar.enviando}
        textoCargando="Publicando…"
        onClick={() => e.publicar.ejecutar()}
      >
        Publicar
      </Boton>
    </div>
  );
}
