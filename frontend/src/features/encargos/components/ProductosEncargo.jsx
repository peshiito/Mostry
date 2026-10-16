import { plata } from '../../../shared/lib/plata.js';
import { AreaTexto, Campo } from '../../../shared/ui/Campo.jsx';
import { Cantidad } from '../../../shared/ui/Cantidad.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import css from './NuevoEncargo.module.css';

// Lo que encargó, de los productos que se encargan. La nota es opcional: ahí
// va lo que pidió por WhatsApp (el texto de la torta, el sabor…).
export function ProductosEncargo({ form, productos, onCambio }) {
  if (productos.length === 0)
    return (
      <Estado icono="cake" titulo="No tenés productos que se encarguen">
        En Productos, prendé "También se puede encargar" en los que hacés a pedido.
      </Estado>
    );
  const cantidad = (id) => form.cantidades[id] ?? 0;
  const setCantidad = (id) => (n) =>
    onCambio({ ...form, cantidades: { ...form.cantidades, [id]: n } });
  const setNota = (id) => (e) =>
    onCambio({ ...form, notas: { ...form.notas, [id]: e.target.value } });
  return (
    <Tarjeta className={css.bloque}>
      {productos.map((p) => (
        <div key={p.id} className={css.producto}>
          <div className={css.fila}>
            <div>
              <p className={css.nombre}>{p.nombre}</p>
              <p className={css.precio}>{plata(p.precio)}</p>
            </div>
            <Cantidad
              valor={cantidad(p.id)}
              min={0}
              nombre={p.nombre}
              onCambio={setCantidad(p.id)}
            />
          </div>
          {cantidad(p.id) > 0 ? (
            <Campo etiqueta={p.indicacionPersonalizacion || 'Nota (opcional)'}>
              {(c) => (
                <AreaTexto
                  c={c}
                  maxLength={500}
                  value={form.notas[p.id] ?? ''}
                  onChange={setNota(p.id)}
                />
              )}
            </Campo>
          ) : null}
        </div>
      ))}
    </Tarjeta>
  );
}
