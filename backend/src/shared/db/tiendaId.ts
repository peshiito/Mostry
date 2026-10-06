declare const marca: unique symbol;

// Id de tienda "con marca": TypeScript no deja pasar un número cualquiera (ni
// confundirlo con el id de un producto) donde se espera el id de LA tienda.
// Es la regla central del multi-tenant (CLAUDE.md 4.1) chequeada al compilar.
export type TiendaId = number & { readonly [marca]: 'TiendaId' };

// Solo se crea donde el id sale de la base: el repositorio de tiendas.
// ESLint prohíbe importar comoTiendaId en cualquier otro archivo (salvo tests).
export const comoTiendaId = (id: number) => id as TiendaId;
