# Estilos de la vidriera (rediseño del 2026-11-06)

Pedro vio la primera tanda, hecha con Stitch, y dijo que se veía fea y "hecha por IA". Los estilos se rehicieron a partir de capturas en celular de tiendas reales de cada rubro.

## Qué se aprendió de las tiendas reales

- **Las marcas urbanas buenas no usan grafiti ni neón.** Stüssy, Noah y Carhartt WIP usan:
  - fondo blanco o negro;
  - fotos enormes;
  - letra grotesca chica y en mayúscula para todo lo secundario;
  - cero sombras.
- **Lo "hecho por IA" eran los adornos:** sombras duras, stickers torcidos, cintas que corren, colores saturados y patrones de fondo en todo. Ahora cada estilo tiene **una sola firma** y el resto queda quieto.
- **Las heladerías lindas** (Van Leeuwen, Salt & Straw) son la excepción con personalidad: bloques pastel, líneas gruesas color chocolate y una letra retro.
- **Panadería y café** (Tartine) usan papel, una serif cálida y una letra de máquina de escribir para lo chico.
- **El almacén alegre** (Pop Up Grocer) usa crema, azul cobalto y amarillo, con el toldo como guiño.

## Los 11 estilos

| Clave | Nombre | Rubro | Firma |
|---|---|---|---|
| `street` | Street | Ropa urbana | Nombre gigante en Big Shoulders, todo lo demás chico y en mayúscula, fotos sobre gris, acento naranja señal |
| `boutique` | Boutique | Ropa con estilo | Cormorant fina y grande, filetes de 1 px, mucho aire |
| `atelier` | Atelier | Emprendimientos de ropa, tejido y diseño | Instrument Serif itálica, títulos "subrayados" con una franja pastel |
| `horno` | Horno | Panadería | Toldo color corteza, DM Serif, precio en una etiqueta color miel |
| `cocina` | Cocina | Rotisería y viandas | El catálogo se lee como una carta: renglones con foto chica y puntos entre platos |
| `cafe` | Café | Cafeterías | Fraunces itálica y IBM Plex Mono para lo chico, tarjetas con un filete arriba |
| `kiosco` | Despensa | Almacén | Toldo azul cobalto, Barlow Condensed en mayúscula, precio en cartel amarillo |
| `dulce` | Heladería | Helado y golosinas | Shrikhand, líneas chocolate de 2 px, tarjetas pastel alternadas, botón con sombra dura |
| `huerta` | Huerta | Verdulería y natural | Familjen Grotesk en mayúscula, verde profundo, sin adornos |
| `cuaderno` | Cuaderno | Librería y papelería | Serif itálica azul tinta y un trazo de lápiz rojo debajo de cada título |
| `bodega` | Bodega | Vinos y bebidas | Fondo casi negro, Bodoni, filetes pergamino, acento vino |

La clave `calle` vieja se lee como `street` (`temaEfectivo`).

## Modo oscuro

La portada tiene su propio relleno (`--portada-fondo`, `shared/temaTienda/portada.js`). En modo oscuro, un tema claro **hunde** su color hacia el fondo en vez de aclararlo a pastel. Los links siguen usando `--verde`, aclarado hasta 4.5:1.

## Editor

- **Vista previa real** (`features/disenoTienda/vista/`): son los mismos componentes de la vidriera, con los datos públicos de la tienda, dentro de un celular achicado con `zoom`. Es `inert`: solo se mira, no se toca.
- **Cartas de estilo:** muestran el nombre con su letra, los colores y el rubro.
- **Tipografías:** cada una se ve escrita con su propia letra (`ListaFuentes`). Se descargan recién al abrir la lista.
