FROM node:18-slim

# Installiamo i tool necessari: git, docker.io e il plugin moderno di compose
RUN apt-get update && apt-get install -y \
    git \
    docker.io \
    docker-compose-plugin \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY server.js .

EXPOSE 8080

CMD ["node", "server.js"]
