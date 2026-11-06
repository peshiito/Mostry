# Vidriera 2.0 y Finanzas 2.0 — antes del piloto

## Contexto
Pedro recorrió el sistema y decidió (2026-11-05, "camino A") terminar de armar Mostry **antes** de salir al piloto. La S4 (producción) espera a que esto termine. Hay dos frentes:

1. **Vidriera:**
   - **El problema:** todas las tiendas tienen el mismo diseño y lo único que cambia es una de 10 paletas. No hay portada, tipografía, fondo, redes ni "sobre nosotros". Sin fotos, la tienda se ve vacía, y la ficha muestra una sola foto aunque el backend ya guarda hasta 5.
   - **Lo que quiere Pedro:** que cada comercio la haga **suya** (una panadería casera, un grow con estética urbana o grafiti, una mamá que revende útiles escolares) y que, la personalicen como la personalicen, **siempre se vea linda**.
2. **Finanzas:**
   - **Lo que hay:** caja diaria, ventas, gastos, proveedores, fiados y una "ganancia real" sin costo de mercadería.
   - **Lo que quiere Pedro:** "todo lo que falte para que puedan mantener bien la administración de su negocio".

**Decisiones de Pedro (2026-11-05):**
- **Colores libres** con selector, más combinaciones armadas por tema. Mostry ajusta solo los tonos para que el texto siempre se lea y para el modo oscuro.
- **Tipografías:** una lista curada y, además, la opción de **subir su propia fuente**.
- **Fondos:** una biblioteca de fondos y texturas de Mostry, más su **propia foto** de portada o de fondo.
- **Productos:** varias fotos, **variantes** (talle, color, gusto, con stock propio) y **secciones del inicio a elección**.
- **Finanzas:** todo lo que falta.
- **Permiso para investigar:** puedo buscar referencias en internet y usar el MCP de Stitch para diseñar. Si el MCP falla, le paso los prompts a Pedro.

**Reglas que siguen valiendo:**
- Máximo 70 líneas por archivo.
- Aislamiento por `tienda_id`: toda tabla nueva va en `TABLAS_DE_TIENDA` y tiene su test.
- Nada de SVG ni HTML subido por usuarios.
- La plata va en centavos.
- Al terminar cada etapa: suites en verde, reporte, **commit y push**.
- **Contraste:** cada par de texto y fondo tiene que cumplir 4.5:1, ahora **verificado con tests**. Hoy no hay ninguno.

## Orden de las etapas
**D0 → V1 → V2 → V3 → V4 → V5 → V6 → F1 → F2 → F3 → F4 → F5 → F6.** Después siguen S4 (producción) → S5 (piloto) → S6.

Cada etapa termina con su reporte, un commit y el push. Si en el camino aparece una decisión nueva, se la pregunto a Pedro.

---

## D0 · Dirección de diseño (Stitch + investigación), sin código
- **Referencias por rubro:** junto ejemplos para panadería casera, grow o urbano/grafiti, escolar/infantil, ropa minimal, boutique elegante, almacén o kiosco, heladería o dulce, y natural o verdulería. De cada uno anoto tipografía, colores, fondo, forma de las tarjetas y encabezado.
- **Stitch (por MCP):** diseño **8 temas** de vidriera para celular de 390 px (inicio, catálogo y ficha), siempre con el toldo y la marca Mostry en el pie. Quedan en `docs/stitch/temas/`.
- **Entregable:**
  - `docs/temas-vidriera.md` con cada tema: fuentes, colores, fondo, plantilla y radios;
  - capturas para que Pedro **elija y corrija** antes de programar.

## V1 · Motor de temas
- **Modelo:** una columna nueva `tiendas.tema JSON` (migración), validada con un Zod estricto. La columna `paleta` queda hasta migrar: cada paleta pasa a un tema equivalente, así ninguna tienda cambia de golpe.
- **Qué guarda el tema:**
  - `plantilla`: clásica, vitrina o galería;
  - `colores`: principal, acento y fondo;
  - `fuentes`: títulos y texto;
  - `fondo`: liso, patrón o foto, con intensidad;
  - `encabezado`: toldo, portada o mínimo;
  - `forma`: recta, suave o redonda;
  - `estiloBotones`.
