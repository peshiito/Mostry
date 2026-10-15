import { Aviso } from '../../shared/ui/Aviso.jsx';
import { Chips } from '../../shared/ui/Chips.jsx';
import { OpcionTarjeta } from '../../shared/ui/OpcionTarjeta.jsx';
import { FormaStock } from '../productos/components/FormaStock.jsx';
import { MODULOS, RUBROS } from './opciones.js';
import css from './Empezar.module.css';

// Las tres preguntas, como piezas: el paso a paso del inicio y "Qué uso de
// Mostry" (en Más) usan las mismas.
export function SeccionModulos({ p }) {
  return (
    <div className={css.lista}>
      <Aviso tipo="info" titulo="La caja y tus productos siempre están">
        Efectivo, transferencias y lo que vendés: es la base de Mostry.
      </Aviso>
      {MODULOS.filter((m) => m.clave !== 'usaEncargos' || p.perfil.vendeOnline).map(
        (m) => (
          <OpcionTarjeta
            key={m.clave}
            multiple
            nombre={m.clave}
            valor={m.clave}
            elegido={p.perfil[m.clave]}
            onElegir={(v) => p.cambiar(m.clave, v)}
            titulo={m.titulo}
            detalle={m.detalle}
          />
        ),
      )}
    </div>
  );
}

export function SeccionRubro({ p }) {
  return (
    <div className={css.lista}>
      <Chips
        etiqueta="Rubro"
        opciones={RUBROS}
        valor={p.perfil.rubro}
        onCambio={p.elegirRubro}
      />
      <p className={css.ayuda}>Según tu rubro te sugerimos cómo manejar el stock.</p>
    </div>
  );
}

export function SeccionStock({ p }) {
  return (
    <div className={css.lista}>
      <FormaStock
        nombre="modoStockTienda"
        valor={p.perfil.modoStock}
        onCambio={(v) => p.cambiar('modoStock', v)}
      />
      <p className={css.ayuda}>Después lo podés cambiar en cada producto.</p>
    </div>
  );
}
