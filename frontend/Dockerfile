FROM node:20-alpine as base

FROM base AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY src ./src
COPY next.config.mjs .
COPY tsconfig.json .
RUN npm run build
CMD npm run start
