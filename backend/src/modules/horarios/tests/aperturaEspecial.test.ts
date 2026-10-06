import { describe, expect, it } from 'vitest';
import { estadoApertura } from '../servicios/apertura.js';
import { agenda, ar } from './agendaDePrueba.js';

describe('estadoApertura: casos especiales', () => {
  it('pausada gana sobre todo y no promete próxima apertura', () => {
    expect(estadoApertura(agenda({ pausada: true }), ar('2026-10-12T10:00'))).toEqual({
      abierta: false,
      motivo: 'pausada',
      proximaApertura: null,
    });
  });

  it('sin horarios cargados: cerrada y sin próxima apertura', () => {
    const vacia = agenda({ tramos: [] });
    expect(estadoApertura(vacia, ar('2026-10-12T10:00'))).toMatchObject({
      abierta: false,
      proximaApertura: null,
    });
  });
});
