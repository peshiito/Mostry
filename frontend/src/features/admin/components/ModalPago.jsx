import { SelectorFecha } from '../../../shared/ui/SelectorFecha.jsx';
import { useState } from 'react';
import { fechaCorta } from '../../../shared/lib/fechas.js';
import { aCentavos } from '../../../shared/lib/plata.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { nuevoVencimiento } from '../plan.js';

// Registrar el pago de la suscripción (Stitch 56).
export function ModalPago({ abierta, onCerrar, tienda, onRegistrar }) {
  const [monto, setMonto] = useState('10000');
  const [fecha, setFecha] = useState(new Date().toLocaleDateString('sv-SE'));
  const vence = nuevoVencimiento(tienda.vence ?? new Date());
  return (
    <Hoja
      abierta={abierta}
      onCerrar={onCerrar}
      ancha
      titulo={`Registrar pago · ${tienda.nombre}`}
    >
      <Campo etiqueta="Monto">
        {(c) => (
          <Entrada
            c={c}
            prefijo="$"
            inputMode="decimal"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        )}
      </Campo>
      <Campo etiqueta="Fecha del pago">
        {(c) => (
          <SelectorFecha
            c={c}
            etiqueta="Fecha del pago"
            valor={fecha}
            onCambio={setFecha}
          />
        )}
      </Campo>
      <Aviso
        tipo="ok"
        titulo={`El plan pasa a vencer el ${fechaCorta(vence.toISOString())}`}
      >
        30 días desde el vencimiento actual o desde hoy, lo que sea más tarde.
      </Aviso>
      <Boton
        variante="principal"
        tamano="lg"
        anchoCompleto
        disabled={!aCentavos(monto)}
        onClick={() => onRegistrar({ monto: aCentavos(monto), pagadoEn: fecha })}
      >
        Registrar pago
      </Boton>
    </Hoja>
  );
}
