import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { REGISTRO } from '../../pagina/bloques/registro.js';
import { Opcion } from './campos.jsx';

const TIPOS = [
  ['catalogo', 'Todos los productos'],
  ['categoria', 'Una categoría'],
  ['producto', 'Un producto'],
  ['seccion', 'Una parte de esta página'],
  ['whatsapp', 'Tu WhatsApp'],
  ['web', 'Otra página (link)'],
];

const inicial = (tipo, ctx) =>
  ({
    categoria: { tipo, id: ctx.c.categorias[0]?.id },
    producto: { tipo, id: ctx.c.productos[0]?.id },
    seccion: { tipo, id: ctx.bloques[0]?.id },
    web: { tipo, url: 'https://' },
  })[tipo] ?? { tipo };

// Adónde lleva un botón. Siempre un destino con forma, nunca un link suelto.
export function SelectorDestino({ destino, onCambio, ctx }) {
  const lista = {
    categoria: ctx.c.categorias.map((k) => [k.id, k.nombre]),
    producto: ctx.c.productos.map((p) => [p.id, p.nombre]),
    seccion: ctx.bloques.map((b) => [b.id, REGISTRO[b.tipo]?.nombre ?? b.tipo]),
  }[destino.tipo];
  return (
    <>
      <Opcion
        etiqueta="Lleva a"
        opciones={TIPOS}
        valor={destino.tipo}
        onCambio={(t) => onCambio(inicial(t, ctx))}
      />
      {lista ? (
        <Opcion
          etiqueta="Cuál"
          opciones={lista}
          valor={destino.id}
          onCambio={(v) => onCambio({ ...destino, id: /^\d+$/.test(v) ? Number(v) : v })}
        />
      ) : null}
      {destino.tipo === 'web' ? (
        <Campo etiqueta="Link (tiene que empezar con https://)">
          {(c) => (
            <Entrada
              c={c}
              type="url"
              value={destino.url}
              maxLength={200}
              onChange={(e) => onCambio({ ...destino, url: e.target.value })}
            />
          )}
        </Campo>
      ) : null}
    </>
  );
}
