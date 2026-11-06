// De los ids de imágenes que guardó la página a sus urls (las que ya no están en
// la biblioteca se saltean). `tienda.medios` viene de la vidriera o del editor.
export const urlsDeMedios = (tienda, ids = [], chica = false) =>
  ids
    .map((id) => tienda.medios?.find((m) => m.id === id))
    .filter(Boolean)
    .map((m) => (chica ? m.urlChica : m.url));
