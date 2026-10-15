import { useConsulta } from '../../../shared/api/useConsulta.js';
import { haceCuanto } from '../../../shared/lib/fechas.js';
import { useBasePanel } from '../../panelBase/BasePanel.jsx';
import { Avatar } from '../../../shared/ui/Avatar.jsx';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { EsqueletoLista } from '../../../shared/ui/esqueletos/index.js';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Fila } from '../../../shared/ui/Fila.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';

const sellos = (n) => (n === 1 ? '1 sello' : `${n} sellos`);

// Socios del club en esta tienda (Lealtad L5): nombre, sellos y última compra.
export function PantallaSocios() {
  const { rutas } = useBasePanel();
  const { datos, cargando, error, recargar } = useConsulta('/panel/club/socios');
  if (error) return <ErrorCarga error={error} que="tus socios" onReintentar={recargar} />;
  if (cargando) return <EsqueletoLista />;
  return (
    <Pagina>
      <TituloPagina migas="Club de clientes" titulo="Socios" />
      {datos.length ? (
        <Lista>
          {datos.map((s) => (
            <Fila
              key={s.id}
              to={`${rutas}/club/socios/${s.id}`}
              inicio={<Avatar nombre={s.nombre} />}
              titulo={s.nombre}
              detalle={`${sellos(s.sellos)} · compró ${haceCuanto(s.ultimaCompra)}`}
              flecha
            />
          ))}
        </Lista>
      ) : (
        <Estado icono="loyalty" titulo="Todavía no hay socios">
          Cuando un cliente del Club te compre, aparece acá.
        </Estado>
      )}
    </Pagina>
  );
}
