import { useParams } from 'react-router';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { EsqueletoDetalle } from '../../../shared/ui/esqueletos/index.js';
import { NoEncontrada } from '../../../shared/ui/NoEncontrada.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { ListaCompras } from '../../club/components/ListaCompras.jsx';
import { useBasePanel } from '../../panelBase/BasePanel.jsx';

// La ficha de un socio: sus sellos y lo que compró en ESTA tienda.
export function PantallaSocio() {
  const { id } = useParams();
  const { rutas } = useBasePanel();
  const consulta = useConsulta(`/panel/club/socios/${id}`);
  if (consulta.cargando) return <EsqueletoDetalle />;
  const s = consulta.datos;
  if (!s)
    return (
      <NoEncontrada zona="panel" volver={`${rutas}/club/socios`} consulta={consulta} />
    );
  return (
    <Pagina>
      <TituloPagina
        migas="Socios"
        titulo={s.nombre}
        bajada={s.sellos === 1 ? 'Tiene 1 sello.' : `Tiene ${s.sellos} sellos.`}
      />
      <Seccion titulo="Sus compras en tu tienda">
        <ListaCompras compras={s.compras} />
      </Seccion>
    </Pagina>
  );
}
