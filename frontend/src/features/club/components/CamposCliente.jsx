import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';

// Nombre, WhatsApp y dirección del cliente (registro y "Mis datos").
export function CamposCliente({ f, cambiar, errores = {} }) {
  const set = (k) => (e) => cambiar(k, e.target.value);
  return (
    <>
      <Campo etiqueta="Tu nombre" error={errores.nombre}>
        {(c) => (
          <Entrada c={c} autoComplete="name" value={f.nombre} onChange={set('nombre')} />
        )}
      </Campo>
      <Campo
        etiqueta="WhatsApp"
        ayuda="Con código de área, sin el 15. Ej: 11 5555-1234"
        error={errores.whatsapp}
      >
        {(c) => (
          <Entrada
            c={c}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={f.whatsapp}
            onChange={set('whatsapp')}
          />
        )}
      </Campo>
      <Campo
        etiqueta="Dirección (opcional)"
        ayuda="Para los envíos"
        error={errores.direccion}
      >
        {(c) => (
          <Entrada
            c={c}
            autoComplete="street-address"
            value={f.direccion}
            onChange={set('direccion')}
          />
        )}
      </Campo>
    </>
  );
}
