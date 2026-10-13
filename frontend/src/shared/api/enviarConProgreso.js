// fetch no informa cuánto se subió de un archivo; XMLHttpRequest sí. Devuelve un
// Response igual al de fetch, así cliente.js maneja errores y sesión igual.
export function enviarConProgreso(url, { method, body, signal, onProgreso }) {
  return new Promise((resolver, rechazar) => {
    if (signal?.aborted)
      return rechazar(new DOMException('Subida cancelada', 'AbortError'));
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.withCredentials = true; // la sesión viaja en la cookie httpOnly
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgreso(e.loaded / e.total);
    };
    xhr.onload = () => {
      const sinCuerpo = xhr.status === 204 || xhr.status === 205;
      resolver(new Response(sinCuerpo ? null : xhr.responseText, { status: xhr.status }));
    };
    xhr.onerror = () => rechazar(new TypeError('Falló la conexión'));
    xhr.onabort = () => rechazar(new DOMException('Subida cancelada', 'AbortError'));
    signal?.addEventListener('abort', () => xhr.abort(), { once: true });
    xhr.send(body);
  });
}
