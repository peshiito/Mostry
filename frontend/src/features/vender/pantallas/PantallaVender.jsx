import { useState } from 'react';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Buscador } from '../../../shared/ui/Buscador.jsx';
import { Chips } from '../../../shared/ui/Chips.jsx';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { EsqueletoLista } from '../../../shared/ui/esqueletos/index.js';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { ClienteClub } from '../components/ClienteClub.jsx';
import { GrillaVender } from '../components/GrillaVender.jsx';
import { HojaSuelto } from '../components/HojaSuelto.jsx';
import { TicketVenta } from '../components/TicketVenta.jsx';
import { VendidoHoy } from '../components/VendidoHoy.jsx';
import { useProductosVender } from '../hooks/useProductosVender.js';
import { useVenta } from '../hooks/useVenta.js';

// Venta rápida en el local (Mejoras 3, parte C): tocás lo que lleva, elegís
// efectivo o transferencia y cobrás. Entra sola a la caja.
export function PantallaVender() {
  const cats = useConsulta('/panel/categorias').datos ?? [];
  const v = useVenta();
  const [texto, setTexto] = useState('');
  const [cat, setCat] = useState('todo');
  const [suelto, setSuelto] = useState(false);
  const prod = useProductosVender(texto, cat);
  if (prod.cargando) return <EsqueletoLista />;
  if (prod.error)
    return (
      <ErrorCarga error={prod.error} que="tus productos" onReintentar={prod.recargar} />
    );
  const visibles = prod.productos;
  const opciones = [
    { valor: 'todo', texto: 'Todo' },
    ...cats.map((c) => ({ valor: String(c.id), texto: c.nombre })),
  ];
  return (
    <Pagina>
      <TituloPagina
        titulo="Vender"
        bajada="Tocá lo que lleva y cobrá. La caja se arma sola."
      />
      <Buscador valor={texto} onCambio={setTexto} />
      <Chips etiqueta="Categorías" opciones={opciones} valor={cat} onCambio={setCat} />
      <GrillaVender
        key={cat}
        productos={visibles}
        lineas={v.lineas}
        onSumar={(p) => v.cambiar(p, 1)}
      />
      <Boton icono="add" onClick={() => setSuelto(true)}>
        Monto suelto
      </Boton>
      <ClienteClub v={v} />
      <TicketVenta v={v} />
      <VendidoHoy datos={v.hoy.datos} />
      <HojaSuelto
        abierta={suelto}
        onCerrar={() => setSuelto(false)}
        onAgregar={v.setSuelto}
      />
    </Pagina>
  );
}
