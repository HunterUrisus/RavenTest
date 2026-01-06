FROM node:22-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código (aunque el volumen en docker-compose lo sobreescribirá en dev)
COPY . .

# Exponemos el puerto (asegúrate de que tu app escuche en este puerto)
EXPOSE 3001

# Comando por defecto para desarrollo
CMD ["npm", "run", "dev"]
