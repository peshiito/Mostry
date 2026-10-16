// Secciones del menú "Más": [título, [[texto, ícono, ruta bajo /panel, módulo?]]].
// Con módulo, la fila solo aparece si la tienda lo usa ("Qué uso de Mostry").
export const GRUPOS = [
  [
    'Negocio',
    [
      ['Encargos', 'cake', 'encargos', 'usaEncargos'],
      ['Libreta', 'menu_book', 'libreta', 'usaLibreta'],
      ['Gastos', 'payments', 'gastos', 'usaGastos'],
      ['Proveedores', 'local_shipping', 'proveedores', 'usaGastos'],
      ['Promociones', 'sell', 'promociones', 'vendeOnline'],
      ['Club de clientes', 'loyalty', 'club'],
    ],
  ],
  [
    'Mi tienda',
    [
      ['Qué uso de Mostry', 'tune', 'uso'],
      ['Datos y apariencia', 'storefront', 'tienda'],
      ['Horarios', 'schedule', 'horarios'],
      ['Cobros y envíos', 'account_balance', 'cobros', 'vendeOnline'],
    ],
  ],
  [
    'Cuenta',
    [
      ['Avisos en el teléfono', 'notifications', 'avisos'],
      ['Suscripción', 'receipt_long', 'suscripcion'],
      ['Mi cuenta', 'person', 'cuenta'],
    ],
  ],
  [
    'Ayuda',
    [
      ['Reportar un problema', 'bug_report', 'reportar'],
      ['Mis reportes', 'support_agent', 'reportes'],
      ['Acceso de soporte', 'shield_person', 'soporte'],
    ],
  ],
];
