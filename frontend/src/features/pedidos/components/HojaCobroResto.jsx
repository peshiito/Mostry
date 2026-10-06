import { useState } from 'react';
import { plata } from '../../../shared/lib/plata.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import { MEDIOS } from '../../gastos/lib/opciones.js';

// Al entregar un encargo, el resto se cobra y entra a la caja (6.2).
export function HojaCobroResto({ abierta, onCerrar, resto, onConfirmar, enviando }) {
  const [medio, setMedio] = useState('efectivo');
  return (
    <Hoja
      abierta={abierta}
      onCerrar={onCerrar}
      titulo={`Cobrar el resto: ${plata(resto)}`}
    >
      <Segmentado
        etiqueta="¿Cómo te pagó?"
        opciones={MEDIOS}
        valor={medio}
        onCambio={setMedio}
      />
      <Boton
        variante="principal"
        tamano="lg"
        anchoCompleto
        cargando={enviando}
        onClick={() => onConfirmar(medio)}
      >
        Marcar entregado
      </Boton>
    </Hoja>
  );
}
