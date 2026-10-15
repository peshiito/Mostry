import { fechaHora } from '../../../shared/lib/fechas.js';
import { plata } from '../../../shared/lib/plata.js';
import { Fila } from '../../../shared/ui/Fila.jsx';
import { SeccionTitulo } from '../../../shared/ui/SeccionTitulo.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { usePorAceptar } from '../hooks/usePorAceptar.js';
import css from './PorAceptar.module.css';

// Encargos 2: arriba de la agenda, lo que hay que decidir. Cada uno abre el
// detalle, donde se ve la personalización y se acepta o se rechaza.
export function PorAceptar() {
  const { encargos, total } = usePorAceptar();
  if (total === 0) return null;
  return (
    <Tarjeta className={css.bloque}>
      <SeccionTitulo
        titulo={`Por aceptar (${total})`}
        bajada="Revisalos y aceptalos: recién ahí el cliente paga la seña."
      />
      {encargos.map((e) => (
        <Fila
          key={e.id}
          to={`/panel/pedidos/${e.id}`}
          titulo={`${e.clienteNombre} · #${e.numero}`}
          detalle={`Para el ${fechaHora(e.fechaEncargo)}`}
          fin={plata(e.total)}
          flecha
        />
      ))}
    </Tarjeta>
  );
}
