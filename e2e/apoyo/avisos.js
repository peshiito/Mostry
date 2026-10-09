import { expect } from '@playwright/test';

// Espera el aviso flotante con `texto` (no el anuncio oculto para lectores de pantalla).
export const esperarAviso = (page, texto) =>
  expect(page.getByRole('region', { name: 'Avisos' }).getByText(texto)).toBeVisible();
