FROM node:18-slim

# Installiamo i tool necessari e il client Docker ufficiale per Debian
RUN apt-get update && apt-get install -y git curl docker.io && rm -rf /var/lib/apt/lists/*

# Scarichiamo il binario di Docker Compose V2
RUN curl -L "https://github.com/docker/compose/releases/download/v2.26.1/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8080
CMD ["node", "server.js"]
