FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Comando para iniciar React (ajusta si usas Vite o CRA)
CMD ["npm", "run", "dev"]
