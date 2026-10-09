import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { SelectorHora } from '../../../shared/ui/SelectorHora.jsx';
import css from './DiaHorario.module.css';

// Un tramo del día: abre, cierra y el botón para quitarlo.
export function TramoHorario({ dia, i, tramo: [abre, cierra], onEditar, onQuitar }) {
  return (
    <div className={css.tramo}>
      <SelectorHora
        etiqueta={`${dia}, abre`}
        valor={abre}
        onCambio={(v) => onEditar(0, v)}
      />
      <span aria-hidden="true">a</span>
      <SelectorHora
        etiqueta={`${dia}, cierra`}
        valor={cierra}
        onCambio={(v) => onEditar(1, v)}
      />
      <BotonIcono
        icono="close"
        etiqueta={`Quitar tramo ${i + 1} del ${dia}`}
        onClick={onQuitar}
      />
    </div>
  );
}
