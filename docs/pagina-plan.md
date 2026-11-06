# "Armá tu página": editor libre de la vidriera

## Contexto
Hoy cada tienda elige un estilo (colores, letras, forma) y ordena unas secciones fijas. La estructura de web ya quedó linda (barra, hero, beneficios, tarjetas, promo, cierre y pie, commit `e44eb59`).

Pedro quiere ir más allá: que cada comercio **arme su página como quiera**. La idea es arrancar de una plantilla o de cero, y agregar, arrastrar y sacar bloques:
- portada con foto fija, carrusel o GIF que gira, con la duración que elija;
- carruseles de productos;
- tarjetas con los botones que quiera;
- reseñas con estrellas;
- carrito sí o no.

Tiene que ser **producto final y escalable**, no un boceto, y verse siempre lindo en el celu y en la compu.

**Decisiones de Pedro (2026-11-06):**
- **Bloques + grilla libre:** no es un lienzo x/y.
- **Reseñas solo de compradores reales,** moderadas por el comercio.
- **Movimiento:** fotos, carrusel y GIF, sin video.
- **Editor en el celu y en la compu.**
- **Sin carrito:** "Consultar por WhatsApp".
- **Nombre:** "Armá tu página". "Diseño de tu tienda" sigue siendo para colores, letras y estilo.

**Reglas que siguen:**
- 70 líneas por archivo.
- Aislamiento por `tienda_id`: toda tabla nueva va en `TABLAS_DE_TIENDA`, en el barrido de huérfanos y en el borrado de la tienda.
- Zod estricto.
- Nada de HTML ni SVG subido.
- Contraste ≥ 4.5 (lo siguen garantizando los tokens del tema).
- Suites en verde, commit y push por etapa, y capturas por el chat.

## Arquitectura
**La página es un documento JSON de bloques**, validado igual en los dos lados:

```
{ version: 1,
  ajustes: { carrito: true, buscador: true, tarjeta: { botones: ['agregar'], categoria: true, estrellas: true } },
  bloques: [ { id, tipo: 'hero', visible, datos: {...} }, ... ] }   // máx. 40 bloques, 64 KB
```

- **Backend:** una unión discriminada de Zod por `tipo`, con objetos estrictos y textos con largo máximo.
  - **Links:** solo rutas internas (`/catalogo`, `/producto/:id`, `#seccion`), WhatsApp de la tienda, o https a la lista de dominios conocidos que ya usamos en Redes.
  - **Fotos:** se referencian por id del medio de la tienda, nunca por URL suelta.
- **Frontend:** un **registro de bloques** (`features/pagina/bloques/registro.js`): tipo → componente (carga diferida), formulario de edición, valores por defecto, ícono y nombre.
  - La vidriera pública lo recorre y pinta cada bloque.
  - El editor usa el mismo registro, así lo que se ve en el editor es exactamente lo publicado.
  - Los estilos (`estilos/*.css`, `data-v`) siguen vistiendo todo.
- **Borrador y publicado:** el editor guarda el borrador solo, cada pocos segundos. Recién "Publicar" lo pasa a público. Hay versiones para volver atrás.
- **Compatibilidad:** sin documento, la página pública se arma con `plantillaDesdeTienda(tienda)`, que traduce el inicio de hoy (secciones y orden) a bloques. Ninguna tienda cambia de golpe.