- **Contraste automático:** `contraste.ts`/`contraste.js` es la misma función de los dos lados, probada con tests. Calcula la luminancia y ajusta el texto o el color hasta llegar a 4.5:1, también en modo oscuro.
  - Reemplaza al `color-mix` "a ciegas" de `tokens.css` (líneas 173-188).
  - Los tokens de la tienda pasan a ser `--tienda-*` dentro de `TiendaContexto` (`features/tienda/TiendaContexto.jsx`, hoy `propsPaleta`).
- **Temas armados:** los 8 de D0, más los equivalentes de las 10 paletas actuales.
- **El panel del comercio mantiene la marca Mostry,** como hasta ahora.

## V2 · Tipografías
- **Lista curada:** unas 20 fuentes gratuitas de **@fontsource**, alojadas en Mostry (la CSP tiene `font-src 'self'`), por estilo: casera o manuscrita, elegante (serif), urbana o grafiti, escolar, moderna, retro y monoespaciada. Cada una con su licencia OFL verificada.
  - **Se carga solo la fuente de cada tienda,** con un import diferido. El precache de la PWA no las incluye, salvo Rubik y Work Sans.
- **Fuente propia:**
  - **Subida:** `PUT /panel/tienda/fuente`, en woff2, woff, ttf u otf, hasta 400 KB.
  - **Validación:** magic bytes, más un **parseo completo con `opentype.js` en el servidor** (si no se puede leer, se rechaza). Se convierte a woff2 y se le borran los metadatos.
  - **Dónde vive:** en el bucket público. La CSP agrega `font-src ${VITE_ORIGEN_ARCHIVOS}`.
  - **Licencia:** casilla obligatoria de "tengo derecho a usar esta fuente", guardada con la fecha.
  - **Límite de intentos** y borrado de la fuente vieja.
- **Ajustes automáticos:** el texto de párrafos se lee siempre con una fuente legible. Si el comercio elige una fuente de grafiti, se usa en títulos y la de texto queda separada. El tamaño mínimo es 16 px.

## V3 · Fondos, portada y encabezado
- **Biblioteca de fondos de Mostry:** unos 20 patrones hechos por nosotros como CSS o SVG **del código**, nunca subidos: cuadrillé y renglones escolares, ladrillo o grafiti, madera, pizarra, hojas, flores, puntos, rayas de toldo, papel kraft, etc.
  - Se tiñen con los colores del tema y tienen intensidad regulable.
  - Siempre llevan una "capa de lectura" detrás del texto.
- **Foto propia de portada o de fondo:** en jpg o png, convertida a WebP de 1600 y 800 px, con oscurecido o aclarado automático para que el texto se lea. Usa el mismo flujo que el logo (`logo.service.ts`, `procesarImagen.ts`).
- **Encabezado:** estilos toldo (el actual), portada grande con foto, o mínimo.
- **Logo:** forma redonda, cuadrada o libre.
- **Limpieza:** todos los archivos nuevos se suman al barrido de huérfanos y al borrado de la tienda (`admin/eliminar/archivosDeTienda.ts`).

## V4 · Plantillas y secciones
- **3 plantillas** con los mismos datos:
  - **Clásica:** como hoy, pero pulida;
  - **Vitrina:** portada grande y destacados con fotos grandes;
  - **Galería:** catálogo en grilla de fotos, ideal para ropa.
- **Secciones del inicio a elección** (se pueden ordenar, ocultar y renombrar): promo, categorías, destacados, club, todo el catálogo, **sobre nosotros** (texto largo y foto), **galería del local** (hasta 8 fotos), **redes** (Instagram, TikTok, Facebook y web, con links validados de https y dominio conocido), **horarios** (en tabla legible, no en un bloque de texto) y **cómo llegar** (link a Maps).
- **Estados vacíos lindos:** si un producto no tiene foto, se muestra una ilustración con la inicial y los colores del tema, nunca la bolsa gris.

## V5 · Editor "Diseño de tu tienda" en el panel
- **Pantalla nueva:** `features/disenoTienda/`, en Más → Diseño de tu tienda.
  1. Elegir un tema armado.
  2. Ajustar colores, fuentes, fondo, encabezado, plantilla y secciones.
  3. **Vista previa en vivo** del celular, renderizando los mismos componentes de la vidriera con el borrador (sin iframe, porque la CSP tiene `frame-ancestors 'none'`).
  4. "Publicar". También hay "Volver al tema anterior".
