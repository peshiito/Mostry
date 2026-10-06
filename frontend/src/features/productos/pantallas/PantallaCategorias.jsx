import { useState } from 'react';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { FilaCategoria } from '../components/FilaCategoria.jsx';
import { useCategoriasPanel } from '../hooks/useCategoriasPanel.js';
import css from './PantallaProductos.module.css';

// Categorías del catálogo (Stitch 32).
export function PantallaCategorias() {
  const { cats, mover, quitar, agregar, error: errorApi } = useCategoriasPanel();
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  async function enviar(e) {
    e.preventDefault();
    if (nombre.trim().length < 2) return setError('Escribí un nombre.');
    setError('');
    if (await agregar(nombre.trim())) setNombre('');
  }
  return (
    <Pagina>
      <TituloPagina
        migas="Productos"
        titulo="Categorías"
        bajada="El orden es el que ven tus clientes en la tienda."
      />
      <AvisoError error={errorApi} />
      <ul className={css.lista}>
        {cats.map((c, i) => (
          <FilaCategoria
            key={c.id}
            cat={c}
            primera={i === 0}
            ultima={i === cats.length - 1}
            onSubir={() => mover(i, -1)}
            onBajar={() => mover(i, 1)}
            onQuitar={() => quitar(c.id)}
          />
        ))}
      </ul>
      <Tarjeta as="form" onSubmit={enviar} noValidate>
        <Campo etiqueta="Nueva categoría" error={error}>
          {(c) => (
            <Entrada
              c={c}
              value={nombre}
              placeholder="Ej: Sándwiches de miga"
              onChange={(e) => setNombre(e.target.value)}
            />
          )}
        </Campo>
        <Boton
          type="submit"
          variante="principal"
          icono="add"
          anchoCompleto
          className={css.agregar}
        >
          Agregar categoría
        </Boton>
      </Tarjeta>
    </Pagina>
  );
}
