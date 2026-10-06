import { DOMINIO_BASE, ZONA_ACTUAL } from '../../shared/lib/zonaActual.js';
import { SelectorTema } from '../../shared/tema/SelectorTema.jsx';
import { CopiarDato } from '../../shared/ui/CopiarDato.jsx';
import { Fila } from '../../shared/ui/Fila.jsx';
import { Icono } from '../../shared/ui/Icono.jsx';
import { Lista } from '../../shared/ui/Lista.jsx';
import { Pagina } from '../../shared/ui/Pagina.jsx';
import { Seccion } from '../../shared/ui/Seccion.jsx';
import { TituloPagina } from '../../shared/ui/TituloPagina.jsx';

const GRUPOS = [
  [
    'Negocio',
    [
      ['Encargos', 'cake', 'encargos'],
      ['Libreta', 'menu_book', 'libreta'],
      ['Gastos', 'payments', 'gastos'],
      ['Proveedores', 'local_shipping', 'proveedores'],
      ['Promociones', 'sell', 'promociones'],
    ],
  ],
  [
    'Mi tienda',
    [
      ['Datos y apariencia', 'storefront', 'tienda'],
      ['Horarios', 'schedule', 'horarios'],
      ['Cobros y envíos', 'account_balance', 'cobros'],
    ],
  ],
  [
    'Cuenta',
    [
      ['Suscripción', 'receipt_long', 'suscripcion'],
      ['Mi cuenta', 'person', 'cuenta'],
    ],
  ],
];

// Menú "Más" del panel (Stitch 29).
export function PantallaMas() {
  return (
    <Pagina>
      <TituloPagina titulo="Más" />
      <CopiarDato etiqueta="Tu tienda" valor={`${ZONA_ACTUAL.slug}.${DOMINIO_BASE}`} />
      {GRUPOS.map(([titulo, items]) => (
        <Seccion key={titulo} titulo={titulo}>
          <Lista>
            {items.map(([texto, icono, ruta]) => (
              <Fila
                key={ruta}
                to={`/panel/${ruta}`}
                inicio={<Icono nombre={icono} />}
                titulo={texto}
                flecha
              />
            ))}
          </Lista>
        </Seccion>
      ))}
      <Seccion titulo="Apariencia">
        <SelectorTema />
      </Seccion>
    </Pagina>
  );
}
