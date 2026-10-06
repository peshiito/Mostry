import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { aCentavos } from '../../../shared/lib/plata.js';
import { panel } from '../../panelBase/panelApi.js';
import { validarAprobacion } from '../lib/validarAprobacion.js';

const VACIO = { monto: '', fecha: '', titular: '', operacion: '' };

// Comprobante pendiente del pedido: abrirlo, aprobarlo o rechazarlo (6.1).
export function useRevision(pedido) {
  const navegar = useNavigate();
  const ruta = pedido ? `/pedidos/${pedido.id}/comprobantes` : null;
  const lista = useConsulta(ruta ? `/panel${ruta}` : null);
  const comprobante = (lista.datos ?? []).find((c) => c.estado === 'pendiente') ?? null;
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const accion = useAccion(
    (sub, cuerpo) => panel.post(`${ruta}/${comprobante.id}/${sub}`, cuerpo),
    {
      exito: (_, sub) =>
        sub === 'aprobar' ? 'Pago aprobado · entró a la caja' : 'Comprobante rechazado',
    },
  );
  const volver = () => navegar(`/panel/pedidos/${pedido.id}`);
  const montoEsperado = pedido ? pedido.sena || pedido.total : 0;
  async function aprobar() {
    const e = validarAprobacion(datos, montoEsperado);
    setErrores(e);
    if (Object.keys(e).length) return;
    const cuerpo = {
      monto: aCentavos(datos.monto),
      fechaOperacion: `${datos.fecha}T12:00:00-03:00`,
      titular: datos.titular.trim(),
      numeroOperacion: datos.operacion.trim(),
    };
    if ((await accion.ejecutar('aprobar', cuerpo)).ok) volver();
  }
  async function rechazar(motivo) {
    if ((await accion.ejecutar('rechazar', { motivo })).ok) volver();
  }
  // URL firmada de 5 minutos: se pide recién al tocar "Abrir" (sección 7).
  const abrir = async () =>
    window.open(
      (await panel.get(`${ruta}/${comprobante.id}/archivo`)).url,
      '_blank',
      'noopener',
    );
  return {
    datos,
    setDatos,
    errores,
    montoEsperado,
    comprobante,
    cargando: lista.cargando,
    aprobar,
    rechazar,
    abrir,
    accion,
  };
}
