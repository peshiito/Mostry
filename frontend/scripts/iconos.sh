#!/usr/bin/env bash
# Genera los íconos de la app instalable (PWA) desde public/favicon.svg.
# Uso (desde frontend/, también en fish): bash scripts/iconos.sh
# Requiere rsvg-convert (paquete librsvg). Volver a correrlo si cambia el logo.
set -euo pipefail
cd "$(dirname "$0")/.."
# Sobre el fondo lona, las rayas crema del toldo van un tono más tostado para
# que se lean; las rayas se estiran medio punto para tapar la costura con los festones.
LOGO=$(sed -e 's/<svg[^>]*>//' -e 's#</svg>##' -e 's/#F7F3EC/#E3D7C1/g' \
  -e 's/height="17"/height="17.5"/g' public/favicon.svg)
FONDO='#F7F3EC' # lona
SALIDA=public/iconos

# $1 nombre, $2 lado en px, $3 escala del logo (de 48 px), $4 radio de las esquinas
generar() {
  local lado=512 escala=$3
  # El logo ocupa x 0..48 e y 4..42: lo centramos en el cuadrado de 512.
  local x y
  x=$(awk "BEGIN{print (512 - 48 * $escala) / 2}")
  y=$(awk "BEGIN{print 256 - 23 * $escala}")
  cat <<SVG | rsvg-convert -w "$2" -h "$2" -o "$SALIDA/$1.png"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 $lado $lado">
  <rect width="$lado" height="$lado" rx="$4" fill="$FONDO"/>
  <g transform="translate($x $y) scale($escala)">$LOGO</g>
</svg>
SVG
  echo "$SALIDA/$1.png"
}

generar icono-192 192 7 96
generar icono-512 512 7 96
# Maskable: Android recorta un círculo; el logo entra en la zona segura (80 %).
generar icono-maskable-512 512 5.5 0
# iOS redondea solo: va cuadrado y sin transparencia.
generar apple-touch-icon 180 6.5 0
