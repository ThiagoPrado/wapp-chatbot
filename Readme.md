# WAPP-CHATBOT

Este projeto implementa dois chatbots no WhatsApp via [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js): **Maya** (para candidatos) e **Sophie** (para recrutadores).

---

## 1. Pré-requisitos

* Node.js v22.x
* npm v10.x
* Docker & Docker Compose (opcional para containerização)

---

## 2. Instalação local

1. Clone este repositório:

   ```bash
   git clone <repo-url>
   cd wapp-chatbot
   ```
2. Instale dependências:

   ```bash
   npm install
   ```
3. Copie o `.env.example` para `.env` e ajuste as variáveis:

   ```env
   # .env
   # WhatsApp Web.js LocalAuth client ID
   CLIENT_ID=wapp-chatbot
   # Qualquer outra variável de configuração futura
   ```
4. Execute localmente:

   ```bash
   node index.js
   ```
5. Na primeira execução, será exibido um QR Code ASCII no terminal. Abra o WhatsApp no celular e vá em **Configurações > Aparelhos conectados > Conectar um aparelho** e escaneie o código.

---

## 3. Seeds e Export

* Para popular o banco com candidatos de exemplo:

  ```bash
  node bots/src/utils/Models/Seeds/seedCandidates.js
  ```
* Para exportar todos candidatos para CSV:

  ```bash
  node bots/src/exportar_csv.js
  ```

---

## 4. Executando com Docker

### 4.1. Construir a imagem

```bash
docker compose build --no-cache
```

### 4.2. Subir o container

```bash
docker compose up
```

* O serviço usará o Chromium instalado no container. Não é necessário nenhum browser local.
* Em 30–60s, o QR Code ASCII aparecerá no console. Escaneie como no passo local.

### 4.3. Variáveis de ambiente no Docker

Caso queira passar variáveis adicionais via Compose, defina no `docker-compose.yml`:

```yaml
services:
  chatbot:
    environment:
      - CLIENT_ID=wapp-chatbot
    volumes:
      - ./.wwebjs_auth:/app/.wwebjs_auth
```

---

## 5. Estrutura do Projeto

```
/
├─ bots/           # Lógica dos chatbots Maya e Sophie
│  ├─ maya.js      # Fluxo de conversas para candidatos
│  └─ sophieBot.js # Fluxo de conversas para recrutadores
├─ storage/        # Scripts de seed e export
│  └─ exportar_csv.js
├─ tests/          # Testes unitários com Jest
├─ index.js        # Ponto de entrada do bot
├─ Dockerfile      # Configuração para containerização
├─ docker-compose.yml
└─ README.md       # Este arquivo
```

---

## 6. Próximos passos

* **Melhorias de UX** e validações (telefone, e-mail, máscaras)
* **Monitoramento e logs** com Pino e alertas
* **Integração com WhatsApp Business API** (swap de provider)

---

*Desenvolvido seguindo práticas de Clean Code e TDD.*
