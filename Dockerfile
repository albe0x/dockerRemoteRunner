FROM node:18-slim

# Installiamo i tool necessari
RUN apt-get update && apt-get install -y git docker.io docker-compose && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copia solo il server.js e i file del runner
COPY . .

# RIMOSSA la riga chmod +x serverDeploy.sh (perché il file non c'è ancora)

EXPOSE 8080
CMD ["node", "server.js"]
