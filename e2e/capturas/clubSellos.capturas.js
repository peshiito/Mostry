import { expect, test } from '@playwright/test';
import { clienteDelClub, clubDeRosa, codigoQr } from '../apoyo/club.js';
import { URL_SITIO, urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';
import { ESQUEMAS, foto } from './foto.js';

// Capturas de Lealtad L3–L5: vender con cliente del club, checkout con premio,
// Mis tiendas del cliente y socios en el panel.
for (const [esquema, colorScheme] of ESQUEMAS) {
  test(`club sellos ${esquema}`, async ({ browser }) => {
    const ctx = (extra = {}) => browser.newContext({ colorScheme, ...extra });
    const rosa = await (await ctx({ storageState: SESION_ROSA })).newPage();
    const ana = await (await ctx()).newPage();
    await clubDeRosa(rosa);
    await clienteDelClub(ana, `Ana ${esquema}`);
    const codigo = await codigoQr(ana);
    const vender = async (premio) => {
      await rosa.goto(urlTienda('dona-rosa', '/panel/vender'));
      await rosa.getByRole('button', { name: 'Monto suelto' }).click();
      await rosa.getByRole('dialog').getByLabel('Monto').fill('1500');
      await rosa
        .getByRole('dialog')
        .getByRole('button', { name: 'Agregar a la venta' })
        .click();
      await rosa.getByRole('button', { name: 'Cliente del club' }).click();
      await rosa.getByLabel('Código del cliente').fill(codigo);
      if (!premio) await foto(rosa, esquema, 'l3-01-hoja-cliente');
      await rosa.getByRole('button', { name: 'Buscar' }).click();
      await expect(rosa.getByText(`Ana ${esquema}`, { exact: true })).toBeVisible();
      if (premio) {
        await rosa.getByRole('button', { name: '50 % de descuento' }).click();
        await rosa.waitForTimeout(400);
        await foto(rosa, esquema, 'l4-01-vender-premio', true);
        return;
      }
      await rosa.getByRole('radio', { name: 'Transferencia' }).click();
      await rosa.getByRole('button', { name: /^Cobrar \$ / }).click();
      await expect(rosa.getByText(/sumó un sello/).first()).toBeVisible();
    };
    await vender();
    await vender();
    await vender(true);

    await ana.goto(urlTienda('dona-rosa', '/'));
    await foto(ana, esquema, 'l3-02-vidriera-club', true);
    await ana.goto(urlTienda('dona-rosa', '/catalogo'));
    await ana.getByText('Medialuna de manteca').first().click();
    await ana.getByRole('button', { name: 'Agregar' }).click();
    await ana.getByRole('link', { name: /Continuar/ }).click();
    await ana.getByText('Retiro en el local').click();
    await ana.getByText('50 % de descuento').click();
    await foto(ana, esquema, 'l4-02-checkout-premio', true);
    await ana.getByRole('button', { name: 'Confirmar pedido' }).click();
    await expect(ana.getByRole('heading', { name: 'Pago de tu pedido' })).toBeVisible();
    await foto(ana, esquema, 'l4-03-pago-con-premio', true);
    await ana.goto(`${URL_SITIO}/club/tiendas`);
    await expect(ana.getByText(/usaste:/)).toBeVisible();
    await foto(ana, esquema, 'l5-01-mis-tiendas', true);

    await rosa.goto(urlTienda('dona-rosa', '/panel/club/socios'));
    await foto(rosa, esquema, 'l5-02-socios');
    await rosa.getByRole('link', { name: new RegExp(`Ana ${esquema}`) }).click();
    await foto(rosa, esquema, 'l5-03-ficha-socio', true);
  });
}
