import { useState } from 'react';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { HojaCambiarAlias } from './HojaCambiarAlias.jsx';
import css from './AliasCobro.module.css';

// Alias y titular protegidos: cambiarlos pide la contraseña de nuevo.
export function AliasCobro({ alias, titular, accion }) {
  const [confirmando, setConfirmando] = useState(false);
  return (
    <Tarjeta className={css.alias}>
      <div className={css.dato}>
        <span className={css.etiqueta}>Alias de cobro</span>
        <span className={css.valor}>{alias}</span>
        <span className={css.etiqueta}>Titular: {titular}</span>
      </div>
      <p className={css.nota}>
        <Icono nombre="lock" tamano={16} /> Cambiarlo pide el código de tu app.
      </p>
      <Boton icono="edit" onClick={() => setConfirmando(true)}>
        Cambiar alias
      </Boton>
      {confirmando ? (
        <HojaCambiarAlias
          abierta
          onCerrar={() => setConfirmando(false)}
          actual={{ alias, titularAlias: titular }}
          accion={accion}
        />
      ) : null}
    </Tarjeta>
  );
}
