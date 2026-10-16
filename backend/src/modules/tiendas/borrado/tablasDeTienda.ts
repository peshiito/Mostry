// Todas las tablas con datos de una tienda, de hijos a padres: las FK no tienen
// cascada, así que este orden es el que deja borrar sin romper ninguna.
// Un test compara esta lista con information_schema: si se suma una tabla con
// tienda_id y no se agrega acá, el test falla (y la tienda no se podría borrar).
export const TABLAS_DE_TIENDA = [
  'avisos_push',
  'suscripciones_push',
  'registro_soporte',
  'accesos_soporte',
  'venta_items',
  'ventas',
  'pedido_items',
  'comprobantes',
  'pedidos',
  'producto_fotos',
  'productos',
  'categorias',
  'movimientos_caja',
  'cajas',
  'gastos',
  'proveedores',
  'movimientos_fiado',
  'clientes_libreta',
  'notas',
  'horarios',
  'feriados',
  'promociones',
  'reportes',
  'avisos_suscripcion',
  'pagos_suscripcion',
  'canjes',
  'sellos',
  'premios_lealtad',
  'programas_lealtad',
  'miembros_tienda',
] as const;

// Tablas con tienda_id que NO se borran a propósito: la constancia de lo que
// hizo el admin tiene que sobrevivir a la eliminación (no tiene datos personales).
export const TABLAS_QUE_SOBREVIVEN = ['registro_admin'] as const;
