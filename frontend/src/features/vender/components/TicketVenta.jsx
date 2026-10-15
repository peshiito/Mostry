import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { Cantidad } from '../../../shared/ui/Cantidad.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { plata } from '../../../shared/lib/plata.js';
import css from './Ticket.module.css';

const MEDIOS = [
  { valor: 'efectivo', texto: 'Efectivo' },
  { valor: 'transferencia', texto: 'Transferencia' },
];

// Lo que se va a cobrar: líneas con su cantidad, el monto suelto, el medio y
// el botón de cobrar (el único coral de la pantalla).
export function TicketVenta({ v }) {
  const vacia = !v.lineas.length && !v.suelto;
  return (
    <Tarjeta className={css.ticket}>
      <AvisoError error={v.cobro.error} />
      {v.lineas.map((l) => (
        <div key={l.producto.id} className={css.linea}>
          <span className={css.nombre}>{l.producto.nombre}</span>
          <Cantidad
            valor={l.cantidad}
            min={0}
            nombre={l.producto.nombre}
            onCambio={(n) => v.cambiar(l.producto, n - l.cantidad)}
          />
        </div>
      ))}
      {v.suelto ? (
        <div className={css.linea}>
          <span className={css.nombre}>
            {v.suelto.concepto || 'Monto suelto'} · {plata(v.suelto.monto)}
          </span>
          <BotonIcono
            icono="close"
            etiqueta="Quitar el monto suelto"
            onClick={() => v.setSuelto(null)}
          />
        </div>
      ) : null}
      <div className={css.total}>
        <span>Total</span>
        <Monto animado centavos={v.total} tamano="lg" />
      </div>
      <Segmentado
        etiqueta="Medio de pago"
        opciones={MEDIOS}
        valor={v.medio}
        onCambio={v.setMedio}
      />
      <Boton
        variante="principal"
        tamano="lg"
        anchoCompleto
        disabled={vacia}
        cargando={v.cobro.enviando}
        textoCargando="Cobrando…"
        textoHecho={v.cobro.hecho ? 'Cobrado' : undefined}
        onClick={() => v.cobro.ejecutar()}
      >
        {vacia ? 'Tocá un producto para empezar' : `Cobrar ${plata(v.total)}`}
      </Boton>
    </Tarjeta>
  );
}
