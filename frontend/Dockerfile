# syntax=docker/dockerfile:1
# Frontend de Mostry para producción: build de Vite + servidor estático propio
# (servidor/servir.js) con la CSP y los encabezados de encabezados.config.js.
# Las VITE_* se fijan al compilar (van dentro del JS): se pasan como --build-arg.
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_DOMINIO_BASE
ARG VITE_API_URL
ARG VITE_ORIGEN_ARCHIVOS
ARG VITE_WHATSAPP_MOSTRY
RUN npm run build

FROM node:24-bookworm-slim AS web
WORKDIR /app
ENV NODE_ENV=production
COPY package.json encabezados.config.js ./
COPY config/temaEnLinea.js config/tema-inicial.js ./config/
COPY servidor ./servidor
COPY --from=build /app/dist ./dist
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s \
  CMD ["node", "-e", "fetch('http://127.0.0.1:'+(process.env.PUERTO||8080)+'/salud').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"]
CMD ["node", "servidor/servir.js"]
