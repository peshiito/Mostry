import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { Chips } from '../../../shared/ui/Chips.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { plata } from '../../../shared/lib/plata.js';
import { textoPremio } from '../../club/lib/textoPremio.js';
import css from './Socio.module.css';

const textoSellos = (n) => (n === 1 ? '1 sello' : `${n} sellos`);

// El cliente del club ya identificado: sus sellos y, si le alcanzan, los
// premios que puede usar en esta venta (el descuento lo confirma el servidor).
export function SocioElegido({ v }) {
  const usables = v.socio.premios.filter((p) => p.disponible);
  const opciones = [
    { valor: 0, texto: 'Sigue juntando' },
    ...usables.map((p) => ({ valor: p.compras, texto: textoPremio(p) })),
  ];
  return (
    <div className={css.socio}>
      <div className={css.fila}>
        <Icono nombre="loyalty" />
        <span className={css.textos}>
          <span className={css.nombre}>{v.socio.nombre}</span>
          <span className={css.detalle}>
            {textoSellos(v.socio.sellos)} ·{' '}
            {v.socio.compraMinima
              ? `suma uno si la compra llega a ${plata(v.socio.compraMinima)}`
              : 'esta compra le suma uno'}
          </span>
        </span>
        <BotonIcono
          icono="close"
          etiqueta="Quitar al cliente"
          onClick={() => v.setSocio(null)}
        />
      </div>
      {usables.length ? (
        <Chips
          etiqueta="Usar un premio"
          opciones={opciones}
          valor={v.premio?.compras ?? 0}
          onCambio={(n) => v.setPremio(n || null)}
        />
      ) : null}
      {v.premio ? (
        <p className={css.detalle}>
          {v.descuento
            ? `Descuenta ${plata(v.descuento)} del total.`
            : `Entregale: ${v.premio.descripcion}.`}{' '}
          Al cobrar, sus sellos vuelven a 0.
        </p>
      ) : null}
    </div>
  );
}
