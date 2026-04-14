FROM node:18-slim

# Installiamo git, il client docker e docker-compose
RUN apt-get update && apt-get install -y git docker.io docker-compose && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x serverDeploy.sh
EXPOSE 8080
CMD ["node", "server.js"]FROM node:18-slim

# Installiamo i tool necessari: git e client docker
RUN apt-get update && apt-get install -y \
    git \
    docker.io \
    docker-compose \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Installiamo le dipendenze
COPY package*.json ./
RUN npm install

# Copiamo il codice del server
COPY server.js .

# Il comando per avviare il pannello
EXPOSE 8080
CMD ["node", "server.js"]
