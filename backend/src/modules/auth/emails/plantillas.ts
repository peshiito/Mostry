// Textos de los emails de cuenta. Cortos, en voseo y sin links (evita phishing).
const firma = '\n\n— El equipo de Mostry';

export const plantillas = {
  verificarEmail: (codigo: string) => ({
    asunto: `${codigo} es tu código para verificar tu email`,
    texto: `¡Hola! Tu código es ${codigo}.\nVence en 10 minutos.\n\nSi no te registraste en Mostry, ignorá este mensaje.${firma}`,
  }),
  recuperarClave: (codigo: string) => ({
    asunto: `${codigo} es tu código para recuperar la contraseña`,
    texto: `Tu código es ${codigo}.\nVence en 10 minutos.\n\nSi no lo pediste vos, ignorá este mensaje: tu cuenta sigue segura.${firma}`,
  }),
  yaTenesCuenta: () => ({
    asunto: 'Ya tenés una cuenta en Mostry',
    texto: `Alguien intentó registrarse con este email, pero ya tenés una cuenta.\nSi fuiste vos, iniciá sesión desde tu tienda o recuperá tu contraseña.${firma}`,
  }),
  claveCambiada: () => ({
    asunto: 'Cambiaste tu contraseña de Mostry',
    texto: `Tu contraseña se cambió y cerramos tus otras sesiones.\nSi no fuiste vos, escribinos ya mismo.${firma}`,
  }),
};
