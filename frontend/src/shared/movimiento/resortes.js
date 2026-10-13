// Resortes con nombre: el mismo "carácter" en toda la app.
// rapido: lo que se toca todo el tiempo (pestañas, interruptores, chips).
// suave: cosas que entran o se acomodan (listas, barras, pantallas).
// festejo: solo momentos raros (pedido confirmado, caja cerrada, pago).
export const RESORTES = {
  rapido: { type: 'spring', duration: 0.3, bounce: 0.15 },
  suave: { type: 'spring', duration: 0.45, bounce: 0.1 },
  festejo: { type: 'spring', duration: 0.6, bounce: 0.35 },
};

// Curva de salida de tokens.css (--ease-out) para lo que no es resorte.
export const EASE_OUT = [0.23, 1, 0.32, 1];
