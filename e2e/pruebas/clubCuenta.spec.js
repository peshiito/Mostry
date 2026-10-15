import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { URL_SITIO } from '../apoyo/entorno.js';
import { ultimoCodigo } from '../apoyo/mailpit.js';

// Club Mostry (Lealtad L1): un cliente se suma desde la landing, verifica su
// email, ve su QR que rota, edita sus datos y borra su cuenta.
test('club: alta, QR, mis datos y borrar la cuenta', async ({ page }) => {
  const email = `cliente-${Date.now().toString(36)}@prueba.test`;
  const clave = 'una-clave-bien-larga';

  await page.goto(`${URL_SITIO}/#club`);
  await page.getByRole('link', { name: 'Quiero mi QR' }).click();
  await expect(page.getByRole('heading', { name: 'Club Mostry' })).toBeVisible();
  await page.getByRole('link', { name: 'Crear mi cuenta' }).click();

  await page.getByLabel('Email').fill(email);
  await page.getByLabel(/^Clave/).fill(clave);
  await page.getByLabel('Tu nombre').fill('Ana Gómez');
  await page.getByLabel('WhatsApp').fill('11 5555-1234');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Crear mi cuenta' }).click();

  await expect(page.getByRole('heading', { name: 'Revisá tu email' })).toBeVisible();
  const codigo = await ultimoCodigo(email);
  for (const [i, digito] of [...codigo].entries())
    await page.getByLabel(`Dígito ${i + 1}`).fill(digito);
  await page.getByRole('button', { name: 'Verificar' }).click();
  await esperarAviso(page, '¡Listo! Ya sos parte del Club');

  // Mi QR: el código de 6 caracteres y la cuenta regresiva.
  await expect(page.getByRole('heading', { name: 'Hola, Ana' })).toBeVisible();
  await expect(
    page.getByRole('img', { name: /^Código QR de [A-Z2-9]{6}$/ }),
  ).toBeVisible();
  await expect(page.getByText(/^Cambia en \d:\d\d$/)).toBeVisible();

  await page.getByRole('link', { name: 'Mis tiendas' }).click();
  await expect(page.getByText('Todavía no tenés sellos')).toBeVisible();

  await page.getByRole('link', { name: 'Mis datos' }).click();
  await page.getByLabel('Dirección (opcional)').fill('Mitre 123');
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await esperarAviso(page, 'Guardamos tus datos');

  // Sale y vuelve a entrar con su clave.
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await expect(page.getByRole('heading', { name: 'Club Mostry' })).toBeVisible();
  await page.getByRole('link', { name: 'Ya tengo cuenta' }).click();
  await page.getByLabel('Email').fill(email);
  await page.getByLabel(/^Clave/).fill(clave);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.getByRole('heading', { name: 'Hola, Ana' })).toBeVisible();

  // Borra la cuenta: pide la clave y después ya no puede entrar.
  await page.getByRole('link', { name: 'Mis datos' }).click();
  await expect(page.getByLabel('Dirección (opcional)')).toHaveValue('Mitre 123');
  await page.getByRole('button', { name: 'Borrar mi cuenta' }).click();
  await page.getByLabel('Tu clave, para confirmar').fill(clave);
  await page.getByRole('button', { name: 'Borrar para siempre' }).click();
  await esperarAviso(page, 'Borramos tu cuenta');
  await page.goto(`${URL_SITIO}/club/qr`);
  await expect(page).toHaveURL(/\/club\/ingresar$/);
});
