// Qué decir en cada tipo de error (tipoError.js): corto, en voseo y con una
// salida concreta. `reintentar` = tiene sentido ofrecer "Reintentar".
export const TEXTOS_ERROR = {
  sin_conexion: {
    icono: 'wifi_off',
    titulo: 'Se cortó la conexión',
    texto: 'Revisá tu internet y probá de nuevo.',
    reintentar: true,
  },
  servidor: {
    icono: 'running_with_errors',
    titulo: 'Algo falló de nuestro lado',
    texto: 'No es tu culpa. Probá de nuevo en un rato.',
    reintentar: true,
  },
  mantenimiento: {
    icono: 'construction',
    titulo: 'Estamos haciendo mejoras',
    texto: 'Mostry vuelve en unos minutos. Tus datos están a salvo.',
    reintentar: true,
  },
  permiso: {
    icono: 'lock',
    titulo: 'No tenés acceso a esta parte',
    texto: 'Si creés que es un error, volvé a ingresar con tu cuenta.',
    reintentar: false,
  },
  limite: {
    icono: 'hourglass_top',
    titulo: 'Hiciste muchos intentos',
    texto: 'Esperá un minuto y volvé a probar.',
    reintentar: true,
  },
  sesion: {
    icono: 'key',
    titulo: 'Tu sesión venció',
    texto: 'Ingresá de nuevo para seguir donde estabas.',
    reintentar: false,
  },
  no_existe: {
    icono: 'search_off',
    titulo: 'No encontramos lo que buscás',
    texto: 'Puede que lo hayan borrado o que el link esté mal.',
    reintentar: false,
  },
  desconocido: {
    icono: 'error',
    titulo: 'No pudimos completar la carga',
    texto: 'Probá de nuevo en un rato.',
    reintentar: true,
  },
};

export const textoError = (tipo) => TEXTOS_ERROR[tipo] ?? TEXTOS_ERROR.desconocido;
