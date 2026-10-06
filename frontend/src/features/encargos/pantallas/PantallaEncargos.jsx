import { useState } from 'react';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { TarjetaEncargo } from '../components/TarjetaEncargo.jsx';
import { TiraSemana } from '../components/TiraSemana.jsx';
import { useEncargos } from '../hooks/useEncargos.js';

// Agenda de encargos (Stitch 41). Los encargos no tocan el stock (6.2).
export function PantallaEncargos() {
  const { delDia, conEncargos, cambiar, error } = useEncargos();
  const [dia, setDia] = useState(() => new Date().toLocaleDateString('sv-SE'));
  const lista = delDia(dia);
  return (
    <Pagina>
      <TituloPagina
        migas="Negocio"
        titulo="Encargos"
        bajada="Pedidos programados con fecha y seña"
      />
      <AvisoError error={error} />
      <TiraSemana
        desde={new Date()}
        elegido={dia}
        onElegir={setDia}
        conEncargos={conEncargos}
      />
      {lista.length ? (
        lista.map((e, i) => (
          <TarjetaEncargo
            key={e.id}
            encargo={e}
            principal={i === 0}
            onCambiar={cambiar}
          />
        ))
      ) : (
        <Estado icono="calendar_month" titulo="Sin encargos este día">
          Cuando un cliente encargue algo, aparece acá.
        </Estado>
      )}
    </Pagina>
  );
}
