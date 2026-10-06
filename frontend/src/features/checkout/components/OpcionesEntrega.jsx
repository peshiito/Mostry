import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { plata } from '../../../shared/lib/plata.js';
import { OpcionTarjeta } from '../../../shared/ui/OpcionTarjeta.jsx';
import css from './Bloque.module.css';

// "Entrega": retiro o envío. Con envío aparecen dirección y link de Maps.
export function OpcionesEntrega({
  tienda,
  entrega,
  onEntrega,
  datos,
  errores,
  onCambio,
}) {
  const set = (k) => (e) => onCambio({ ...datos, [k]: e.target.value });
  return (
    <fieldset className={css.bloque}>
      <legend className={css.titulo}>Entrega</legend>
      {tienda.aceptaRetiro ? (
        <OpcionTarjeta
          nombre="entrega"
          valor="retiro"
          elegido={entrega}
          onElegir={onEntrega}
          titulo="Retiro en el local"
          detalle={tienda.direccion}
          fin="Sin costo"
        />
      ) : null}
      {tienda.aceptaEnvio ? (
        <OpcionTarjeta
          nombre="entrega"
          valor="envio"
          elegido={entrega}
          onElegir={onEntrega}
          titulo="Envío a domicilio"
          detalle={tienda.zonaEnvio}
          fin={plata(tienda.costoEnvio)}
        />
      ) : null}
      {entrega === 'envio' ? (
        <>
          <Campo etiqueta="Dirección, piso y timbre" error={errores.direccion}>
            {(c) => (
              <Entrada
                c={c}
                autoComplete="street-address"
                value={datos.direccion}
                onChange={set('direccion')}
              />
            )}
          </Campo>
          <Campo etiqueta="Link de Google Maps (opcional)" error={errores.linkMaps}>
            {(c) => (
              <Entrada
                c={c}
                type="url"
                inputMode="url"
                value={datos.linkMaps}
                onChange={set('linkMaps')}
              />
            )}
          </Campo>
        </>
      ) : null}
    </fieldset>
  );
}
