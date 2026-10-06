import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Interruptor } from '../../../shared/ui/Interruptor.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import css from './EntregasYPlazos.module.css';

// Retiro/envío con costo y zona, y plazos del comprobante, encargos y seña.
export function EntregasYPlazos({ t, onCambio }) {
  const set = (k) => (e) => onCambio({ ...t, [k]: e.target.value });
  const num = (k, etiqueta, sufijo) => (
    <Campo etiqueta={etiqueta}>
      {(c) => (
        <Entrada
          c={c}
          type="number"
          min="0"
          inputMode="numeric"
          sufijo={sufijo}
          value={t[k]}
          onChange={set(k)}
        />
      )}
    </Campo>
  );
  return (
    <>
      <Tarjeta className={css.bloque}>
        <Interruptor
          etiqueta="Retiro en el local"
          activo={t.aceptaRetiro}
          onCambio={(v) => onCambio({ ...t, aceptaRetiro: v })}
        />
        <Interruptor
          etiqueta="Envío a domicilio"
          activo={t.aceptaEnvio}
          onCambio={(v) => onCambio({ ...t, aceptaEnvio: v })}
        />
        {t.aceptaEnvio ? (
          <>
            <Campo etiqueta="Costo del envío">
              {(c) => (
                <Entrada
                  c={c}
                  prefijo="$"
                  inputMode="decimal"
                  value={t.costoEnvio / 100}
                  onChange={(e) =>
                    onCambio({ ...t, costoEnvio: Number(e.target.value) * 100 })
                  }
                />
              )}
            </Campo>
            <Campo etiqueta="Zona de envío">
              {(c) => (
                <Entrada c={c} value={t.zonaEnvio ?? ''} onChange={set('zonaEnvio')} />
              )}
            </Campo>
          </>
        ) : null}
      </Tarjeta>
      <Tarjeta className={css.bloque}>
        {num('plazoComprobanteHoras', 'Tiempo para mandar el comprobante', 'h')}
        {num('anticipacionEncargoHoras', 'Anticipación mínima de encargos', 'h')}
        {num('senaPorcentaje', 'Seña de encargos (0 = sin seña)', '%')}
        {num('plazoSenaHoras', 'Tiempo para mandar la seña', 'h')}
      </Tarjeta>
    </>
  );
}
