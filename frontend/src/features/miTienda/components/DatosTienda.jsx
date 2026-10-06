import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { LogoTienda } from '../../../shared/ui/LogoTienda.jsx';
import css from './DatosTienda.module.css';

// Logo (se sube al toque), nombre, frase, WhatsApp y dirección.
export function DatosTienda({ t, onCambio, onLogo, subiendoLogo, errores = {} }) {
  const set = (k) => (e) => onCambio({ ...t, [k]: e.target.value });
  const elegir = (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (archivo) onLogo(archivo);
  };
  return (
    <div className={css.datos}>
      <label className={css.logo}>
        <LogoTienda url={t.logoUrl} tamano={72} className={css.circulo} />
        <span className={css.cambiar}>{subiendoLogo ? 'Subiendo…' : 'Cambiar logo'}</span>
        <input
          type="file"
          accept="image/jpeg,image/png"
          className="soloLector"
          onChange={elegir}
        />
      </label>
      <Campo etiqueta="Nombre del negocio" error={errores.nombre}>
        {(c) => <Entrada c={c} value={t.nombre} onChange={set('nombre')} />}
      </Campo>
      <Campo etiqueta="Frase" error={errores.frase}>
        {(c) => (
          <Entrada c={c} maxLength={160} value={t.frase ?? ''} onChange={set('frase')} />
        )}
      </Campo>
      <Campo etiqueta="WhatsApp del local" error={errores.whatsapp}>
        {(c) => (
          <Entrada
            c={c}
            type="tel"
            prefijo="+"
            value={t.whatsapp ?? ''}
            onChange={set('whatsapp')}
          />
        )}
      </Campo>
      <Campo etiqueta="Dirección" error={errores.direccion}>
        {(c) => <Entrada c={c} value={t.direccion ?? ''} onChange={set('direccion')} />}
      </Campo>
    </div>
  );
}
