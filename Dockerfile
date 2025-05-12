# Etapa de construcción
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Variables de entorno para tus microservicios
ENV VITE_EMPLEADO_API_URL=http://138.197.252.42:9001
ENV VITE_SERVICIO_API_URL=http://4.155.129.180:9000
ENV VITE_CITA_API_URL=http://4.155.108.182:9002

# Construir la aplicación
RUN npm run build
# Para depuración - ver qué archivos se generaron
RUN ls -la /app/dist
RUN ls -la /app/dist/assets || echo "No assets directory found"

# Etapa de producción
FROM nginx:alpine

# Copiar la configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos de construcción de Vite a nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Para depuración - listar archivos copiados
RUN ls -la /usr/share/nginx/html
RUN ls -la /usr/share/nginx/html/assets || echo "No assets directory found"

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]