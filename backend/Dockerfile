# syntax=docker/dockerfile:1
# API y worker de Mostry para producción (Railway / Coolify). Dos destinos:
#   docker build --target api    -t mostry-api    backend/
#   docker build --target worker -t mostry-worker backend/
FROM node:24-bookworm-slim AS base
WORKDIR /app

# Dependencias completas para compilar TypeScript.
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

# Solo las dependencias de producción (sin Vitest, ESLint, supertest…).
FROM base AS deps-prod
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM base AS api
ENV NODE_ENV=production
COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD ["node", "-e", "fetch('http://127.0.0.1:'+(process.env.PUERTO||3000)+'/health').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"]
CMD ["node", "dist/server.js"]

# El worker hace los backups: necesita el cliente de MySQL (mysqldump y mysql).
FROM api AS worker
USER root
# Sin versión fija a propósito: así toma los parches de seguridad de Debian.
# hadolint ignore=DL3008
RUN apt-get update \
  && apt-get install -y --no-install-recommends default-mysql-client \
  && rm -rf /var/lib/apt/lists/*
USER node
HEALTHCHECK NONE
CMD ["node", "dist/worker/index.js"]
