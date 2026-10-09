import { AreaTexto, Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Selector } from '../../../shared/ui/Selector.jsx';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { useBasePanel } from '../../panelBase/BasePanel.jsx';
import { CamposStock } from './CamposStock.jsx';
import css from './CamposProducto.module.css';

// Nombre, descripción, precio, categoría, stock y aviso de stock mínimo.
export function CamposProducto({ form, errores, onCambio }) {
  const set = (k) => (e) => onCambio({ ...form, [k]: e.target.value });
  const { api } = useBasePanel();
  const lista = useConsulta(`${api}/categorias`).datos ?? [];
  const cats = [
    { valor: '', texto: 'Sin categoría' },
    ...lista.map((c) => ({ valor: String(c.id), texto: c.nombre })),
  ];
  return (
    <div className={css.campos}>
      <Campo etiqueta="Nombre" error={errores.nombre}>
        {(c) => <Entrada c={c} value={form.nombre} onChange={set('nombre')} />}
      </Campo>
      <Campo
        etiqueta="Descripción"
        error={errores.descripcion}
        extra={<span className={css.cuenta}>{form.descripcion.length}/240</span>}
      >
        {(c) => (
          <AreaTexto
            c={c}
            maxLength={240}
            value={form.descripcion}
            onChange={set('descripcion')}
          />
        )}
      </Campo>
      <div className={css.dos}>
        <Campo etiqueta="Precio" error={errores.precio}>
          {(c) => (
            <Entrada
              c={c}
              prefijo="$"
              inputMode="decimal"
              value={form.precio}
              onChange={set('precio')}
            />
          )}
        </Campo>
        <Campo etiqueta="Categoría">
          {(c) => (
            <Selector
              c={c}
              opciones={cats}
              value={form.categoriaId}
              onChange={set('categoriaId')}
            />
          )}
        </Campo>
      </div>
      <CamposStock form={form} errores={errores} onCambio={onCambio} />
    </div>
  );
}
