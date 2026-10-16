import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import css from './NuevoEncargo.module.css';

const ENTREGAS = [
  { valor: 'retiro', texto: 'Retira' },
  { valor: 'envio', texto: 'Se lo llevo' },
];

// Quién lo pidió y cómo se entrega.
export function ClienteEncargo({ form, onCambio }) {
  const set = (k) => (e) => onCambio({ ...form, [k]: e.target.value });
  return (
    <Tarjeta className={css.bloque}>
      <Campo etiqueta="Nombre del cliente">
        {(c) => (
          <Entrada
            c={c}
            autoComplete="off"
            value={form.nombre}
            onChange={set('nombre')}
          />
        )}
      </Campo>
      <Campo etiqueta="WhatsApp" ayuda="Con código de área, sin el 15">
        {(c) => (
          <Entrada
            c={c}
            inputMode="tel"
            value={form.whatsapp}
            onChange={set('whatsapp')}
          />
        )}
      </Campo>
      <Segmentado
        etiqueta="Entrega"
        opciones={ENTREGAS}
        valor={form.entrega}
        onCambio={(entrega) => onCambio({ ...form, entrega })}
      />
      {form.entrega === 'envio' ? (
        <Campo etiqueta="Dirección">
          {(c) => <Entrada c={c} value={form.direccion} onChange={set('direccion')} />}
        </Campo>
      ) : null}
    </Tarjeta>
  );
}
