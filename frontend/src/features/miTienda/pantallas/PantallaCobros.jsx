import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { AliasCobro } from '../components/AliasCobro.jsx';
import { EntregasYPlazos } from '../components/EntregasYPlazos.jsx';
import { useAjustesRapidos } from '../hooks/useAjustesRapidos.js';
import { useMiTienda } from '../hooks/useMiTienda.js';

// Cobros, envíos y plazos (Stitch 47 y 48).
export function PantallaCobros() {
  const m = useMiTienda();
  const { tienda, cobro } = useAjustesRapidos();
  return (
    <Pagina as="form" onSubmit={m.guardar}>
      <TituloPagina migas="Mi tienda" titulo="Cobros y envíos" />
      <Seccion titulo="Transferencias">
        <AliasCobro alias={tienda.alias} titular={tienda.titularAlias} accion={cobro} />
      </Seccion>
      <Seccion titulo="Entregas y plazos">
        <EntregasYPlazos t={m.t} onCambio={m.setT} />
      </Seccion>
      <AvisoError error={m.accion.error} />
      {m.guardado ? <Aviso tipo="ok" titulo="Cambios guardados" /> : null}
      <Boton
        type="submit"
        variante="principal"
        tamano="lg"
        anchoCompleto
        cargando={m.accion.enviando}
      >
        Guardar
      </Boton>
    </Pagina>
  );
}
