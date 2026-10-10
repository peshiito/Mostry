#!/usr/bin/env bash
# Genera los íconos de la app instalable (PWA) desde el toldo oficial vectorial
# (src/Logos/LogoMostryToldo.svg): el toldo de noche sobre el fondo oscuro del logo.
# Uso (desde frontend/, también en fish): bash scripts/iconos.sh
# Requiere rsvg-convert (paquete librsvg). Volver a correrlo si cambia el logo.
set -euo pipefail
cd "$(dirname "$0")/.."
TOLDO=$(sed -e 's/<svg[^>]*>//' -e 's#</svg>##' src/Logos/LogoMostryToldo.svg)
FONDO='#0D1411'
SALIDA=public/iconos

# $1 nombre, $2 lado en px, $3 qué parte del ancho ocupa el toldo, $4 radio de las esquinas
generar() {
  # El toldo mide 621×278: se centra en un cuadrado de 1000×1000.
  local escala x y
  escala=$(awk "BEGIN{print 1000 * $3 / 621}")
  x=$(awk "BEGIN{print (1000 - 621 * $escala) / 2}")
  y=$(awk "BEGIN{print (1000 - 278 * $escala) / 2}")
  cat <<SVG | rsvg-convert -w "$2" -h "$2" -o "$SALIDA/$1.png"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
  <rect width="1000" height="1000" rx="$4" fill="$FONDO"/>
  <g transform="translate($x $y) scale($escala)">$TOLDO</g>
</svg>
SVG
  echo "$SALIDA/$1.png"
}

generar icono-192 192 0.8 200
generar icono-512 512 0.8 200
# Maskable: Android recorta un círculo; el toldo entra en la zona segura (80 %).
generar icono-maskable-512 512 0.6 0
# iOS redondea solo: va cuadrado y sin transparencia.
generar apple-touch-icon 180 0.74 0
