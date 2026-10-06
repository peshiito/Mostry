import { Boton } from '../../../shared/ui/Boton.jsx';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { Fila } from '../../../shared/ui/Fila.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';
import { Miniatura } from '../../../shared/ui/Miniatura.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';

// Alertas de stock (sección 3.3).
export function StockBajo({ productos }) {
  if (!productos.length) return null;
  return (
    <Seccion titulo="Stock bajo">
      <Lista>
        {productos.map((p) => (
          <Fila
            key={p.id}
            inicio={<Miniatura src={p.foto} />}
            titulo={p.nombre}
            detalle={
              p.stock === 0 ? (
                <Etiqueta tono="ladrillo">Agotado</Etiqueta>
              ) : (
                `Quedan ${p.stock} (avisás con menos de ${p.stockMinimo})`
              )
            }
            fin={
              <Boton tamano="sm" to={`/panel/productos/${p.id}`}>
                Reponer
              </Boton>
            }
          />
        ))}
      </Lista>
    </Seccion>
  );
}
