import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { URL_ADMIN } from '../apoyo/entorno.js';
import { SESION_ADMIN } from '../apoyo/ingresar.js';

// El admin le escribe a una tienda por WhatsApp con una plantilla (Etapa 14.5, parte C).
test.use({ storageState: SESION_ADMIN });

test('arma el mensaje con la plantilla y abre WhatsApp con el número de la tienda', async ({
  page,
}) => {
  await page.goto(URL_ADMIN);
  await page
    .getByRole('button', { name: 'Mandar WhatsApp a Facturería Doña Rosa' })
    .click();
  const hoja = page.getByRole('dialog', { name: 'Mandar WhatsApp' });
  await hoja.getByRole('button', { name: 'Encuesta: ¿cómo te va?' }).click();
  const mensaje = hoja.getByLabel('Mensaje');
  await expect(mensaje).toHaveValue(/^Hola Rosa, ¿cómo estás\? Soy Pedro Báez/);
  await mensaje.fill('Hola Rosa, ¿todo bien con la tienda?');
  const link = hoja.getByRole('link', { name: 'Abrir WhatsApp' });
  await expect(link).toHaveAttribute(
    'href',
    `https://wa.me/5491123456789?text=${encodeURIComponent('Hola Rosa, ¿todo bien con la tienda?')}`,
  );
});

test('edita una plantilla y la vuelve al texto original', async ({ page }) => {
  await page.goto(`${URL_ADMIN}/mensajes`);
  const encuesta = page.locator('section, div').filter({
    has: page.getByRole('heading', { name: 'Encuesta: ¿cómo te va?' }),
  });
  const texto = encuesta.last().getByLabel('Texto');
  await texto.fill('Hola {dueno}, ¿cómo anda {tienda}?');
  await expect(
    encuesta.last().getByText('Hola Rosa, ¿cómo anda La Espiga?'),
  ).toBeVisible();
  await encuesta.last().getByRole('button', { name: 'Guardar' }).click();
  await esperarAviso(page, 'Plantilla guardada');
  await page.getByRole('button', { name: 'Volver al texto original' }).click();
  await esperarAviso(page, 'Volvió al texto original');
  await expect(
    page.getByRole('button', { name: 'Volver al texto original' }),
  ).toHaveCount(0);
});