### Biblioteca de bloques
| Grupo | Bloques |
|---|---|
| Portada | **Hero**: foto fija, **carrusel** (2 a 6 fotos, duración de 2 a 10 s, fundido o deslizado) o **GIF**; posición del texto, oscurecido, 0 a 2 botones |
| Productos | **Carrusel de productos**: elegidos a mano, destacados, una categoría o más vendidos, con avance automático opcional · **Grilla de productos** · **Producto destacado** grande |
| Colecciones | **Categorías** en círculos o en tarjetas con foto y descripción (como el "Men / Women / Kids") |
| Libre | **Grilla libre**: tarjetas propias (foto, título, texto, 0 a 2 botones) en una cuadrícula de 12 columnas con ancho y alto a elección; en el celu se apilan en orden |
| Confianza | **Reseñas** (promedio con estrellas y las elegidas) · **Beneficios** (los automáticos o editados) |
| Contenido | **Banner** (imagen, texto y botón; normal o dividido) · **Texto** · **Galería / mosaico** · **Sobre nosotros** |
| Contacto | **Cierre WhatsApp** · **Horarios y mapa** · **Redes** · **Club** · **Separador** |

**Ajustes globales:**
- carrito sí o no (sin carrito, cada producto dice "Consultar por WhatsApp" con el mensaje armado y se esconden carrito y checkout);
- buscador;
- botones de la tarjeta de producto: Agregar, Ver o WhatsApp;
- mostrar categoría y estrellas;
- menú de la barra.

## Etapas (cada una es usable, con commit, push y capturas)
- **P1 · Documento y render:**
  - **Backend:**
    - migración: `paginas_tienda` (`tienda_id` PK/FK, `borrador` y `publicado` en JSON, `version`, `actualizado_en`) y `versiones_pagina` (las últimas 10);
    - esquema Zod de bloques;
    - rutas `GET/PUT /panel/tienda/pagina/borrador`, `POST …/publicar`, `GET …/versiones` y `POST …/versiones/:id/restaurar`;
    - el público recibe `pagina` en `/publico/tienda`.
  - **Frontend:**
    - `features/pagina/` con el registro, `RenderPagina`, `plantillaDesdeTienda`, y los bloques que ya existen (hero, categorías, carrusel y grilla, promo como banner, sobre nosotros, galería, beneficios, cierre, club, horarios), pasados a bloques;
    - `PantallaInicio` pasa a ser `RenderPagina`.
  - **Tests:** el esquema (links maliciosos, tamaños, tipos desconocidos), el aislamiento y que la página por defecto sea igual a la de hoy.
- **P2 · Editor "Armá tu página":**
  - **En el celu:**
    - lista de bloques con manija para arrastrar (dnd-kit, solo en el panel);
    - agregar desde la biblioteca, que es una hoja con miniaturas;
    - tocar un bloque abre su formulario;
    - ocultar, duplicar y borrar;
    - vista previa real (la de `disenoTienda/vista`), en celu o compu.
  - **En la compu:** tres paneles (bloques, vista previa, ajustes); clic en la vista previa selecciona el bloque.
  - **Además:** deshacer y rehacer, guardado automático del borrador, "Publicar" y "Versiones".
- **P3 · Medios y movimiento:**
  - **Tabla:** `medios_tienda` (clave, tipo foto o animado, ancho, alto, bytes; tope por tienda, por ejemplo 60 archivos y 150 MB).
  - **Proceso:** jpg y png a WebP de 1600 y 800 px; GIF a WebP animado con sharp (`animated: true`), hasta 8 MB y 300 cuadros, validado por magic bytes. Al subir el archivo se reprocesa entero, así nunca se publica el original.
  - **Biblioteca de medios** en el editor.
  - **Hero carrusel y GIF:** respeta `prefers-reduced-motion` (se queda quieto), se pausa al tocar y se ve accesible.
  - **Limpieza:** barrido de huérfanos y borrado de la tienda.
- **P4 · Bloques de productos y ajustes:**
  - carrusel y grilla con sus fuentes de productos, y el producto destacado;
  - la tarjeta de producto configurable;
  - el modo sin carrito (WhatsApp), que también se respeta en catálogo, ficha y rutas.
- **P5 · Grilla libre:**
  - el bloque de tarjetas propias con cuadrícula;
  - en el editor de la compu, arrastrar para mover y estirar el tamaño;
  - en el celu, ancho con pasos (1/3, 1/2, 2/3, completo) y orden con flechas o arrastrando.
