import { useState } from 'react';
import { plata } from '../../../shared/lib/plata.js';
import { Avatar } from '../../../shared/ui/Avatar.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Fila } from '../../../shared/ui/Fila.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { HojaProveedor } from '../components/HojaProveedor.jsx';
import { useGastos } from '../hooks/useGastos.js';

// Proveedores con lo comprado en el mes (Stitch 40).
export function PantallaProveedores() {
  const { proveedores, crearProveedor } = useGastos();
  const [abierta, setAbierta] = useState(false);
  return (
    <Pagina>
      <TituloPagina migas="Gastos" titulo="Proveedores" />
      <Boton
        variante="principal"
        tamano="lg"
        icono="add"
        anchoCompleto
        onClick={() => setAbierta(true)}
      >
        Agregar proveedor
      </Boton>
      {proveedores.length ? (
        <Lista>
          {proveedores.map((p) => (
            <Fila
              key={p.id}
              inicio={<Avatar nombre={p.nombre} />}
              titulo={p.nombre}
              detalle={`${p.contacto ?? 'Sin contacto'} · este mes ${plata(p.delMes)}`}
            />
          ))}
        </Lista>
      ) : (
        <Estado icono="local_shipping" titulo="Todavía no cargaste proveedores" />
      )}
      <HojaProveedor
        abierta={abierta}
        onCerrar={() => setAbierta(false)}
        accion={crearProveedor}
      />
    </Pagina>
  );
}
