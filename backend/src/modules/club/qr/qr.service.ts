import { qrRepo } from './qr.repository.js';
import {
  codigoAlAzar,
  codigoDeVentana,
  hashQr,
  MARGEN_MS,
  VENTANA_MS,
  ventanaDe,
} from './codigoQr.js';

// El QR del cliente: el código de la ventana actual de 5 minutos. Una foto vieja
// deja de servir al minuto de rotar.
export async function qrDelCliente(clienteId: number, ahora = Date.now()) {
  const ventana = ventanaDe(ahora);
  const venceEn = new Date((ventana + 1) * VENTANA_MS);
  const expiraEn = new Date(venceEn.getTime() + MARGEN_MS);
  let codigo = codigoDeVentana(clienteId, ventana);
  await qrRepo.guardar({ clienteId, hashCodigo: hashQr(codigo), expiraEn });
  // Caso rarísimo: otro cliente tiene el mismo código vigente. Va uno al azar.
  for (
    let i = 0;
    (await qrRepo.duenoDe(hashQr(codigo), new Date(ahora))) !== clienteId;
    i++
  ) {
    if (i === 5) throw new Error('No se pudo generar un código de QR libre');
    codigo = codigoAlAzar();
    await qrRepo.guardar({ clienteId, hashCodigo: hashQr(codigo), expiraEn });
  }
  // quedanMs: el celular cuenta con su reloj, aunque esté adelantado o atrasado.
  return { codigo, venceEn: venceEn.toISOString(), quedanMs: venceEn.getTime() - ahora };
}

// Quién es el dueño de un código vigente (para la venta rápida, en L3).
export async function clienteDelCodigo(codigo: string, ahora = new Date()) {
  return qrRepo.duenoDe(hashQr(codigo.trim().toUpperCase()), ahora);
}
