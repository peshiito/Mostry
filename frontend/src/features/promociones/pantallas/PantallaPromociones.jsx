import { useState } from 'react';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { HojaPromo } from '../components/HojaPromo.jsx';
import { TarjetaPromo } from '../components/TarjetaPromo.jsx';
import { usePromociones } from '../hooks/usePromociones.js';

// Promociones de la vidriera (Stitch 33).
export function PantallaPromociones() {
  const { promos, alternar, agregar, error } = usePromociones();
  const [abierta, setAbierta] = useState(false);
  return (
    <Pagina>
      <TituloPagina
        migas="Mi tienda"
        titulo="Promociones"
        bajada="Lo que ven tus clientes arriba de todo en la tienda."
      />
      <Boton
        variante="principal"
        tamano="lg"
        icono="add"
        anchoCompleto
        onClick={() => setAbierta(true)}
      >
        Nueva promoción
      </Boton>
      <AvisoError error={error} />
      {promos.map((p) => (
        <TarjetaPromo key={p.id} promo={p} onAlternar={() => alternar(p.id)} />
      ))}
      <HojaPromo
        abierta={abierta}
        onCerrar={() => setAbierta(false)}
        onGuardar={async (p) => {
          if ((await agregar(p)).ok) setAbierta(false);
        }}
      />
    </Pagina>
  );
}
