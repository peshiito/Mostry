import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './BotonHay.module.css';

// "Hay / No hay" de un toque, para lo que no se cuenta (pan, facturas).
export function BotonHay({ nombre, agotado, onCambio }) {
  return (
    <button
      type="button"
      className={`${css.boton} ${agotado ? css.no : css.si}`}
      aria-pressed={!agotado}
      aria-label={`${nombre}: ${agotado ? 'no hay' : 'hay'}. Tocá para cambiar`}
      onClick={onCambio}
    >
      <Icono nombre={agotado ? 'close' : 'check'} tamano={16} />
      {agotado ? 'No hay' : 'Hay'}
    </button>
  );
}
