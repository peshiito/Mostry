import { useState } from 'react';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { usePanel } from '../../panelBase/PanelContexto.jsx';
import { SocioElegido } from './SocioElegido.jsx';
import { HojaSocio } from './HojaSocio.jsx';

// En la venta: el cliente del club identificado (con sus sellos) o el botón
// para identificarlo. Solo si la tienda tiene el club prendido.
export function ClienteClub({ v }) {
  const { tienda } = usePanel();
  const [abierta, setAbierta] = useState(false);
  if (!tienda.usaClub) return null;
  if (v.socio) return <SocioElegido v={v} />;
  return (
    <>
      <Boton icono="qr_code_scanner" onClick={() => setAbierta(true)}>
        Cliente del club
      </Boton>
      {abierta ? (
        <HojaSocio
          abierta
          onCerrar={() => setAbierta(false)}
          identificar={{
            ...v.identificar,
            // Devuelve si salió bien: si no, el escáner sigue mirando.
            ejecutar: async (c) => {
              const { ok } = await v.identificar.ejecutar(c);
              if (ok) setAbierta(false);
              return ok;
            },
          }}
        />
      ) : null}
    </>
  );
}
