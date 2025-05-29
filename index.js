// index.js

require('dotenv').config();
const express = require('express');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

// Importa funções e estados
const { startMayaFlow, conversationState: mayaState } = require('./bots/maya');
const { startSophieFlow, conversationState: sophieState } = require('./bots/sophieBot');

async function initWhatsApp() {
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

function initHealthServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Healthcheck simples
  app.get('/health', (req, res) => {
    // Aqui você pode adicionar checagens de DB, etc.
    return res.status(200).json({ status: 'ok' });
  });

  app.listen(PORT, () => {
    console.log(`🚑 Health endpoint rodando em http://localhost:${PORT}/health`);
  });
}

// Inicializa ambos
initHealthServer();
initWhatsApp().catch(err => console.error(err));
