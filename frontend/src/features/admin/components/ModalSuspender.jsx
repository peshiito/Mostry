import { useState } from 'react';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { AreaTexto, Campo } from '../../../shared/ui/Campo.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';

// Suspender (con motivo) o reactivar una tienda (Stitch 57). No se borran datos.
export function ModalSuspender({ abierta, onCerrar, tienda, onConfirmar }) {
  const [motivo, setMotivo] = useState('');
  const reactivar = tienda.estado === 'suspendida';
  return (
    <Hoja
      abierta={abierta}
      onCerrar={onCerrar}
      ancha
      titulo={`${reactivar ? 'Reactivar' : 'Suspender'} ${tienda.nombre}`}
    >
      {reactivar ? (
        <Aviso tipo="ok">La tienda vuelve a estar activa en el acto.</Aviso>
      ) : (
        <>
          <Campo etiqueta="Motivo (obligatorio)">
            {(c) => (
              <AreaTexto
                c={c}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
            )}
          </Campo>
          <Aviso tipo="alerta">
            La tienda va a mostrar "Cerrada temporalmente" y el panel queda en solo
            lectura. No se borran datos.
          </Aviso>
        </>
      )}
      <Boton
        variante={reactivar ? 'principal' : 'peligro'}
        tamano="lg"
        anchoCompleto
        disabled={!reactivar && motivo.trim().length < 3}
        onClick={() => onConfirmar(motivo.trim())}
      >
        {reactivar ? 'Reactivar tienda' : 'Suspender tienda'}
      </Boton>
    </Hoja>
  );
}
