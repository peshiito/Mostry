import css from './BarraSubida.module.css';

// Progreso real de una subida (enviarConProgreso). Al llegar al 100 % el archivo
// ya está en el servidor, que todavía lo revisa y lo convierte: "Procesando…".
export function BarraSubida({ progreso, compacta }) {
  if (progreso == null) return null;
  const porcentaje = Math.round(progreso * 100);
  const texto = porcentaje < 100 ? `Subiendo… ${porcentaje} %` : 'Procesando…';
  return (
    <div className={`${css.subida} ${compacta ? css.compacta : ''}`}>
      <span className={css.texto} aria-hidden="true">
        {texto}
      </span>
      <span
        className={css.riel}
        role="progressbar"
        aria-label="Subiendo el archivo"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={porcentaje}
        aria-valuetext={texto}
      >
        <span className={css.relleno} style={{ '--avance': progreso }} />
      </span>
    </div>
  );
}
