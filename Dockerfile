FROM node:18-slim

# 1. Installiamo i tool di sistema necessari
# Utilizziamo docker-compose-v2 per evitare bug di compatibilità (ContainerConfig error)
RUN apt-get update && apt-get install -y \
    git \
    docker.io \
    docker-compose-v2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2. Gestione dipendenze Node.js
COPY package*.json ./
RUN npm install

# 3. Copia del codice del server del Runner
COPY server.js .

# Nota: Non facciamo chmod qui perché serverDeploy.sh viene scaricato 
# via git solo quando premi il pulsante sul browser.

EXPOSE 8080

CMD ["node", "server.js"]
