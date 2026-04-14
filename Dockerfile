FROM node:18-slim

# Installiamo curl e git
RUN apt-get update && apt-get install -y git curl && rm -rf /var/lib/apt/lists/*

# Scarichiamo il binario statico di Docker Compose (v2.26.1)
RUN curl -L "https://github.com/docker/compose/releases/download/v2.26.1/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose \
    && ln -s /usr/local/bin/docker-compose /usr/local/bin/docker

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8080
CMD ["node", "server.js"]
