import { useState } from 'react';
import { avisar } from '../../../shared/avisos/avisos.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { HojaBiblioteca } from './HojaBiblioteca.jsx';
import { ListaBloques } from './ListaBloques.jsx';
import css from './ColumnaBloques.module.css';

// La lista de bloques y "Agregar bloque" (el nuevo entra al final y queda elegido).
export function ColumnaBloques({ e, c, elegido, onEditar }) {
  const [biblioteca, setBiblioteca] = useState(false);
  function agregar(tipo) {
    const datos = tipo === 'destacado' ? { productoId: c.productos[0]?.id } : undefined;
    if (tipo === 'destacado' && !datos.productoId)
      return avisar.error('Primero cargá algún producto en Productos.');
    e.despachar({ tipo: 'agregar', bloque: tipo, datos });
    setBiblioteca(false);
  }
  return (
    <section className={css.columna} aria-label="Bloques">
      <ListaBloques
        bloques={e.doc.bloques}
        elegido={elegido}
        despachar={e.despachar}
        onEditar={onEditar}
      />
      <Boton icono="add" anchoCompleto onClick={() => setBiblioteca(true)}>
        Agregar bloque
      </Boton>
      <HojaBiblioteca
        abierta={biblioteca}
        onCerrar={() => setBiblioteca(false)}
        onElegir={agregar}
      />
    </section>
  );
}