- **Borrador y publicado:** `tema_borrador` y `tema`, así el cliente nunca ve un diseño a medio hacer.
- **Modo soporte:** el admin puede ayudar con el diseño (se suma a `rutasSoporte`).

## V6 · Productos: fotos y variantes
- **V6a · Galería:** la ficha muestra hasta 5 fotos con deslizamiento, y el panel permite ordenarlas. El backend ya existe (`catalogo.routes.ts:24-27`).
- **V6b · Variantes:**
  - **Tablas:**
    - `producto_opciones`: por ejemplo "Talle" con S, M y L, o "Color";
    - `variantes`: combinación, precio opcional (si no tiene, usa el del producto), **stock propio**, `stock_reservado`, SKU opcional y activa.
    - Ambas con FK compuestas `(tienda_id, id)` y en `TABLAS_DE_TIENDA`, antes de `productos`.
  - **Ítems:** `pedido_items.variante_id` y `venta_items.variante_id`, nullable, con FK compuesta. El nombre de la variante se copia en `nombre`.
  - **Stock:**
    - reserva y descuento atómicos por variante: `checkoutRepo.reservar`, `ventasRepo.descontar` y `stockRepo.aplicar`, ordenados por `(producto, variante)` para evitar deadlocks;
    - `itemsDeStock` suma `varianteId`.
  - **Frontend:**
    - selector de variante en la ficha y en la venta rápida;
    - variantes en el carrito y el checkout;
    - carga de opciones y variantes en el producto;
    - stock bajo por variante.
  - **Tests:** concurrencia (sin vender de más por variante), aislamiento y cancelación que libera la variante.

## F1 · Costos, margen y precios
- **Costo del producto y de cada variante:** `productos.costo` y `variantes.costo`.
- **Costo copiado en cada venta:** se guarda `costo_unitario` en `pedido_items` y `venta_items`, como hoy se copia el precio.
- **Cálculos:**
  - **costo de lo vendido**;
  - **ganancia bruta** = ventas − costo de lo vendido;
  - **ganancia neta** = bruta − gastos;
  - "ganancia real" pasa a usar esto. Con productos sin costo cargado, avisa "sin costo".
- **Margen:** por producto (en pesos y en %), con alerta "este precio casi no deja ganancia".
- **Sugeridor de precio:** a partir del costo y el margen buscado.
- **Aumento masivo de precios por %:** por categoría o para todo (por la inflación), con vista previa antes de aplicar.

## F2 · Reportes y gráficos
- **Período:** rango de fechas libre y **comparación con el período anterior** (+12 %).
- **Rankings:** productos y categorías más vendidos, en unidades, en plata y en ganancia.
- **Promedios:** ticket promedio y ventas por día de la semana y por hora.
- **Cortes:** por canal (online, local o encargo) y por medio de pago.
- **Gráficos SVG propios** (sin librerías pesadas), accesibles y con los colores de Mostry:
  - línea de evolución mensual;
  - barras;
  - torta o barras apiladas de gastos.
- **Rendimiento:** consultas con índices por `(tienda_id, fecha)`. Si hace falta, un resumen diario que arma el worker.

## F3 · Gastos y movimientos
- **Categorías de gasto:** predefinidas (mercadería, alquiler, servicios, sueldos, impuestos, envíos, comisiones, otros) y propias.
- **Corregir y anular:** se pueden corregir gastos y movimientos manuales. **Anular** deja un contramovimiento y nunca borra nada. Todo queda registrado.
- **Gastos fijos que se repiten** (alquiler, luz, internet): el worker los genera cada mes como "a pagar", y el comercio los marca como pagados.
- **Presupuesto mensual por categoría,** con un aviso al pasarse.

## F4 · Cuentas por pagar y por cobrar
- **Proveedores con cuenta corriente:**
  - compras al contado o a cuenta, con detalle y vencimiento;
  - pagos parciales y saldo "le debés";
  - comprar mercadería puede sumar stock y actualizar el costo (opcional).
