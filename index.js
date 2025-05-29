// index.js

// Polyfill para Object.hasOwn (se ainda estiver usando Node antigo, pode remover após a atualização)
if (!Object.hasOwn) {
  Object.hasOwn = (obj, prop) =>
    Object.prototype.hasOwnProperty.call(obj, prop);
}

require('dotenv').config();
const express = require('express');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

// Importa funções e estados dos bots
const { startMayaFlow, conversationState: mayaState } = require('./bots/maya');
const { startSophieFlow, conversationState: sophieState } = require('./bots/sophieBot');

const app = express();
const PORT = process.env.PORT || 3000;

// Healthcheck endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Starta o servidor Express
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚑 Health endpoint rodando em http://0.0.0.0:${PORT}/health`);
  // Só inicializa o client do WhatsApp depois que o Express estiver ativo
  initWhatsappClient();
});

async function initWhatsappClient() {
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'wapp-chatbot' }),
    puppeteer: {
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH, // Ex: /usr/bin/chromium
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-features=RendererCodeIntegrity'
      ]
    }
  });

  client.on('auth_failure', msg => {
    console.error('❌ Falha de autenticação:', msg);
  });

  client.on('disconnected', reason => {
    console.warn('⚠️ Desconectado:', reason);
    client.initialize();
  });

  client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('▶️ Escaneie este QR no WhatsApp (Configurações → Aparelhos conectados).');
  });

  client.on('ready', () => {
    console.log('✅ WhatsApp Web.js pronto!');
  });

  client.on('message', async message => {
    if (message.fromMe) return;

    const from  = message.from;
    const body  = (message.body || '').trim();
    const lower = body.toLowerCase();

    // Roteamento Maya
    if (mayaState[from] || lower.startsWith('candidato')) {
      return startMayaFlow(client, message);
    }

    // Roteamento Sophie
    if (sophieState[from] || lower.startsWith('recrutador')) {
      return startSophieFlow(client, message);
    }

    // Saudação inicial
    if (['oi', 'olá', 'ola'].includes(lower)) {
      return client.sendMessage(
        from,
        '👋 Digite *Candidato* para Maya ou *Recrutador* para Sophie.'
      );
    }

    // Fallback
    return client.sendMessage(from, 'Desculpe, não entendi. Envie "oi".');
  });

  client.initialize();
}
