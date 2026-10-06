import { plata } from '../../../shared/lib/plata.js';
import { Avatar } from '../../../shared/ui/Avatar.jsx';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { Fila } from '../../../shared/ui/Fila.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';

// Clientes de la libreta con su saldo: en rojo si deben, "Al día" si no.
export function ListaClientes({ clientes }) {
  return (
    <Lista>
      {clientes.map((c) => (
        <Fila
          key={c.id}
          to={`/panel/libreta/${c.id}`}
          inicio={<Avatar nombre={c.nombre} tono={c.saldo > 0 ? 'ladrillo' : 'verde'} />}
          titulo={c.nombre}
          fin={
            c.saldo > 0 ? (
              <strong>Debe {plata(c.saldo)}</strong>
            ) : (
              <Etiqueta tono="ok">Al día</Etiqueta>
            )
          }
          flecha
        />
      ))}
    </Lista>
  );
}
