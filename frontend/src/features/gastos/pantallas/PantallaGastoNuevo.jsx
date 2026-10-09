import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { aCentavos } from '../../../shared/lib/plata.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { FormGasto } from '../components/FormGasto.jsx';
import { useGastos } from '../hooks/useGastos.js';

// Cargar gasto (Stitch 39). Si es efectivo, sale de la caja de hoy (genera egreso).
export function PantallaGastoNuevo() {
  const { proveedores, crearGasto, errorCarga, recargar } = useGastos();
  const navegar = useNavigate();
  const [g, setG] = useState({
    tipo: 'gasto',
    monto: '',
    medio: 'efectivo',
    proveedorId: '',
    detalle: '',
  });
  const [errores, setErrores] = useState({});
  async function guardar(e) {
    e.preventDefault();
    const err = {};
    if (!aCentavos(g.monto)) err.monto = 'Escribí el monto.';
    if (g.detalle.trim().length < 2) err.detalle = 'Contá en qué se gastó.';
    setErrores(err);
    if (Object.keys(err).length) return;
    if ((await crearGasto.ejecutar(g)).ok) navegar('/panel/gastos');
  }
  if (errorCarga) return <ErrorCarga que="tus proveedores" onReintentar={recargar} />;
  return (
    <Pagina as="form" onSubmit={guardar} noValidate>
      <TituloPagina migas="Gastos" titulo="Cargar gasto" />
      <AvisoError error={crearGasto.error} />
      <Tarjeta>
        <FormGasto g={g} errores={errores} proveedores={proveedores} onCambio={setG} />
      </Tarjeta>
      {g.medio === 'efectivo' ? (
        <Aviso tipo="alerta">
          Si es efectivo, sale de la caja de hoy (tiene que estar abierta).
        </Aviso>
      ) : null}
      <Boton
        type="submit"
        variante="principal"
        tamano="lg"
        anchoCompleto
        cargando={crearGasto.enviando}
      >
        Guardar gasto
      </Boton>
    </Pagina>
  );
}
