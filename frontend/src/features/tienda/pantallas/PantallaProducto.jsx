import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { HeaderTienda } from '../components/HeaderTienda.jsx';
import { BarraAgregar } from '../components/BarraAgregar.jsx';
import { useProducto } from '../hooks/useCatalogo.js';
import { useTienda } from '../hooks/useTienda.js';
import css from './PantallaProducto.module.css';

// Detalle de producto (Stitch 14).
export function PantallaProducto() {
  const { id } = useParams();
  const { producto, cargando } = useProducto(id);
  const { tienda } = useTienda();
  const [cantidad, setCantidad] = useState(1);
  const navegar = useNavigate();
  if (cargando) return <Esqueleto filas={4} alto={120} />;
  if (!producto) {
    return (
      <>
        <HeaderTienda volver="/catalogo" />
        <Estado icono="search" titulo="Ese producto ya no está">
          Puede que lo hayan sacado del catálogo.
        </Estado>
      </>
    );
  }
  return (
    <>
      <HeaderTienda volver="/catalogo" titulo={producto.nombre} />
      <img
        src={producto.fotoGrande}
        srcSet={producto.fotoSrcset}
        sizes="(max-width: 480px) 100vw, 480px"
        alt={producto.nombre}
        className={css.foto}
        fetchPriority="high"
      />
      <Pagina espacio="sm" className={css.cuerpo}>
        {producto.aceptaEncargo ? (
          <Aviso tipo="alerta" titulo="Por encargo" icono="schedule">
            Pedila con {tienda.anticipacionEncargoHoras} h de anticipación.
          </Aviso>
        ) : null}
        <Tarjeta>
          <h1 className={css.nombre}>{producto.nombre}</h1>
          <div className={css.precio}>
            <span>Precio</span>
            <Monto centavos={producto.precio} tamano="lg" />
          </div>
        </Tarjeta>
        <Tarjeta>
          <h2 className={css.subtitulo}>Descripción</h2>
          <p>{producto.descripcion}</p>
        </Tarjeta>
      </Pagina>
      <BarraAgregar
        producto={producto}
        cantidad={cantidad}
        onCantidad={setCantidad}
        onAgregado={() => navegar('/carrito')}
      />
    </>
  );
}
