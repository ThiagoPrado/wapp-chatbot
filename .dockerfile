# Dockerfile

FROM node:22-bullseye-slim

# 1) Instala Chromium + libs gráficas mínimas
RUN apt-get update && apt-get install -y --no-install-recommends \
      chromium \
      fonts-liberation \
      libatk1.0-0 \
      libatk-bridge2.0-0 \
      libcups2 \
      libdbus-1-3 \
      libdrm2 \
      libgbm1 \
      libgtk-3-0 \
      libnspr4 \
      libnss3 \
      libxcomposite1 \
      libxdamage1 \
      libxrandr2 \
      xdg-utils \
      sqlite3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2) Copia e instala somente as deps de produção
COPY package*.json ./
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm install --omit=dev --no-audit --no-fund

# 3) Copia seu código
COPY . .

# 4) Aponta para o binário do Chromium instalado pelo apt
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

CMD ["node", "index.js"]
