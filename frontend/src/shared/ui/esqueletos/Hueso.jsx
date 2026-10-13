import base from '../Esqueleto.module.css';

// Un bloque gris con brillo, del tamaño de lo que va a aparecer en su lugar.
export function Hueso({ ancho = '100%', alto = 16, redondo, className = '' }) {
  return (
    <span
      className={`${base.bloque} ${className}`}
      style={{ width: ancho, height: alto, borderRadius: redondo ? '50%' : undefined }}
    />
  );
}

// Envoltorio común: el lector de pantalla anuncia "Cargando…" una sola vez.
export function Cargando({ className, children }) {
  return (
    <div className={className} aria-busy="true">
      <span role="status" className="soloLector">
        Cargando…
      </span>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

// Una tarjeta grande (ganancia, gráfico) dentro de una pantalla ya armada.
export function EsqueletoBloque({ alto = 160 }) {
  return (
    <Cargando>
      <Hueso alto={alto} />
    </Cargando>
  );
}
