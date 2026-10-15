import { useConsulta } from '../../../shared/api/useConsulta.js';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { EsqueletoBloque } from '../../../shared/ui/esqueletos/Hueso.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { ListaCompras } from '../components/ListaCompras.jsx';
import { TarjetaTienda } from '../components/TarjetaTienda.jsx';
import css from './PantallaMisTiendas.module.css';

// Mis tiendas: una tarjeta de sellos por cada tienda donde juntó sellos, y
// abajo sus últimas compras (con el sello sumado y el premio usado).
export function PantallaMisTiendas() {
  const { datos, cargando, error, recargar } = useConsulta('/club/tiendas');
  const compras = useConsulta('/club/historial').datos ?? [];
  let cuerpo;
  if (error)
    cuerpo = <ErrorCarga error={error} que="tus tiendas" onReintentar={recargar} />;
  else if (cargando) cuerpo = <EsqueletoBloque alto={220} />;
  else if (!datos.length)
    cuerpo = (
      <Estado icono="storefront" titulo="Todavía no tenés sellos">
        Cuando compres en una tienda con Club, tus sellos aparecen acá.
      </Estado>
    );
  else
    cuerpo = (
      <ul className={css.lista}>
        {datos.map((t) => (
          <li key={t.slug}>
            <TarjetaTienda t={t} />
          </li>
        ))}
      </ul>
    );
  return (
    <>
      <TituloPagina titulo="Mis tiendas" bajada="Tus sellos en cada tienda del Club." />
      {cuerpo}
      {compras.length ? (
        <Seccion titulo="Tus últimas compras">
          <ListaCompras compras={compras} conTienda />
        </Seccion>
      ) : null}
    </>
  );
}
