> **Estado (2026-10-14): L1 a L5 HECHAS, sin commitear.** Detalle de cómo quedó en `CLAUDE.md` §13.
> **Antes:** plan APROBADO por Pedro (2026-10-14), en espera. Se arrancaba recién
> cuando esté terminada Mejoras 3 completa (Partes A y C) y Pedro lo confirme.
> Pedro la llamó **"Lealtad"**. Idea original en sus palabras: "a las 5 compras un
> descuento; si no lo usa y llega a 7, un 75 %; a las 10, una compra 100 % gratis;
> todo personalizable por cada tienda". Ejemplo de premio regalo: "en la ferretería, a
> las 5 te llevás un juego de destornilladores". Un cliente puede tener sellos en
> varias tiendas a la vez (2 en la panadería, 1 en la ferretería) con UN solo QR.
> La tienda también puede poner compra mínima ("solo suma con compras de $10.000"),
> topes y vencimiento, o dejarlo sin límites.

# Etapa "Lealtad" · Club Mostry: cuentas de cliente y sellos de lealtad

## Contexto
Pedro quiere que cada tienda pueda tener, **si quiere**, un sistema de lealtad: "a las 5 compras, 20 % de descuento; si esperás a las 7, 75 %; a las 10, una compra gratis". Cada tienda lo arma a su medida: cuántos escalones, cuántas compras pide cada uno, qué premio da, compra mínima, topes y vencimiento.

Para eso nace un **tercer tipo de usuario: el cliente con cuenta**, que es distinto del comprador de hoy.
- **El comprador común sigue igual,** sin cuenta, con nombre, WhatsApp y pago.
- **El cliente con cuenta** se registra una sola vez (email verificado, nombre, WhatsApp y dirección opcional). Tiene **un QR único** que le sirve en todas las tiendas con club y junta sellos en cada una por separado: por ejemplo, 2 en la panadería y 1 en la ferretería.
- **Los sellos se suman comprando online y comprando en el local:** el comerciante escanea su QR al cobrar.
- **Lo que guarda cada uno:** el cliente, su historial de compras; la tienda, el historial de sus socios en **su** tienda (nunca lo que compró en otras).

**Decidido con Pedro:**
- **La cuenta vive en `mostry.com.ar/club`:** una sola para todas las tiendas, instalable como app.
- **El QR cambia cada 5 minutos,** así una foto vieja no sirve para usar premios ajenos. Abajo muestra un código corto de 6 caracteres para tipearlo si la cámara falla.
- **Premios de tres tipos:**
  - **porcentaje** (con tope opcional en pesos);
  - **monto fijo**;
  - **regalo**, en texto libre ("un juego de destornilladores").
- **Orden:** va **después de Mejoras 3 A y C**. Los sellos del local se suman y se canjean desde la **venta rápida** (Parte C).

**Cómo funcionan los sellos:**
- cada compra que llega al mínimo de la tienda suma **1 sello**;
- con los sellos de un escalón el cliente puede **usar ese premio o seguir juntando**;
- al usar un premio, **se gastan todos sus sellos** y vuelve a 0;
- si la tienda pone vencimiento ("los sellos duran 6 meses"), los viejos dejan de contar.

## Reglas
- 70 líneas por archivo, Zod estricto, `TiendaId` en todo lo de la tienda.
- **El servidor calcula siempre el descuento,** nunca el navegador.
- Las pantallas nuevas pasan por **Stitch**: prompts en `docs/stitch/prompts-club.md`, Pedro los genera y yo los traduzco.
- **Privacidad (Ley 25.326):**
  - el cliente acepta términos y política al registrarse;
  - puede **borrar su cuenta**;
  - una tienda solo ve su nombre y lo que compró **en esa tienda**;
  - el admin no ve sellos ni compras.

---

## L1 · Cuentas de cliente y su app (`mostry.com.ar/club`)
- **Base de datos** (tablas propias, separadas de `usuarios`, para que nunca se mezcle con comerciantes ni admin):
  - `clientes`: email único, `hash_clave`, nombre, WhatsApp, dirección (opcional), `email_verificado_en`, `secreto_qr` (aleatorio, para el QR que rota), `activo`;
  - `sesiones_club` y `codigos_club` (verificar email y recuperar contraseña), con el mismo esquema que las de usuarios.
- **Backend** (`modules/club/cuenta/`):
  - registro, verificación por mail, login, logout, recuperar contraseña, editar datos y **borrar cuenta**;
  - cookie propia `__Host-mostry_club` (`httpOnly`, `Secure`, `SameSite=Lax`), con los mismos límites de intentos del panel.
- **QR** (`GET /club/qr`):
  - devuelve un token `HMAC(secreto_qr, ventana de 5 min)` y su código corto;
  - el servidor acepta la ventana actual y la anterior, por si el cliente lo mostró justo al cambiar.
- **Frontend** (zona `sitio`, rutas `/club/*`, PWA propia del club):
  - registro e ingreso;
  - **"Mi QR"** con brillo alto, el código corto y la cuenta regresiva de la próxima rotación;
  - **"Mis tiendas"**: una tarjeta de sellos por tienda, vacía al principio;
  - **"Mis datos"**: editar o borrar la cuenta.
- **Landing:** sección "¿Sos cliente? Sumate al Club".

