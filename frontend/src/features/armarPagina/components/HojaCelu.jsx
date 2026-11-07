import { CopiarDato } from '../../../shared/ui/CopiarDato.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { CodigoQr } from '../../club/components/CodigoQr.jsx';
import { useLinkBorrador } from '../hooks/useLinkBorrador.js';
import css from './HojaCelu.module.css';

// El QR del borrador: lo escaneás con el celu y ves la página antes de publicarla.
export function HojaCelu({ abierta, onCerrar, slug, guardarYa }) {
  const l = useLinkBorrador(abierta, slug, guardarYa);
  return (
    <Hoja
      abierta={abierta}
      onCerrar={onCerrar}
      titulo="Mirala en tu celu"
      subtitulo="Escaneá el código con la cámara. Muestra tus últimos cambios guardados, aunque no los hayas publicado."
    >
      <div className={css.cuerpo}>
        {l.error ? (
          <div className={css.error}>
            <p>No pudimos armar el link. Revisá la conexión.</p>
            <Boton onClick={l.reintentar}>Probar de nuevo</Boton>
          </div>
        ) : l.link ? (
          <>
            <div className={css.qr}>
              <CodigoQr texto={l.link} />
            </div>
            <CopiarDato
              etiqueta="Link"
              valor={`${new URL(l.link).host}/?borrador=…`}
              textoACopiar={l.link}
            />
            <Boton href={l.link} icono="open_in_new">
              Abrir en esta compu
            </Boton>
          </>
        ) : (
          <div className={css.esperando} aria-busy="true">
            Armando tu link…
          </div>
        )}
        <p className={css.nota}>
          Solo lo ve quien tenga el link, y vence en 24 horas. Tus clientes siguen viendo
          lo publicado.
        </p>
      </div>
    </Hoja>
  );
}
