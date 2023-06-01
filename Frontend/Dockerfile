# Dockerfile del frontend

# Utilizamos una imagen base de NGINX
FROM nginx

# Copiamos los archivos estáticos al directorio de NGINX
COPY static /usr/share/nginx/html/static
COPY templates /usr/share/nginx/html/templates
COPY css /usr/share/nginx/html/css


# Copiamos el archivo de configuración de NGINX
COPY nginx.conf /etc/nginx/nginx.conf