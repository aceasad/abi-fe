FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm ci

COPY . /app/
RUN npm run build


FROM nginx:1-alpine

COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /app/

