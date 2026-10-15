import { Lista } from '../../../shared/ui/Lista.jsx';
import { Fila } from '../../../shared/ui/Fila.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';

// Lo que salió hoy en el local: el total y lo más vendido.
export function VendidoHoy({ datos }) {
  if (!datos?.ventas?.length) return null;
  return (
    <Seccion titulo={`Vendido hoy en el local (${datos.ventas.length})`}>
      <Lista>
        {datos.masVendidos.map((p) => (
          <Fila
            key={p.nombre}
            titulo={p.nombre}
            detalle={`${p.cantidad} vendidos`}
            fin={<Monto centavos={p.total} tamano="sm" />}
          />
        ))}
        <Fila
          titulo="Total del día"
          fin={<Monto animado centavos={datos.total} tamano="md" />}
        />
      </Lista>
    </Seccion>
  );
}
