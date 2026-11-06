import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { EsqueletoDetalle } from '../../../shared/ui/esqueletos/index.js';
import { FotoProducto } from '../../../shared/ui/FotoProducto.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { anticipacionDe } from '../../checkout/lib/anticipacion.js';
import { BarraAgregar } from '../components/BarraAgregar.jsx';
import { ProductoAusente } from '../components/ProductoAusente.jsx';
import { useProducto } from '../hooks/useCatalogo.js';
import { useTienda } from '../hooks/useTienda.js';
import { BarraSitio } from '../sitio/BarraSitio.jsx';
import css from './PantallaProducto.module.css';

// Ficha del producto como en una tienda online: foto grande y, al lado (en la
// compu) o abajo (en el celu), nombre, precio y descripción.
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
      <BarraSitio />
      <main id="contenido" tabIndex={-1} className={css.ficha}>
        <div className={css.marco} data-v="foto">
          <FotoProducto
            src={producto.fotoGrande}
            nombre={producto.nombre}
            srcSet={producto.fotoSrcset}
            sizes="(max-width: 900px) 100vw, 600px"
            alt={producto.nombre}
            className={css.foto}
            fetchPriority="high"
          />
        </div>
        <div className={css.datos}>
          <h1 className={css.nombre} data-v="titulo">
            {producto.nombre}
          </h1>
          <span className={css.precio} data-v="precio">
            <Monto centavos={producto.precio} tamano="lg" />
          </span>
          {producto.aceptaEncargo ? (
            <Aviso tipo="alerta" titulo="Por encargo" icono="schedule">
              Pedila con {anticipacionDe(tienda, [producto])} h de anticipación.
            </Aviso>
          ) : null}
          {producto.descripcion ? (
            <div className={css.descripcion}>
              <h2 className={css.subtitulo}>Descripción</h2>
              <p>{producto.descripcion}</p>
            </div>
          ) : null}
        </div>
      </main>
      <BarraAgregar
        producto={producto}
        cantidad={cantidad}
        onCantidad={setCantidad}
        onAgregado={() => navegar('/carrito')}
      />
    </>
  );
}
