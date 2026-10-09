import css from './VideoTrailer.module.css';

// El tráiler (el mismo del Reel), en un celular. No arranca solo: se reproduce
// con el botón, con sonido si la persona quiere.
export function VideoTrailer() {
  return (
    <div className={css.video}>
      <div className={css.celular}>
        <video
          className={css.pantalla}
          src="/landing/trailer.mp4"
          poster="/landing/trailer-portada.webp"
          controls
          playsInline
          preload="none"
          width="720"
          height="1280"
          aria-label="Video: cómo funciona Mostry, en 75 segundos"
        >
          <track
            kind="captions"
            src="/landing/trailer.vtt"
            srcLang="es"
            label="Español"
          />
        </video>
      </div>
      <ul className={css.lista}>
        <li>Cinco comercios de ejemplo, cinco rubros distintos.</li>
        <li>Del pedido por WhatsApp al pedido ordenado.</li>
        <li>Caja, fiados y encargos en el mismo lugar.</li>
      </ul>
    </div>
  );
}
