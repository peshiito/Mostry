# Mostry

Tienda online y gestión para comercios de barrio: vidriera con pedidos por WhatsApp, panel con stock, caja, fiados, encargos y gastos, y un admin para Mostry. SaaS multi-tenant: cada comercio tiene su tienda en `<slug>.mostry.com.ar`.

> Versión **1.0.0**. Las reglas del proyecto están en [`CLAUDE.md`](CLAUDE.md). La puesta en producción está en [`docs/produccion.md`](docs/produccion.md).

## Arrancar en tu máquina (5 minutos)

**Requisitos:** Node 24 o más, Docker con Compose y git.

```fish
git clone git@github.com:peshiito/mostry.git
cd mostry
npm run local:todo
```

`npm run local:todo` hace todo:

1. crea `.env` y `frontend/.env` a partir de las plantillas, si no existen;
2. instala las dependencias;
3. levanta Docker (MySQL, phpMyAdmin, RustFS y Mailpit);
4. **borra la base local** y carga los datos de demo (antes pide confirmación);
5. deja corriendo la API, el worker y el frontend.

Para cortar todo: `Ctrl+C`. La próxima vez, sin borrar nada: `npm run dev` (o `npm run local`, que es lo mismo).

### Direcciones

| Qué | Dónde |
|---|---|
| Landing (sitio de Mostry) | http://mostry.localhost:5173 |
| Tienda de ejemplo | http://dona-rosa.mostry.localhost:5173 |
| Panel del comercio | http://dona-rosa.mostry.localhost:5173/panel |
| Admin de Mostry | http://admin.mostry.localhost:5173 |
| Mails (Mailpit) | http://localhost:8025 |
| Base de datos (phpMyAdmin) | http://localhost:8081 |
| Archivos (consola de RustFS) | http://localhost:9001 |

### Cuentas de prueba

La clave de todas es `SEED_CLAVE` del `.env` (por defecto `mostry-demo-2026`).

| Cuenta | Email | Qué tiene |
|---|---|---|
| Admin de Mostry | `admin@mostry.test` | Todas las tiendas, mensajes, reportes y soporte |
| Facturería Doña Rosa | `rosa@dona-rosa.test` | Pedidos en todos los estados, encargos, caja de hoy y de ayer, gastos, fiados, reportes |
| Heladería del Parque | `martin@heladeria.test` | En prueba gratis, a punto de vencer |

Para probar el flujo real con tu correo: andá a la landing, tocá **Creá tu tienda** y el código de verificación te llega a Mailpit.

## Datos

| Comando (desde la raíz) | Qué hace |
|---|---|
| `npm run local:todo` | Base de cero, con seed y demo, y arranca todo |
| `cd backend; and npm run db:reset` | Base de cero solo con el seed (admin y 2 tiendas) |
| `cd backend; and npm run db:demo` | Suma la demo encima del seed |
| `npm run backup` | Backup de la base y de los archivos en `../Mostry-Backup` |
| `npm run restaurar -- <archivo.sql.gz>` | Restaura en `mostry_restaurada` y verifica fila por fila |

`Mostry-Backup` es una carpeta de **datos**, no de código: el código vive en git.

## Tests

```fish
cd backend; and npm test     # API: unidad e integración contra MySQL (~11 min)
cd frontend; and npm test    # componentes y lógica
cd e2e; and npm test         # recorridos completos en el navegador (~4 min)
```

**Ojo:** no corras dos suites del backend o del e2e al mismo tiempo, porque comparten la base de test.

## Cómo está armado

```
mostry/
├── backend/         API Express + TypeScript (Kysely, MySQL) y el worker de tareas
├── frontend/        React + Vite: sitio, tienda, panel y admin (decide por subdominio)
├── e2e/             Tests de punta a punta con Playwright
├── bruno/           Colección de requests para probar la API a mano
├── docs/            Decisiones, informe de seguridad, guía de producción, diseños
├── scripts/         Arranque local, backup y restauración
└── docker/          Configuración de los servicios de Docker
```

## Ramas

- **`main`:** la versión estable, la que va a producción.
- **`desarrollo`:** donde se trabaja. Cuando una etapa queda en verde, se pasa a `main`.
- **Ideas de mejora:** van en una rama propia. Si te gusta, se pasa a `desarrollo`; si no, se borra.

**Las claves nunca van a git:** `.env` está ignorado y las plantillas `.env*.example` no tienen secretos.
