import { AreaTexto, Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import { Selector } from '../../../shared/ui/Selector.jsx';
import css from './Formularios.module.css';

// Texto que puede quedar vacío: vacío = el texto de siempre (se guarda null).
export function TextoOpcional({ etiqueta, valor, onCambio, defecto, max, largo, ayuda }) {
  const Control = largo ? AreaTexto : Entrada;
  return (
    <Campo
      etiqueta={etiqueta}
      ayuda={ayuda ?? (defecto ? `Vacío: "${defecto}"` : undefined)}
    >
      {(c) => (
        <Control
          c={c}
          value={valor ?? ''}
          maxLength={max}
          placeholder={defecto}
          onChange={(e) => onCambio(e.target.value.trim() ? e.target.value : null)}
        />
      )}
    </Campo>
  );
}

export function TextoLargo({ etiqueta, valor, onCambio, max }) {
  return (
    <Campo etiqueta={etiqueta}>
      {(c) => (
        <AreaTexto
          c={c}
          value={valor}
          maxLength={max}
          rows={5}
          onChange={(e) => onCambio(e.target.value)}
        />
      )}
    </Campo>
  );
}

// Una opción entre pocas (botones segmentados) o entre muchas (lista).
export function Opcion({ etiqueta, opciones, valor, onCambio }) {
  const lista = opciones.map(([v, t]) => ({ valor: v, texto: t }));
  if (lista.length <= 3)
    return (
      <div className={css.opcion}>
        <span className={css.etiqueta}>{etiqueta}</span>
        <Segmentado
          etiqueta={etiqueta}
          opciones={lista}
          valor={valor}
          onCambio={onCambio}
        />
      </div>
    );
  return (
    <Campo etiqueta={etiqueta}>
      {(c) => (
        <Selector
          c={c}
          opciones={lista}
          value={String(valor)}
          onChange={(e) => onCambio(e.target.value)}
        />
      )}
    </Campo>
  );
}
