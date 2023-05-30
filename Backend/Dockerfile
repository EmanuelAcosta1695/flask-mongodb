# Base image de Python
FROM python:3.11

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos requerimientos al contenedor
COPY requirements.txt .

# Instala las dependencias del proyecto
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto de los archivos al contenedor
COPY . .

# Expone el puerto en el que se ejecuta tu aplicación Flask
EXPOSE 5000

# Comando para ejecutar tu aplicación Flask
CMD ["python", "app.py"]