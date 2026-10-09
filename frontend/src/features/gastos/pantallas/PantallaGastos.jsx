import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { useState } from 'react';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Chips } from '../../../shared/ui/Chips.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { FilaGasto } from '../components/FilaGasto.jsx';
import { ResumenGastos } from '../components/ResumenGastos.jsx';
import { useGastos } from '../hooks/useGastos.js';

const FILTROS = [
  { valor: 'todos', texto: 'Todos' },
  { valor: 'gasto', texto: 'Gastos' },
  { valor: 'inversion', texto: 'Inversiones' },
];

// Gastos del mes (Stitch 38).
export function PantallaGastos() {
  const { gastos, total, cargando, errorCarga, recargar } = useGastos();
  const [filtro, setFiltro] = useState('todos');
  const visibles = gastos.filter((g) => filtro === 'todos' || g.tipo === filtro);
  if (errorCarga) return <ErrorCarga que="tus gastos" onReintentar={recargar} />;
  return (
    <Pagina>
      <TituloPagina
        migas="Negocio"
        titulo="Gastos"
        accion={
          <Boton tamano="sm" to="/panel/proveedores">
            Proveedores
          </Boton>
        }
      />
      <ResumenGastos
        total={total()}
        gastos={total('gasto')}
        inversiones={total('inversion')}
      />
      <Boton
        variante="principal"
        tamano="lg"
        icono="add"
        anchoCompleto
        to="/panel/gastos/nuevo"
      >
        Cargar gasto
      </Boton>
      <Chips
        etiqueta="Tipo de gasto"
        opciones={FILTROS}
        valor={filtro}
        onCambio={setFiltro}
      />
      {cargando ? <Esqueleto filas={3} /> : null}
      {!cargando && !visibles.length ? (
        <Estado icono="payments" titulo="Sin gastos este mes" />
      ) : null}
      <Lista>
        {visibles.map((g) => (
          <FilaGasto key={g.id} gasto={g} />
        ))}
      </Lista>
    </Pagina>
  );
}
