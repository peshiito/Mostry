import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from './cliente.js';

// XMLHttpRequest falso: deja disparar el progreso y la respuesta a mano.
class XhrFalso {
  static ultimo;
  upload = {};
  open(metodo, url) {
    Object.assign(this, { metodo, url });
    XhrFalso.ultimo = this;
  }
  send(cuerpo) {
    this.cuerpo = cuerpo;
  }
  responder(status, cuerpo) {
    Object.assign(this, { status, responseText: JSON.stringify(cuerpo) });
    this.onload();
  }
}

describe('subida con progreso', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('informa el porcentaje real y devuelve la respuesta como fetch', async () => {
    vi.stubGlobal('XMLHttpRequest', XhrFalso);
    const avances = [];
    const p = api('/panel/tienda/logo', {
      metodo: 'PUT',
      archivo: new FormData(),
      onProgreso: (v) => avances.push(v),
    });
    const xhr = XhrFalso.ultimo;
    expect(xhr.withCredentials).toBe(true);
    xhr.upload.onprogress({ lengthComputable: true, loaded: 32, total: 100 });
    xhr.upload.onprogress({ lengthComputable: true, loaded: 100, total: 100 });
    xhr.responder(200, { ok: 1 });
    await expect(p).resolves.toEqual({ ok: 1 });
    expect(avances).toEqual([0.32, 1]);
  });

  it('los errores son los mismos que con fetch', async () => {
    vi.stubGlobal('XMLHttpRequest', XhrFalso);
    const p = api('/x', { metodo: 'POST', archivo: new FormData(), onProgreso() {} });
    XhrFalso.ultimo.responder(413, {
      error: { codigo: 'archivo_grande', mensaje: 'Pesa mucho' },
    });
    await expect(p).rejects.toMatchObject({ status: 413, codigo: 'archivo_grande' });
    const q = api('/x', { metodo: 'POST', archivo: new FormData(), onProgreso() {} });
    XhrFalso.ultimo.onerror();
    await expect(q).rejects.toMatchObject({ status: 0, codigo: 'sin_conexion' });
  });
});
