FROM node:18-slim

# Installiamo solo git (necessario per il clone)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY server.js .

EXPOSE 8080
CMD ["node", "server.js"]
