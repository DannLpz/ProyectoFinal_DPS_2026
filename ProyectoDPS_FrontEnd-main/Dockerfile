# ---------- Etapa 1: Build de Expo Web ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Compilamos la versión web de Expo
RUN npx expo export --platform web

# ---------- Etapa 2: Servir con Nginx ----------
FROM nginx:alpine

# Copiamos la build de Expo al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración para que React Native Web funcione (SPA routing)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]