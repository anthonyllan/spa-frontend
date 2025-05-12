# Etapa de construcción
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Variables de entorno para tus microservicios (usando rutas relativas)
ENV VITE_EMPLEADO_API_URL=/empleado-api
ENV VITE_SERVICIO_API_URL=/servicio-api
ENV VITE_CITA_API_URL=/cita-api

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

# Copiar explícitamente los favicons a la raíz del sitio
COPY --from=build /app/public/favicon.ico /usr/share/nginx/html/favicon.ico
COPY --from=build /app/public/favicon.png /usr/share/nginx/html/favicon.png
COPY --from=build /app/public/apple-touch-icon.png /usr/share/nginx/html/apple-touch-icon.png

# Para depuración - listar archivos copiados
RUN ls -la /usr/share/nginx/html
RUN ls -la /usr/share/nginx/html/assets || echo "No assets directory found"
# Verificar que los favicon estén presentes
RUN ls -la /usr/share/nginx/html/favicon* || echo "No favicon files found"

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]