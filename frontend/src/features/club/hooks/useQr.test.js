import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clubApi } from '../api/club.js';
import { useQr } from './useQr.js';

const espera = () => act(() => vi.advanceTimersByTimeAsync(0));

describe('useQr', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('cuenta los segundos y al rotar pide el código siguiente', async () => {
    const qr = vi
      .spyOn(clubApi, 'qr')
      .mockResolvedValueOnce({ codigo: 'ABC234', quedanMs: 3000 })
      .mockResolvedValueOnce({ codigo: 'XYZ789', quedanMs: 300_000 });
    const { result } = renderHook(() => useQr());
    expect(result.current.cargando).toBe(true);
    await espera();
    expect(result.current).toMatchObject({ codigo: 'ABC234', quedan: 3 });

    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(result.current.quedan).toBe(2);

    await act(() => vi.advanceTimersByTimeAsync(2000));
    await espera();
    expect(qr).toHaveBeenCalledTimes(2);
    expect(result.current).toMatchObject({ codigo: 'XYZ789', quedan: 300 });
  });

  it('si falla, muestra el error y reintenta a los 10 segundos', async () => {
    const qr = vi
      .spyOn(clubApi, 'qr')
      .mockRejectedValueOnce(Object.assign(new Error('sin red'), { status: 0 }))
      .mockResolvedValueOnce({ codigo: 'ABC234', quedanMs: 60_000 });
    const { result } = renderHook(() => useQr());
    await espera();
    expect(result.current.error?.message).toBe('sin red');
    await act(() => vi.advanceTimersByTimeAsync(10_000));
    await espera();
    expect(qr).toHaveBeenCalledTimes(2);
    expect(result.current).toMatchObject({ codigo: 'ABC234', error: null });
  });
});
