# Tests de punta a punta (Etapa 13)

Recorridos completos en un navegador real con Playwright. Levantan **su propia**
API (puerto 3100, base `mostry_e2e`) y **su propio** frontend (puerto 5273): no
tocan la base ni los servidores de desarrollo. Los mails de prueba van a Mailpit.

## Qué se prueba

| Recorrido | Archivo |
|---|---|
| Comprador: compra con retiro, pago y seguimiento | `pruebas/compra.spec.js` |
| Comprador: encargo de torta con seña | `pruebas/encargo.spec.js` |
| Comerciante: registro, código por email y primer ingreso | `pruebas/registro.spec.js` |
| Comerciante: producto nuevo con foto, visible en la tienda | `pruebas/productos.spec.js` |
| Comerciante: aprobar y rechazar comprobantes | `pruebas/comprobantes.spec.js` |
| Comerciante: caja del día y libreta de fiados | `pruebas/cajaYFiados.spec.js` |
| Admin: registrar un pago, suspender y reactivar | `pruebas/admin.spec.js` |
| Suscripción: prueba → gracia → suspendida → reactivada | `pruebas/suscripcion.spec.js` |

## Cómo se corren (fish)

Con Docker andando (MySQL, RustFS y Mailpit):

```fish
cd ~/Escritorio/Programacion/Proyectos/Mostry/e2e
npm test            # todo, sin ver el navegador (~1,5 min)
npm run test:ver    # lo mismo, viendo el navegador
npm run reporte     # reporte HTML de la última corrida
```

Cada corrida arranca con la base `mostry_e2e` vacía (migraciones + seed) y las
tiendas abiertas todo el día, así no depende de la hora.

**Primera vez en otra máquina:** `npm install` en esta carpeta. La base
`mostry_e2e` la crea el script de inicio de MySQL (`docker/mysql/init`).
