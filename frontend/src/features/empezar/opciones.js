// Contenido de "Armá tu Mostry" (Mejoras 3, parte A): qué partes usa la tienda.
// La caja y los productos son la base y siempre están.
export const MODULOS = [
  {
    clave: 'vendeOnline',
    titulo: 'Vender por internet con mi tienda',
    detalle: 'Te hacen pedidos desde tu link y te mandan el comprobante.',
  },
  {
    clave: 'usaEncargos',
    titulo: 'Tomar encargos con fecha',
    detalle: 'Tortas, pedidos grandes: el cliente elige día y hora.',
  },
  {
    clave: 'usaLibreta',
    titulo: 'Anotar fiados de mis clientes',
    detalle: 'Quién te debe, cuánto y cuándo te pagó.',
  },
  {
    clave: 'usaGastos',
    titulo: 'Controlar gastos y proveedores',
    detalle: 'Lo que comprás y pagás, para saber cuánto ganás de verdad.',
  },
  {
    clave: 'usaClub',
    titulo: 'Club de clientes con sellos',
    detalle: 'Tus clientes juntan sellos y ganan premios que vos elegís.',
  },
];

export const RUBROS = [
  { valor: 'panaderia', texto: 'Panadería o facturería' },
  { valor: 'pasteleria', texto: 'Pastelería' },
  { valor: 'almacen', texto: 'Almacén o kiosco' },
  { valor: 'ropa', texto: 'Ropa o calzado' },
  { valor: 'artesanias', texto: 'Artesanías' },
  { valor: 'otro', texto: 'Otro rubro' },
];

// El rubro sugiere cómo manejar el stock (y si toma encargos). Solo sugiere.
const SUGERENCIAS = {
  panaderia: { modoStock: 'simple' },
  pasteleria: { modoStock: 'a_pedido', usaEncargos: true },
  almacen: { modoStock: 'unidades' },
  ropa: { modoStock: 'unidades' },
  artesanias: { modoStock: 'simple' },
  otro: {},
};
export const sugerencia = (rubro) => SUGERENCIAS[rubro] ?? {};

// Una tienda nueva arranca con todo prendido: apaga lo que no usa.
export const PERFIL_INICIAL = {
  vendeOnline: true,
  usaEncargos: true,
  usaLibreta: true,
  usaGastos: true,
  usaClub: false,
  rubro: 'otro',
  modoStock: 'unidades',
};
