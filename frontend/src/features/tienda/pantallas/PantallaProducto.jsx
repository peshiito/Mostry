import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { anticipacionDe } from '../../checkout/lib/anticipacion.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { EsqueletoDetalle } from '../../../shared/ui/esqueletos/index.js';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { HeaderTienda } from '../components/HeaderTienda.jsx';
import { BarraAgregar } from '../components/BarraAgregar.jsx';
import { ProductoAusente } from '../components/ProductoAusente.jsx';
import { useProducto } from '../hooks/useCatalogo.js';
import { useTienda } from '../hooks/useTienda.js';
import css from './PantallaProducto.module.css';
import { ImagenSuave } from '../../../shared/ui/ImagenSuave.jsx';

// Detalle de producto (Stitch 14).
export function PantallaProducto() {
  const { id } = useParams();
  const { producto, cargando, error, recargar } = useProducto(id);
  const { tienda } = useTienda();
  const [cantidad, setCantidad] = useState(1);
  const navegar = useNavigate();
  if (cargando) return <EsqueletoDetalle imagen bloques={1} />;
  if (!producto) return <ProductoAusente error={error} onReintentar={recargar} />;
  return (
    <>
      <HeaderTienda volver="/catalogo" titulo={producto.nombre} />
      <ImagenSuave
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
            Pedila con {anticipacionDe(tienda, [producto])} h de anticipación.
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
