import css from './MockupTienda.module.css';

// Celular con una tienda real hecha con Mostry (captura de La Espiga).
export function MockupTienda() {
  return (
    <figure className={css.mockup}>
      <div className={css.celular}>
        <img
          src="/landing/tienda.webp"
          alt="Tienda de la facturería La Espiga hecha con Mostry"
          width="390"
          height="760"
        />
      </div>
      <figcaption className={css.pie}>Ejemplo: laespiga.mostry.com.ar</figcaption>
    </figure>
  );
}
