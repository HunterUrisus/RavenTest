FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Comando para iniciar React (ajusta si usas Vite o CRA)
CMD ["npm", "start"]