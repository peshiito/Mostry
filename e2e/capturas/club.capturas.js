import { expect, test } from '@playwright/test';
import { URL_SITIO } from '../apoyo/entorno.js';
import { ultimoCodigo } from '../apoyo/mailpit.js';
import { ESQUEMAS, foto } from './foto.js';

// Capturas del Club Mostry (Lealtad L1), en claro y en oscuro.
for (const [esquema, colorScheme] of ESQUEMAS) {
  test(`club ${esquema}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    const email = `foto-${esquema}-${Date.now().toString(36)}@prueba.test`;
    await page.goto(`${URL_SITIO}/#club`);
    await page.locator('#club').scrollIntoViewIfNeeded();
    await foto(page, esquema, 'club-01-landing');
    await page.goto(`${URL_SITIO}/club`);
    await foto(page, esquema, 'club-02-bienvenida');
    await page.getByRole('link', { name: 'Crear mi cuenta' }).click();
    await page.getByLabel('Email').fill(email);
    await page.getByLabel(/^Clave/).fill('una-clave-bien-larga');
    await page.getByLabel('Tu nombre').fill('Ana Gómez');
    await page.getByLabel('WhatsApp').fill('11 5555-1234');
    await page.getByRole('checkbox').check();
    await foto(page, esquema, 'club-03-registro');
    await page.getByRole('button', { name: 'Crear mi cuenta' }).click();
    const codigo = await ultimoCodigo(email);
    for (const [i, d] of [...codigo].entries())
      await page.getByLabel(`Dígito ${i + 1}`).fill(d);
    await page.getByRole('button', { name: 'Verificar' }).click();
    await expect(page.getByText(/^Cambia en/)).toBeVisible();
    await foto(page, esquema, 'club-04-mi-qr');
    await page.getByRole('link', { name: 'Mis tiendas' }).click();
    await foto(page, esquema, 'club-05-mis-tiendas');
    await page.getByRole('link', { name: 'Mis datos' }).click();
    await foto(page, esquema, 'club-06-mis-datos');
    await page.getByRole('button', { name: 'Borrar mi cuenta' }).click();
    await foto(page, esquema, 'club-07-borrar');
  });
}
