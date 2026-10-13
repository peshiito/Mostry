import { useState } from 'react';
import { Buscador } from '../../../shared/ui/Buscador.jsx';
import { Chips } from '../../../shared/ui/Chips.jsx';
import { EsqueletoFilas } from '../../../shared/ui/esqueletos/index.js';
import { Paginador } from '../../../shared/ui/Paginador.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { PedidosVacio } from '../components/PedidosVacio.jsx';
import { TarjetaPedido } from '../components/TarjetaPedido.jsx';
import { usePedidosPanel } from '../hooks/usePedidosPanel.js';
import css from './PantallaPedidos.module.css';
import { ItemAnimado, ListaAnimada } from '../../../shared/movimiento/ListaAnimada.jsx';

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
        <EsqueletoFilas filas={4} />
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
            <ListaAnimada className={css.lista} reacomodar key={filtro}>
              {pedidos.map((p, i) => (
                <ItemAnimado key={p.id} i={i}>
                  <TarjetaPedido pedido={p} />
                </ItemAnimado>
              ))}
            </ListaAnimada>
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
