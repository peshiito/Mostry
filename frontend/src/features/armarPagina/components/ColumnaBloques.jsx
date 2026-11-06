import { useState } from 'react';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { HojaBiblioteca } from './HojaBiblioteca.jsx';
import { ListaBloques } from './ListaBloques.jsx';
import css from './ColumnaBloques.module.css';

// La lista de bloques y "Agregar bloque" (el nuevo entra al final y queda elegido).
export function ColumnaBloques({ e, elegido, onEditar }) {
  const [biblioteca, setBiblioteca] = useState(false);
  function agregar(tipo) {
    e.despachar({ tipo: 'agregar', bloque: tipo });
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
