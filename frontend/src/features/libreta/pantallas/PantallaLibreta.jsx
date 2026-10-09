import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { useState } from 'react';
import { plural } from '../../../shared/lib/texto.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Buscador } from '../../../shared/ui/Buscador.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { ListaClientes } from '../components/ListaClientes.jsx';
import { HojaCliente } from '../components/HojaCliente.jsx';
import { PestanasLibreta } from '../components/PestanasLibreta.jsx';
import { useLibreta } from '../hooks/useLibreta.js';

// Libreta de fiados (Stitch 42).
export function PantallaLibreta() {
  const { clientes, totalDeuda, conDeuda, crear, errorCarga, recargar } = useLibreta();
  const [abierta, setAbierta] = useState(false);
  const [q, setQ] = useState('');
  const visibles = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(q.toLowerCase()),
  );
  if (errorCarga) return <ErrorCarga que="la libreta" onReintentar={recargar} />;
  return (
    <Pagina>
      <TituloPagina migas="Negocio" titulo="Libreta" />
      <PestanasLibreta />
      {clientes.length ? (
        <>
          <Tarjeta>
            <p>Te deben</p>
            <Monto centavos={totalDeuda} tamano="xl" tono="ladrillo" />
            <p>entre {plural(conDeuda, 'cliente', 'clientes')}</p>
          </Tarjeta>
          <Buscador valor={q} onCambio={setQ} placeholder="Buscar cliente" />
          <ListaClientes clientes={visibles} />
        </>
      ) : (
        <Estado icono="menu_book" titulo="Anotá acá lo que te deben">
          Cada cliente con su cuenta. El saldo se calcula solo.
        </Estado>
      )}
      <Boton
        variante="principal"
        tamano="lg"
        icono="add"
        anchoCompleto
        onClick={() => setAbierta(true)}
      >
        Agregar cliente
      </Boton>
      <HojaCliente abierta={abierta} onCerrar={() => setAbierta(false)} accion={crear} />
    </Pagina>
  );
}
