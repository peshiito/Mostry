import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { encargarHasta, rosaAbreElEncargo } from '../apoyo/encargo.js';

// Encargos 2: la torta de cumpleaños pide personalización; el cliente escribe
// cómo la quiere y suma una foto. Rosa lo lee (y ve la foto) antes de aceptar.
test('torta personalizada: texto y foto llegan al panel', async ({ page, browser }) => {
  await encargarHasta(page, 'Torta de cumpleaños', 'Lucía Prueba');
  const confirmar = page.getByRole('button', { name: 'Confirmar encargo' });
  await expect(confirmar).toBeDisabled();
  await page
    .getByLabel('Contanos el texto, el sabor y el relleno')
    .fill('Feliz cumple Martina, de chocolate');
  await page.locator('input[type=file]').setInputFiles('archivos/comprobante.png');
  await confirmar.click();
  await expect(page.getByText(/acepte tu encargo/)).toBeVisible();
  await expect(page.getByText('“Feliz cumple Martina, de chocolate”')).toBeVisible();

  const { rosa, contexto } = await rosaAbreElEncargo(browser, 'Lucía Prueba');
  await expect(rosa.getByText('“Feliz cumple Martina, de chocolate”')).toBeVisible();
  const ventana = rosa.waitForEvent('popup');
  await rosa.getByRole('button', { name: /Ver foto de referencia/ }).click();
  // La pestaña se abre vacía y después va a la URL firmada de 5 minutos.
  await (await ventana).waitForURL(/X-Amz-Expires=300/);
  await rosa.getByRole('button', { name: 'Aceptar encargo' }).click();
  await esperarAviso(rosa, 'Encargo aceptado');
  await contexto.close();
});
