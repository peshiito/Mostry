import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { SeccionTitulo } from '../../../shared/ui/SeccionTitulo.jsx';
import { AccesosCategorias } from '../components/AccesosCategorias.jsx';
import { BarraCarrito } from '../components/BarraCarrito.jsx';
import { EstadoCatalogo } from '../components/EstadoCatalogo.jsx';
import { Destacados } from '../components/Destacados.jsx';
import { FilaProducto } from '../components/FilaProducto.jsx';
import { HeaderTienda } from '../components/HeaderTienda.jsx';
import { PieTienda } from '../components/PieTienda.jsx';
import { PromoGondola } from '../components/PromoGondola.jsx';
import { useCatalogo } from '../hooks/useCatalogo.js';
import { useTienda } from '../hooks/useTienda.js';
import css from './Listado.module.css';

// Inicio de la tienda pública (Stitch 11 y 12).
export function PantallaInicio() {
  const { tienda, estado } = useTienda();
  const { productos, destacados, categorias, cargando, error, recargar } = useCatalogo();
  const espera = (
    <EstadoCatalogo cargando={cargando} error={error} onReintentar={recargar} />
  );
  return (
    <>
      <HeaderTienda />
      <Pagina>
        {estado === 'cerrada' ? (
          <Aviso tipo="alerta" titulo="Ahora solo tomamos encargos" icono="schedule">
            El local está cerrado. Podés encargar tortas y pastelería para otro día.
          </Aviso>
        ) : (
          <PromoGondola promo={tienda.promo} />
        )}
        {cargando || error ? espera : <AccesosCategorias categorias={categorias} />}
        <Destacados productos={destacados} />
        <section aria-labelledby="todo" className={css.seccion}>
          <SeccionTitulo id="todo" titulo="Todo el mostrador" bajada="Hecho hoy" />
          <ul className={css.lista}>
            {productos.map((p) => (
              <FilaProducto key={p.id} producto={p} />
            ))}
          </ul>
        </section>
        {tienda.aceptaEnvio ? (
          <Aviso icono="local_shipping">
            Envíos {tienda.zonaEnvio.toLowerCase()} o retiro en el local.
          </Aviso>
        ) : null}
      </Pagina>
      <PieTienda />
      <BarraCarrito />
    </>
  );
}
