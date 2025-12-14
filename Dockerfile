# ---------- Build Stage ----------
FROM node:25-alpine AS build
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
# Install dependencies
RUN npm ci
# Copy all source files
COPY . .
# Build the application
RUN npm run build

# Serve with nginx
FROM nginx:alpine
# Copy custom nginx config

# Install bash for env injection script
RUN apk add --no-cache bash

COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built app from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy env injection script
COPY env-inject.sh /docker-entrypoint.d/40-env-inject.sh
RUN chmod +x /docker-entrypoint.d/40-env-inject.sh

# nginx listens on port 80 by default
EXPOSE 80
