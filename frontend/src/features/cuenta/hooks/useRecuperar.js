import { useState } from 'react';
import { useAccion } from '../../../shared/api/useAccion.js';
import { cuentaApi } from '../api/cuenta.js';

// Recuperar la clave: email → código que llega por email → clave nueva.
// La API valida el código junto con la clave nueva (POST /auth/recuperar/confirmar).
export function useRecuperar() {
  const [paso, setPaso] = useState(1);
  const [d, setD] = useState({ email: '', codigo: '', claveNueva: '' });
  const pedir = useAccion(cuentaApi.pedirRecuperacion);
  const confirmar = useAccion(cuentaApi.confirmarRecuperacion, {
    exito: 'Listo, ya tenés tu contraseña nueva',
  });
  async function seguir(valor) {
    const campo = ['email', 'codigo', 'claveNueva'][paso - 1];
    const nuevo = { ...d, [campo]: valor };
    setD(nuevo);
    if (paso === 1 && !(await pedir.ejecutar(valor)).ok) return;
    if (paso === 3 && !(await confirmar.ejecutar(nuevo)).ok) return;
    setPaso(paso + 1);
  }
  const reiniciar = () => (setPaso(1), confirmar.limpiar());
  return {
    paso,
    seguir,
    reiniciar,
    error: pedir.error ?? confirmar.error,
    enviando: pedir.enviando || confirmar.enviando,
  };
}
