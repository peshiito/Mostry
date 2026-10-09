import { test as setup } from '@playwright/test';
import { URL_ADMIN, urlTienda } from './apoyo/entorno.js';
import { ingresar, SESION_ADMIN, SESION_ROSA } from './apoyo/ingresar.js';

// Entra una vez como Rosa (dueña de "dona-rosa") y como admin, y guarda las cookies.
setup('sesión de la comerciante', async ({ page }) => {
  await ingresar(page, urlTienda('dona-rosa', '/panel/ingresar'), 'rosa@dona-rosa.test');
  await page.context().storageState({ path: SESION_ROSA });
});

setup('sesión del admin', async ({ page }) => {
  await ingresar(page, `${URL_ADMIN}/ingresar`, 'admin@mostry.test');
  await page.context().storageState({ path: SESION_ADMIN });
});
