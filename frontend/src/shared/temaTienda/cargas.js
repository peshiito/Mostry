// Descarga de cada tipografía (import diferido: Vite arma un archivo por fuente).
// Rubik y Work Sans ya vienen en main.jsx, por eso no están.
export const CARGAS = {
  vollkorn: () => import('@fontsource-variable/vollkorn'),
  fraunces: () => import('@fontsource-variable/fraunces'),
  'young-serif': () => import('@fontsource/young-serif'),
  playfair: () => import('@fontsource-variable/playfair-display'),
  bodoni: () => import('@fontsource-variable/bodoni-moda'),
  lora: () => import('@fontsource-variable/lora'),
  bebas: () => import('@fontsource/bebas-neue'),
  anton: () => import('@fontsource/anton'),
  oswald: () => import('@fontsource-variable/oswald'),
  marker: () => import('@fontsource/permanent-marker'),
  spray: () => import('@fontsource/rubik-spray-paint'),
  sedgwick: () => import('@fontsource/sedgwick-ave-display'),
  patrick: () => import('@fontsource/patrick-hand'),
  caveat: () => import('@fontsource-variable/caveat'),
  pacifico: () => import('@fontsource/pacifico'),
  fredoka: () => import('@fontsource-variable/fredoka'),
  baloo: () => import('@fontsource-variable/baloo-2'),
  bricolage: () => import('@fontsource-variable/bricolage-grotesque'),
  syne: () => import('@fontsource-variable/syne'),
  'space-grotesk': () => import('@fontsource-variable/space-grotesk'),
  'nunito-sans': () => import('@fontsource-variable/nunito-sans'),
  nunito: () => import('@fontsource-variable/nunito'),
  inter: () => import('@fontsource-variable/inter'),
  archivo: () => import('@fontsource-variable/archivo'),
  'dm-sans': () => import('@fontsource-variable/dm-sans'),
  'instrument-serif': () =>
    Promise.all([
      import('@fontsource/instrument-serif'),
      import('@fontsource/instrument-serif/400-italic.css'),
    ]),
  cormorant: () => import('@fontsource-variable/cormorant-garamond'),
  'dm-serif': () => import('@fontsource/dm-serif-display'),
  'inter-tight': () => import('@fontsource-variable/inter-tight'),
  familjen: () => import('@fontsource-variable/familjen-grotesk'),
  'instrument-sans': () => import('@fontsource-variable/instrument-sans'),
  'plex-mono': () =>
    Promise.all([
      import('@fontsource/ibm-plex-mono'),
      import('@fontsource/ibm-plex-mono/500.css'),
    ]),
  'big-shoulders': () => import('@fontsource-variable/big-shoulders-display'),
  'barlow-condensed': () =>
    Promise.all([
      import('@fontsource/barlow-condensed/500.css'),
      import('@fontsource/barlow-condensed/700.css'),
    ]),
  shrikhand: () => import('@fontsource/shrikhand'),
};
