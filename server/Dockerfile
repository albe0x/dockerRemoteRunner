FROM node:18-slim

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
CMD ["node", "--env-file=.env", "server.js"]