import { Navigate } from 'react-router';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { LayoutCuenta } from '../../cuenta/components/LayoutCuenta.jsx';
import { useCliente } from '../hooks/useCliente.js';
import css from './PantallaClub.module.css';

const BENEFICIOS = [
  { icono: 'qr_code_2', texto: 'Un solo QR para todas las tiendas con Club.' },
  { icono: 'storefront', texto: 'Sumás sellos comprando online o en el local.' },
  { icono: 'percent', texto: 'Con los sellos, cada tienda te da sus premios.' },
];

// Presentación del Club (mostry.com.ar/club). Con sesión, directo a Mi QR.
export function PantallaClub() {
  const { cliente } = useCliente();
  if (cliente) return <Navigate to="/club/qr" replace />;
  return (
    <LayoutCuenta volver="/">
      <section className={css.club}>
        <p className={css.sello} aria-hidden="true">
          <Icono nombre="qr_code_2" tamano={40} />
        </p>
        <h1 className={css.titulo}>Club Mostry</h1>
        <p className={css.bajada}>Comprá en tus tiendas de barrio y juntá premios.</p>
        <ul className={css.lista}>
          {BENEFICIOS.map((b) => (
            <li key={b.icono}>
              <Icono nombre={b.icono} />
              {b.texto}
            </li>
          ))}
        </ul>
        <Boton to="/club/registro" variante="principal" tamano="lg" anchoCompleto>
          Crear mi cuenta
        </Boton>
        <Boton to="/club/ingresar" tamano="lg" anchoCompleto>
          Ya tengo cuenta
        </Boton>
      </section>
    </LayoutCuenta>
  );
}
