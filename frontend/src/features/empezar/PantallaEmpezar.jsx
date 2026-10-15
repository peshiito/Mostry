import { useState } from 'react';
import { AvisoError } from '../../shared/ui/AvisoError.jsx';
import { Boton } from '../../shared/ui/Boton.jsx';
import { Pasos } from '../../shared/ui/Pasos.jsx';
import { TituloPagina } from '../../shared/ui/TituloPagina.jsx';
import { LayoutCuenta } from '../cuenta/components/LayoutCuenta.jsx';
import css from './Empezar.module.css';
import { Resumen } from './Resumen.jsx';
import { SeccionModulos, SeccionRubro, SeccionStock } from './SeccionesPerfil.jsx';
import { usePerfil } from './usePerfil.js';

const PASOS = [
  [
    '¿Qué querés hacer con Mostry?',
    'Tildá lo que vas a usar. Lo demás no te molesta.',
    SeccionModulos,
  ],
  ['¿Qué vendés?', 'Así te sugerimos cómo manejar el stock.', SeccionRubro],
  [
    '¿Cómo manejás el stock?',
    'Elegí la forma que más se parece a tu negocio.',
    SeccionStock,
  ],
];
const NOMBRES = ['Qué hacés', 'Rubro', 'Stock', 'Listo'];

// "Armá tu Mostry" (Mejoras 3, parte A): la primera vez que entra al panel,
// unas preguntas cortas y el panel queda a la medida de su negocio.
export function PantallaEmpezar() {
  const [paso, setPaso] = useState(0);
  const p = usePerfil({ exito: '¡Listo! Tu Mostry quedó armado' });
  const ultimo = paso === PASOS.length;
  const [titulo, bajada, Seccion] = PASOS[paso] ?? [
    'Así queda tu Mostry',
    'Lo podés cambiar cuando quieras en Más → Qué uso de Mostry.',
  ];
  return (
    <LayoutCuenta>
      <Pasos pasos={NOMBRES} actual={paso + 1} />
      <TituloPagina titulo={titulo} bajada={bajada} />
      <AvisoError error={p.accion.error} />
      {ultimo ? <Resumen perfil={p.perfil} /> : <Seccion p={p} />}
      <div className={css.botones}>
        <Boton icono="arrow_back" disabled={paso === 0} onClick={() => setPaso(paso - 1)}>
          Atrás
        </Boton>
        {ultimo ? (
          <Boton
            variante="principal"
            tamano="lg"
            cargando={p.accion.enviando}
            textoCargando="Armando…"
            onClick={() => p.accion.ejecutar()}
          >
            Empezar
          </Boton>
        ) : (
          <Boton
            variante="verde"
            tamano="lg"
            iconoFin="arrow_forward"
            onClick={() => setPaso(paso + 1)}
          >
            Seguir
          </Boton>
        )}
      </div>
    </LayoutCuenta>
  );
}
