/* global clients */
// Avisos 1: lo que hace el service worker del panel cuando llega un aviso push.
// Se suma al service worker que genera Workbox (config/pwa.js, importScripts).

// El aviso viene en JSON (lo arma la API); si no, se muestra el texto tal cual.
function leer(datos) {
  try {
    return datos ? datos.json() : {};
  } catch {
    return { titulo: 'Mostry', cuerpo: datos ? datos.text() : '' };
  }
}

// Muestra el aviso. El mismo pedido reemplaza su aviso (tag) y vuelve a sonar
// (renotify); en el horario de silencio llega sin sonido ni vibración.
self.addEventListener('push', (evento) => {
  const a = leer(evento.data);
  const titulo = a.titulo || 'Mostry';
  const opciones = {
    body: a.cuerpo || '',
    icon: '/iconos/icono-192.png',
    badge: '/iconos/insignia-96.png',
    tag: a.tag || 'mostry',
    renotify: Boolean(a.tag),
    silent: Boolean(a.silencioso),
    data: { url: a.url || '/panel' },
  };
  const tareas = [self.registration.showNotification(titulo, opciones)];
  // El número en el ícono de la app: lo que espera a la tienda.
  if ('setAppBadge' in self.navigator && typeof a.pendientes === 'number')
    tareas.push(
      a.pendientes > 0
        ? self.navigator.setAppBadge(a.pendientes)
        : self.navigator.clearAppBadge(),
    );
  evento.waitUntil(Promise.all(tareas).catch(() => {}));
});

// Al tocar el aviso: si el panel ya está abierto, lo trae al frente y va al
// pedido; si no, lo abre. Solo rutas del mismo origen (nunca una URL externa).
self.addEventListener('notificationclick', (evento) => {
  evento.notification.close();
  const pedida = new URL(
    String(evento.notification.data?.url || '/panel'),
    self.location.origin,
  );
  const url =
    pedida.origin === self.location.origin
      ? pedida.href
      : `${self.location.origin}/panel`;
  evento.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((abiertas) => {
      const panel = abiertas.find((c) => new URL(c.url).pathname.startsWith('/panel'));
      // Una pestaña que este service worker no controla no se puede navegar:
      // entonces se abre una nueva en el pedido.
      if (panel)
        return panel
          .focus()
          .then((c) => c.navigate(url))
          .catch(() => clients.openWindow(url));
      return clients.openWindow(url);
    }),
  );
});
