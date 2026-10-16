import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './Avisos.module.css';

// Qué hacer cuando este teléfono todavía no puede recibir avisos. Primero lo
// que el comerciante puede resolver en su teléfono; al final, lo de Mostry.
export function AyudaAvisos({ situacion, configurado }) {
  if (situacion === 'ios_sin_instalar')
    return (
      <Aviso titulo="En iPhone, primero instalá el panel">
        <ol className={css.pasos}>
          <li>
            Tocá <Icono nombre="ios_share" tamano={18} /> Compartir, abajo en Safari.
          </li>
          <li>
            Elegí <Icono nombre="add_box" tamano={18} /> «Agregar a inicio».
          </li>
          <li>Abrí Mostry desde el ícono nuevo y volvé a esta pantalla.</li>
        </ol>
      </Aviso>
    );
  if (situacion === 'bloqueado')
    return (
      <Aviso tipo="alerta" titulo="Los avisos están bloqueados en este navegador">
        Tocá el candado de la barra de direcciones → Permisos → Notificaciones → Permitir.
        Después recargá la página.
      </Aviso>
    );
  if (situacion === 'sin_soporte')
    return (
      <Aviso tipo="alerta" titulo="Este navegador no recibe avisos">
        Abrí el panel con Chrome en Android, o instalalo en tu iPhone.
      </Aviso>
    );
  if (configurado === false)
    return (
      <Aviso tipo="alerta" titulo="Los avisos todavía no están listos en Mostry">
        Avisanos y lo prendemos.
      </Aviso>
    );
  return null;
}
