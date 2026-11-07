import { useEffect } from 'react';
import { salirDelBorrador } from '../lib/tokenBorrador.js';
import css from './FranjaBorrador.module.css';

// Arriba de todo mientras el dueño mira su borrador desde el link del QR.
export function FranjaBorrador({ slug }) {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.append(meta);
    return () => meta.remove();
  }, []);
  const salir = () => {
    salirDelBorrador(slug);
    window.location.assign('/');
  };
  return (
    <div className={css.franja} role="status">
      <p className={css.texto}>
        <strong>Estás viendo tu borrador.</strong> Solo lo ves vos, hasta que lo
        publiques.
      </p>
      <button type="button" className={css.salir} onClick={salir}>
        Salir
      </button>
    </div>
  );
}