- **P6 · Reseñas verificadas:**
  - **Tabla:** `resenas` (`tienda_id`, `pedido_id` UNIQUE con `producto_id`, puntaje de 1 a 5, texto ≤ 500, nombre de pila, estado `pendiente`, `aprobada` u `oculta`, fecha).
  - **Quién las deja:** el comprador puntúa desde su link de seguimiento, solo con el pedido `entregado` y una vez por producto, con límite de intentos.
  - **El comercio** las modera en Panel → Reseñas, con un aviso push.
  - **Dónde se ven:** el bloque Reseñas, las estrellas en la tarjeta y la ficha del producto (solo las aprobadas).
- **P7 · Plantillas:**
  - cada uno de los 11 estilos trae su página armada (bloques pensados para el rubro);
  - "Empezar de cero" (barra, un hero vacío y el pie);
  - "Volver a la plantilla".
- **P8 · Pulido:**
  - accesibilidad del editor (todo por teclado, también reordenar);
  - rendimiento: cada bloque baja recién cuando se usa, imágenes con `srcset`, Lighthouse en celular gama baja;
  - e2e del recorrido completo;
  - el modo soporte del admin puede ayudar a armar la página;
  - docs y CLAUDE.md.

**Después:** V2 (fuente propia), V6 (fotos y variantes de producto) y F1–F6 (finanzas), según `docs/vidriera-finanzas-plan.md`.

## Piezas que se reutilizan
- **Vista previa:** `features/disenoTienda/vista/VistaPrevia.jsx` (inert, `zoom`, tokens del tema).
- **Vidriera actual:** `features/tienda/vitrina/*`, `sitio/*` y `lib/fotoEstrella.js`, que pasan a ser componentes de bloques.
- **Contenido:** `modules/tiendas/vidriera/` (portada, galería y contenido), con sus patrones de subida (`procesarImagen`, `validarImagen`, `almacenamiento`) y los tests `vidrieraFotos` y `vidrieraContenido`.
- **Links seguros:** `shared/lib/linkSeguro.js` (`linkWhatsapp`) y la validación de redes de `esquemaContenido.ts`.
- **Borrado y aislamiento:** `tablasDeTienda.ts`, `archivosDeTienda.ts`, `worker/jobs/clavesReferenciadas.ts` y `clavesAnteriores.ts`.
- **Pedido y seguimiento:** el token de seguimiento (`pedidoPublico`) para las reseñas; los avisos push (`modules/avisos/encolar.ts`) para avisar de una reseña nueva.

## Dependencias nuevas
`@dnd-kit/core`, `@dnd-kit/sortable` y `@dnd-kit/utilities` (unos 15 KB gz). Es comportamiento accesible de arrastrar con teclado y táctil, no una librería de componentes, y se carga solo en el editor del panel. sharp ya está instalado.

## Verificación
- **Backend:** tests por etapa, con TDD.
  - El esquema rechaza: `javascript:`, dominios fuera de la lista, ids de medios de otra tienda, más de 40 bloques y tipos desconocidos.
  - Aislamiento de `paginas_tienda`, `medios_tienda` y `resenas`.
  - GIF malicioso o enorme rechazado.
  - Una reseña solo con el pedido entregado y su token.
  - Publicar y restaurar versiones.
- **Frontend:** vitest del registro, la plantilla por defecto (igual a la de hoy), el reducer del editor (mover, deshacer) y el render de cada bloque.
- **e2e:**
  - armar una página (agregar un hero carrusel, reordenar, publicar) y verla pública en celu y compu;
  - el modo sin carrito;
  - dejar y aprobar una reseña.
- **Calidad:** axe en claro y oscuro, y Lighthouse en la vidriera.
- **Suites de a una:** backend (~30 min), frontend y e2e.
- **Capturas por el chat** al cerrar cada etapa.
