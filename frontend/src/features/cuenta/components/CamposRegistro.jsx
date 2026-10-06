import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { AceptarTerminos } from './AceptarTerminos.jsx';
import { CampoClave } from './CampoClave.jsx';
import { CampoSlug } from './CampoSlug.jsx';

// Campos del registro: email, clave, nombre, negocio, link y términos.
export function CamposRegistro({ f, cambiar, errores, errSlug }) {
  const set = (k) => (e) => cambiar(k, e.target.value);
  return (
    <>
      <Campo etiqueta="Email" error={errores.email}>
        {(c) => (
          <Entrada
            c={c}
            type="email"
            autoComplete="email"
            value={f.email}
            onChange={set('email')}
          />
        )}
      </Campo>
      <CampoClave
        nueva
        valor={f.clave}
        onCambio={(v) => cambiar('clave', v)}
        error={errores.clave}
      />
      <Campo etiqueta="Tu nombre" error={errores.nombre}>
        {(c) => (
          <Entrada c={c} autoComplete="name" value={f.nombre} onChange={set('nombre')} />
        )}
      </Campo>
      <Campo etiqueta="Nombre del negocio" error={errores.negocio}>
        {(c) => (
          <Entrada
            c={c}
            autoComplete="organization"
            value={f.negocio}
            onChange={set('negocio')}
          />
        )}
      </Campo>
      <CampoSlug
        valor={f.slug}
        onCambio={(v) => cambiar('slug', v)}
        error={errores.slug ?? errSlug}
      />
      <AceptarTerminos
        valor={f.terminos}
        onCambio={(v) => cambiar('terminos', v)}
        error={errores.terminos}
      />
    </>
  );
}
