import { Interruptor } from '../../../shared/ui/Interruptor.jsx';
import { Opcion } from './campos.jsx';
import { BotonesDeTarjeta } from './BotonesDeTarjeta.jsx';
import css from './Formularios.module.css';

const COMPRA = [
  ['tienda', 'Arman el pedido acá'],
  ['whatsapp', 'Te consultan por WhatsApp'],
];

// Sin carrito, el botón "Agregar" de las tarjetas pasa a ser "Consultar".
const cambioDeCompra = (ajustes, carrito) => {
  if (carrito) return { carrito };
  const botones = [
    ...new Set(ajustes.tarjeta.botones.map((b) => (b === 'agregar' ? 'whatsapp' : b))),
  ];
  return { carrito, tarjeta: { ...ajustes.tarjeta, botones } };
};

// Ajustes de toda la página: cómo compran, el buscador y la tarjeta de producto.
export function FormAjustes({ ajustes, cambiar, ctx }) {
  const conWhatsapp = Boolean(ctx.tienda.whatsapp);
  return (
    <div className={css.form}>
      <Opcion
        etiqueta="Cómo te compran"
        opciones={conWhatsapp ? COMPRA : COMPRA.slice(0, 1)}
        valor={ajustes.carrito ? 'tienda' : 'whatsapp'}
        onCambio={(v) => cambiar(cambioDeCompra(ajustes, v === 'tienda'))}
      />
      <p className={css.nota}>
        {conWhatsapp
          ? 'Con WhatsApp, cada producto dice "Consultar" y no hay carrito ni pago por acá.'
          : 'Para vender por WhatsApp, cargá tu número en Más → Datos de la tienda.'}
      </p>
      <Interruptor
        etiqueta="Buscador en la barra"
        activo={ajustes.buscador}
        onCambio={(buscador) => cambiar({ buscador })}
      />
      <BotonesDeTarjeta ajustes={ajustes} cambiar={cambiar} />
      <Interruptor
        etiqueta="Mostrar la categoría en cada producto"
        activo={ajustes.tarjeta.categoria}
        onCambio={(categoria) => cambiar({ tarjeta: { ...ajustes.tarjeta, categoria } })}
      />
    </div>
  );
}
