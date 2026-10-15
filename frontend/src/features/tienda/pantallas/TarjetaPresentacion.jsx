import { linkWhatsapp } from '../../../shared/lib/linkSeguro.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { LogoTienda } from '../../../shared/ui/LogoTienda.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { FranjaClub } from '../components/FranjaClub.jsx';
import { useTienda } from '../hooks/useTienda.js';
import css from './TiendaCerrada.module.css';

// La tienda no vende por internet (Mejoras 3, parte A): su link es una tarjeta
// de presentación con lo justo para encontrarla y escribirle.
export function TarjetaPresentacion() {
  const { tienda, estado } = useTienda();
  const abierta = estado === 'abierta';
  const whatsapp = linkWhatsapp(tienda.whatsapp);
  return (
    <Pagina className={css.pagina}>
      <LogoTienda url={tienda.logoUrl} tamano={96} borde="ninguno" className={css.logo} />
      <h1 className={css.titulo}>{tienda.nombre}</h1>
      {tienda.frase ? <p className={css.texto}>{tienda.frase}</p> : null}
      <Etiqueta tono={abierta ? 'ok' : 'gris'}>
        {abierta ? 'Abierto ahora' : 'Cerrado ahora'}
      </Etiqueta>
      <Tarjeta className={css.datos}>
        {tienda.direccion ? <p className={css.nombre}>{tienda.direccion}</p> : null}
        <p>{tienda.horarioTexto}</p>
      </Tarjeta>
      <FranjaClub club={tienda.club} />
      {whatsapp ? (
        <Boton variante="principal" tamano="lg" icono="chat" href={whatsapp}>
          Escribinos por WhatsApp
        </Boton>
      ) : null}
    </Pagina>
  );
}
