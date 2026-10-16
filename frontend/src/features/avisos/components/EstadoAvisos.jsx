import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { esCompu } from '../lib/soportePush.js';
import css from './Avisos.module.css';

// Si los avisos llegan a ESTE teléfono, con el único botón coral de la pantalla.
export function EstadoAvisos({ a }) {
  const { activo, activar, desactivar, probar, consulta } = a;
  const listo = consulta.datos?.configurado && a.situacion === 'disponible';
  return (
    <Tarjeta className={css.estado}>
      <span className={activo ? css.iconoActivo : css.icono}>
        <Icono
          nombre={activo ? 'notifications_active' : 'notifications_off'}
          tamano={32}
        />
      </span>
      <p className={css.titulo}>
        {activo ? 'Los avisos llegan a este teléfono' : 'Los avisos están apagados acá'}
      </p>
      <p className={css.texto}>
        Activalo en tu <strong>celular</strong>: aunque cierres la compu, te llega cada
        pedido.
      </p>
      {esCompu() ? (
        <Aviso>
          En esta compu solo te llega con el navegador abierto. Activalo también en tu
          celular.
        </Aviso>
      ) : null}
      {activo ? (
        <>
          <Boton
            anchoCompleto
            icono="notifications"
            cargando={probar.enviando}
            onClick={() => probar.ejecutar()}
          >
            Mandar un aviso de prueba
          </Boton>
          <Boton
            variante="texto"
            cargando={desactivar.enviando}
            onClick={() => desactivar.ejecutar()}
          >
            Apagar en este teléfono
          </Boton>
        </>
      ) : (
        <Boton
          variante="principal"
          tamano="lg"
          anchoCompleto
          disabled={!listo}
          cargando={activar.enviando}
          textoCargando="Activando…"
          onClick={() => activar.ejecutar()}
        >
          Activar avisos en este teléfono
        </Boton>
      )}
    </Tarjeta>
  );
}
