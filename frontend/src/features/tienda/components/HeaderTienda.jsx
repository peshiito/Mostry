import { DOMINIO_BASE } from '../../../shared/lib/zonaActual.js';
import { BotonTema } from '../../../shared/tema/BotonTema.jsx';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { LogoTienda } from '../../../shared/ui/LogoTienda.jsx';
import { Toldo } from '../../../shared/ui/Toldo.jsx';
import { useCarrito } from '../../carrito/useCarrito.js';
import { useTienda } from '../hooks/useTienda.js';
import { EstadoApertura } from './EstadoApertura.jsx';
import css from './HeaderTienda.module.css';

// Toldo verde de la tienda. Completo en inicio/catálogo; compacto con "Volver".
export function HeaderTienda({ volver, titulo }) {
  const { tienda } = useTienda();
  const { unidades } = useCarrito();
  return (
    <>
      <header className={css.header}>
        <div className={css.barra}>
          {volver ? (
            <BotonIcono
              icono="arrow_back"
              etiqueta="Volver"
              to={volver}
              tono="sobreVerde"
            />
          ) : (
            <span className={css.dominio}>
              {tienda.slug}.{DOMINIO_BASE}
            </span>
          )}
          {volver ? <span className={css.titulo}>{titulo ?? tienda.nombre}</span> : null}
          <BotonTema tono="sobreVerde" />
          <BotonIcono
            icono="shopping_bag"
            etiqueta={`Ver carrito (${unidades} ${unidades === 1 ? 'producto' : 'productos'})`}
            to="/carrito"
            insignia={unidades || null}
            tono="sobreVerde"
          />
        </div>
        {volver ? null : (
          <div className={css.marca}>
            <LogoTienda url={tienda.logoUrl} tamano={72} />
            <div className={css.textos}>
              <div className={css.nombreFila}>
                <h1 className={css.nombre}>{tienda.nombre}</h1>
                <EstadoApertura />
              </div>
              <p className={css.frase}>{tienda.frase}</p>
            </div>
          </div>
        )}
      </header>
      <Toldo />
    </>
  );
}
