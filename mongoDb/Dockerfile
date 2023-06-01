# Utilizamos una imagen base de MongoDB
FROM mongo:latest

# Etiqueta de información del creador
LABEL maintainer="Emanuel"

# Copiamos archivos de inicialización a la imagen
# COPY init.js /docker-entrypoint-initdb.d/

# Exponemos el puerto por defecto de MongoDB (27017)
EXPOSE 27017

# Ejecutamos el comando de inicio de MongoDB proporcionado por la imagen base
CMD ["mongod"]