import { Link } from 'react-router';
import { Boton } from '../../../shared/ui/Boton.jsx';
import css from './Cierre.module.css';

// Llamado final y pie del sitio.
export function Cierre() {
  return (
    <>
      <section className={css.cierre}>
        <h2 className={css.titulo}>Abrí tu vidriera online esta misma tarde.</h2>
        <p className={css.texto}>
          Empezá a recibir pedidos ordenados sin pagar comisiones por venta.
        </p>
        <Boton tamano="lg" to="/registro">
          Crear mi tienda
        </Boton>
      </section>
      <footer className={css.pie}>
        <span>
          © {new Date().getFullYear()} Mostry · Hecho en Argentina para comercios de
          barrio
        </span>
        <nav aria-label="Legales" className={css.links}>
          <Link to="/legal">Términos</Link>
          <Link to="/legal?privacidad">Privacidad</Link>
        </nav>
      </footer>
    </>
  );
}