## L2 · El programa de lealtad de cada tienda (panel)
- **Base de datos:**
  - `programas_lealtad` (uno por tienda): `activo`, `nombre` ("Club Doña Rosa"), `compra_minima` (centavos, 0 = sin mínimo), `vence_meses` (nulo = no vencen);
  - `premios_lealtad`: `compras` (en qué sello se habilita), `tipo` (`porcentaje` | `monto` | `regalo`), `valor`, `tope` (opcional) y `descripcion`;
  - de 1 a 6 escalones, con `compras` creciente y único.
- **Panel → Más → "Club de clientes":**
  - activar o apagar, nombre, compra mínima y vencimiento;
  - los escalones en una lista (agregar, editar, ordenar) con una vista previa de la tarjeta como la va a ver el cliente;
  - apagarlo no borra los sellos de nadie.
- **Tienda pública:** si el club está activo, una franja "Sumá sellos con el Club" y la escalera de premios.
- Si se hace la Parte A de Mejoras 3, el club es un módulo más que se elige en las preguntas.

## L3 · Sumar sellos
- **Base de datos:**
  - `sellos`: `tienda_id`, `cliente_id`, `origen` (`pedido` | `venta`), `origen_id`, `monto`, `creado_en`;
  - `pedidos.cliente_id` y `ventas.cliente_id`, nulos.
- **Online:**
  - si el comprador entró al club, el checkout lo reconoce (la cookie del club viaja a la API desde cualquier tienda) y el pedido queda a su nombre, con los datos de contacto precargados;
  - el sello se suma **cuando el pedido se entrega** y si llega a la compra mínima;
  - un pedido cancelado no suma.
- **En el local** (venta rápida de Mejoras 3 C):
  - botón "Cliente del club" para **escanear el QR** con la cámara (`BarcodeDetector`, o una librería chica si el navegador no lo trae) o tipear el código corto;
  - muestra nombre, sellos y premios disponibles;
  - al cobrar, suma el sello si llega al mínimo.
- **Endpoint:** `POST /panel/club/identificar { codigo }`, con límite de intentos. Responde solo lo de **esa** tienda.

## L4 · Usar premios
- **Base de datos:** `canjes` con el premio copiado al momento (tipo, valor, tope y descripción), `sellos_usados`, `descuento` (centavos), `origen` y `origen_id`.
- **El saldo se calcula, no se guarda:** son los sellos posteriores al último canje y no vencidos. Las escrituras van con bloqueo de la fila del programa, así **dos canjes simultáneos no usan los mismos sellos**.
- **Online:**
  - en el checkout, "Usar premio" lista los habilitados;
  - el servidor recalcula el descuento (porcentaje con tope, monto fijo sin pasar el total, o regalo, que se anota en el pedido como ítem de $ 0);
  - si el pedido se cancela, el canje se anula y los sellos vuelven.
- **En el local:** al identificar al cliente en la venta rápida, aparece "Usar premio" y el ticket lo descuenta.
- **El cliente** ve en su app "Usaste: 75 % en Doña Rosa, el 12/11".

## L5 · Historiales y cierre
- **Cliente:** historial de compras por tienda, con fecha, total, sello sumado y premio usado.
- **Tienda:** Club de clientes → socios (nombre, sellos, último paso) → la ficha de cada uno, con su historial en esta tienda.
- **Admin:** solo cantidades (tiendas con club, socios totales), sin datos de nadie.
- **Borrar una tienda** (Mejoras 4): las tablas nuevas con `tienda_id` entran en `TABLAS_DE_TIENDA`, y el test lo exige.
- **Borrar la cuenta de un cliente:** se borran sus datos. En las tiendas, sus pedidos quedan como compras comunes, sin el vínculo.

---

## Verificación (por etapa, con reporte y freno en cada una)
- **Backend:**
  - registro y login del club aislados del panel (la cookie del club no abre el panel ni el admin, y al revés);
  - un QR vencido o de otra ventana no sirve;
  - una tienda no ve los sellos que el cliente tiene en otra;
  - el mínimo y el vencimiento se respetan;
  - el descuento siempre se calcula en el servidor (se prueba mandándolo manipulado);
  - dos canjes simultáneos dan un solo canje;
  - cancelar devuelve los sellos;
  - el test de cobertura de `TABLAS_DE_TIENDA`.
- **e2e:**
  - un cliente se registra en el club;
  - compra online dos veces y suma sellos al entregarse;
  - en el local, el comerciante escanea su código, cobra y suma;
  - llega al escalón, usa el 75 %, el descuento aparece en el total y la tarjeta vuelve a 0.
- Capturas y videos por el chat. Suites completas, revisores y Semgrep en cada etapa.

## Archivos clave (nuevos)
- **Backend:**
  - `modules/club/{cuenta,qr,programa,sellos,canjes}/`;
  - migraciones nuevas, después de las de Mejoras 3: `clientes`, `sesiones_club`, `codigos_club`, `programas_lealtad`, `premios_lealtad`, `sellos`, `canjes` y la columna `cliente_id` en `pedidos` y `ventas`.
- **Frontend:**
  - `apps/club/` (zona `sitio`, rutas `/club`) y `features/club/`;
  - `features/clubPanel/` (configuración y socios);
  - el escáner en `features/vender/`.
- **Se reusa:**
  - el patrón de auth y códigos de `modules/auth`;
  - los límites de intentos;
  - `CheckDibujado`, `Monto animado`, `ListaAnimada` y `Pasos`;
  - el checkout, con el descuento en el cálculo del servidor.
