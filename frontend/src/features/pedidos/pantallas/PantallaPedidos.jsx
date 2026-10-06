import { useState } from 'react';
import { Buscador } from '../../../shared/ui/Buscador.jsx';
import { Chips } from '../../../shared/ui/Chips.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Paginador } from '../../../shared/ui/Paginador.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { PedidosVacio } from '../components/PedidosVacio.jsx';
import { TarjetaPedido } from '../components/TarjetaPedido.jsx';
import { usePedidosPanel } from '../hooks/usePedidosPanel.js';
import css from './PantallaPedidos.module.css';

// Lista de pedidos con filtros (Stitch 25 y 52 vacío).
export function PantallaPedidos() {
  const [filtro, setFiltro] = useState('por_aprobar');
  const [busqueda, setBusqueda] = useState('');
  const { pedidos, filtros, total, cargando, pagina, paginas, setPagina } =
    usePedidosPanel(filtro, busqueda);
  const opciones = filtros.map((f) => ({
    valor: f.valor,
    texto: f.texto,
    cuenta: f.cuenta,
  }));
  return (
    <Pagina espacio="sm">
      <TituloPagina titulo="Pedidos" bajada="Pedidos y encargos de tu tienda" />
      {cargando ? (
        <Esqueleto filas={4} alto={110} />
      ) : total === 0 ? (
        <PedidosVacio />
      ) : (
        <>
          <Buscador
            valor={busqueda}
            onCambio={setBusqueda}
            placeholder="Buscar por cliente o número"
          />
          <Chips
            etiqueta="Filtrar pedidos"
            opciones={opciones}
            valor={filtro}
            onCambio={setFiltro}
          />
          {pedidos.length ? (
            <ul className={css.lista}>
              {pedidos.map((p) => (
                <li key={p.id}>
                  <TarjetaPedido pedido={p} />
                </li>
              ))}
            </ul>
          ) : (
            <Estado icono="check_circle" titulo="Nada por acá">
              No hay pedidos con este filtro.
            </Estado>
          )}
          <Paginador pagina={pagina} paginas={paginas} onCambio={setPagina} />
        </>
      )}
    </Pagina>
  );
}
