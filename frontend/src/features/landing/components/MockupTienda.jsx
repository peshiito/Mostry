import { Celular } from './Celular.jsx';
import css from './MockupTienda.module.css';

// Celular con una tienda hecha con Mostry (La Espiga, comercio de ejemplo).
export function MockupTienda() {
  return (
    <figure className={css.mockup}>
      <Celular
        prioridad
        imagenes={[
          {
            src: '/landing/cuadra/espiga.webp',
            alt: 'Tienda de la facturería La Espiga hecha con Mostry',
          },
        ]}
      />
      <figcaption className={css.pie} translate="no">
        la-espiga.mostry.com.ar
      </figcaption>
    </figure>
  );
}
