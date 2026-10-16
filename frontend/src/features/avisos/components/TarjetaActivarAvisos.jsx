import { useEffect, useState } from 'react';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { situacion, suscripcionActual } from '../lib/soportePush.js';
import css from './TarjetaActivarAvisos.module.css';

const CLAVE = 'mostry:avisos-tarjeta-oculta';
const oculta = () => {
  try {
    return localStorage.getItem(CLAVE) === '1';
  } catch {
    return false;
  }
};

// Inicio del panel: invita a activar los avisos en este teléfono, una vez.
// Se puede cerrar y no vuelve en este navegador.
export function TarjetaActivarAvisos() {
  const [ver, setVer] = useState(false);
  useEffect(() => {
    if (oculta() || !['disponible', 'ios_sin_instalar'].includes(situacion())) return;
    suscripcionActual().then(
      (s) => setVer(!s),
      () => setVer(true),
    );
  }, []);
  if (!ver) return null;
  function cerrar() {
    try {
      localStorage.setItem(CLAVE, '1');
    } catch {
      /* sin almacenamiento: se cierra solo por ahora */
    }
    setVer(false);
  }
  return (
    <Tarjeta className={css.tarjeta}>
      <Icono nombre="notifications_active" tamano={28} className={css.icono} />
      <div className={css.textos}>
        <p className={css.titulo}>Enterate de cada pedido al toque</p>
        <p className={css.texto}>
          Activá los avisos en tu celular: te llegan aunque cierres la compu.
        </p>
        <Boton tamano="sm" to="/panel/avisos" iconoFin="arrow_forward">
          Activar avisos
        </Boton>
      </div>
      <BotonIcono icono="close" etiqueta="No mostrar más" onClick={cerrar} />
    </Tarjeta>
  );
}
