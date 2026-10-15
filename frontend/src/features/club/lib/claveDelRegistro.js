// La clave recién elegida pasa del registro a la verificación solo en memoria
// (nunca en el historial ni en el almacenamiento del navegador). Se olvida al
// verificar. Leerla no la borra: React puede montar la pantalla dos veces.
let clave = '';

export const guardarClaveDelRegistro = (valor) => {
  clave = valor;
};

export const claveDelRegistro = () => clave;

export const olvidarClaveDelRegistro = () => {
  clave = '';
};
