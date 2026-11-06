// Foto de portada con un velo oscuro encima: el texto blanco se lee sobre
// cualquier foto. La URL la arma el backend (bucket público), igual se escapa.
export function fondoPortada(url) {
  if (!url) return undefined;
  const segura = encodeURI(url).replace(
    /["()]/g,
    (c) => `%${c.charCodeAt(0).toString(16)}`,
  );
  return {
    backgroundImage: `linear-gradient(rgb(0 0 0 / 0.55), rgb(0 0 0 / 0.65)), url("${segura}")`,
    '--sobre-verde': '#ffffff',
    '--sobre-verde-2': 'rgb(255 255 255 / 0.88)',
  };
}