- **Fiados:**
  - antigüedad de cada deuda;
  - fecha de pago acordada;
  - **recordatorio por WhatsApp** (`wa.me` con el mensaje armado);
  - lista ordenada por lo más viejo.
- **Resumen único:** "Te deben $ X · Debés $ Y · Vence esta semana".

## F5 · Planificación
- **Punto de equilibrio mensual:** cuánto tenés que vender para cubrir los gastos fijos, según el margen promedio, con la barra "ya cubriste el X %".
- **Metas mensuales** de ventas o ganancia, con su avance en el inicio del panel.
- **Flujo de caja proyectado a 30 días:** saldo de hoy + cobros esperados (fiados con fecha, encargos con resto) − gastos fijos − deudas que vencen.
- **Avisos push y en el resumen de la mañana:** vencimientos, meta lograda y presupuesto pasado. Reutiliza Avisos 1.

## F6 · Medios de pago, cierre y exportar
- **Más medios de pago:**
  - débito, crédito, Mercado Pago o QR, y otro, además de efectivo y transferencia;
  - con una **comisión % configurable** que se registra sola como gasto de la categoría "comisiones";
  - el ENUM `medio` se migra en `movimientos_caja` y en `gastos`.
- **Cierre del mes:** un resumen (ventas, costo, gastos, ganancia, deudas) y su versión **para imprimir o guardar como PDF** (estilos de impresión).
- **Exportar a CSV** (abre en Excel): movimientos, ventas, gastos, fiados y productos con costo y margen.
- **Control de facturación de 12 meses** (informativo, para el monotributo del comercio), con un aviso al acercarse al tope que el comercio carga.

---

## Archivos y piezas que se reutilizan
- **Paleta y tema:**
  - `frontend/src/shared/lib/paletas.js`
  - `frontend/src/features/tienda/TiendaContexto.jsx`
  - `frontend/src/shared/styles/tokens.css:171-188`
  - `backend/src/modules/tiendas/schemas.ts` (`esquemaConfig`)
  - `backend/src/modules/publico/servicios/tiendaPublica.service.ts`
- **Imágenes:**
  - `backend/src/shared/archivos/` (`procesarImagen`, `procesarLogo`, `validarImagen`, `almacenamiento`, `claves`)
  - `modules/tiendas/servicios/logo.service.ts`
- **Fuentes:** `@fontsource` (como `main.jsx:1-2`), la CSP de `frontend/encabezados.config.js` y `config/pwa.js:15`.
- **Stock:**
  - `pedidos/repositorios/checkout.repository.ts:28-39`
  - `caja/ventas/ventas.repository.ts:28-42`
  - `pedidos/repositorios/stock.repository.ts`
  - `armarPedido.ts`, `armarVenta.ts`
- **Plata:**
  - `caja/servicios/registrarMovimiento.ts` (única entrada)
  - `caja/servicios/resumen.service.ts`
  - `gastos/`, `libreta/`
- **Worker y avisos:** `worker/tareas.ts`, `modules/avisos/` y `resumen/`.
- **Borrado e aislamiento:** `tiendas/borrado/tablasDeTienda.ts` y `admin/tests/eliminarTienda.test.ts`.

## Verificación (en cada etapa)
- **Tests nuevos con TDD:** contraste de todos los temas (claro y oscuro), validación de fuentes y fotos maliciosas, aislamiento de cada tabla nueva, concurrencia de stock por variante y cálculos de costo, margen, equilibrio y proyección.
- **Suites de a una:** backend (unos 30 min), frontend y e2e. Cada etapa visible suma su e2e (por ejemplo: diseñar la tienda, comprar una variante, cargar un costo y ver la ganancia).
- **Capturas** de cada tema y pantalla en celular (`~/Escritorio/Mostry-capturas/`) para que Pedro las revise.
- **Calidad:** Lighthouse en la vidriera (el rendimiento en celulares baratos no puede empeorar por las fuentes ni los fondos), Semgrep y el agente revisor.
- **Al cerrar cada etapa:** commit y push a `desarrollo`, y actualizar `CLAUDE.md` (§12 y §13) y `docs/plan-salida.md`, donde esto se suma como etapa previa a la S4.
