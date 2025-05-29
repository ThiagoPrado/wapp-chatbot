// bots/maya.js

const fs = require('fs');
const path = require('path');

// Banco de dados SQLite
const db = require(path.join(__dirname, 'data', 'database'));

// Utilitários: validadores e perguntas
const validadores = require(path.join(__dirname, 'src', 'utils', 'validadores'));
const { perguntas } = require(path.join(__dirname, 'src', 'utils', 'perguntas'));

// Serviço de geração de resumo
const gerarResumo = require(path.join(__dirname, 'src', 'GerarResumo'));

// Storage unificado (banco + cache JSON)
const { saveCandidato, obterCandidatoPorId } = require(path.join(__dirname, 'Storage', 'candidatoStorage'));

// Estado de conversa por usuário
const conversationState = {};

const introducaoMaya = `👋 Olá! Eu sou a Maya, assistente virtual de recrutamento.

Vou te ajudar a criar seu perfil profissional para conectar você com as melhores oportunidades.

É rápido e simples. Vamos começar?`;

const instrucoesMaya = `⚡ Vou te fazer algumas perguntas para preencher seu perfil.
Responda com suas informações ou digite "cancelar" para sair a qualquer momento.`;

async function startMayaFlow(client, message) {
  const userId = message.from;
  const text = (message.body || '').trim();
  const lower = text.toLowerCase();

  if (!conversationState[userId]) {
    conversationState[userId] = { step: 'intro', dadosCandidato: {}, currentQuestionIndex: 0 };
    await client.sendMessage(userId, introducaoMaya);
    return;
  }

  if (lower === 'cancelar') {
    delete conversationState[userId];
    return client.sendMessage(userId, "🛑 Cadastro cancelado. Digite 'oi' para recomeçar.");
  }

  const state = conversationState[userId];
  switch (state.step) {
    case 'intro':
      await client.sendMessage(userId, instrucoesMaya);
      state.step = 'perguntas';
      return client.sendMessage(userId, perguntas[0].texto);

    case 'perguntas':
      return processarResposta(client, message, state);

    case 'resumo':
      return processarConfirmacaoResumo(client, message, state);

    case 'aguardando_cv':
      return processarEnvioCurriculo(client, message, state);
  }
}

async function processarResposta(client, message, state) {
  const userId = message.from;
  const resposta = (message.body || '').trim();
  const pergunta = perguntas[state.currentQuestionIndex];

  if (pergunta.campo === 'contato.telefone' && !validadores.validarTelefone(resposta)) {
    return client.sendMessage(userId, "⚠️ Telefone inválido. Digite novamente.");
  }
  if (pergunta.campo === 'contato.email') {
    if (!validadores.validarEmail(resposta)) {
      return client.sendMessage(userId, "⚠️ E-mail inválido. Digite novamente.");
    }
    const exists = await obterCandidatoPorId(resposta);
    if (exists) {
      delete conversationState[userId];
      return client.sendMessage(userId, "⚠️ E-mail já cadastrado. Contate suporte.");
    }
  }

  const [topo, sub] = pergunta.campo.split('.');
  if (sub) {
    state.dadosCandidato[topo] = state.dadosCandidato[topo] || {};
    state.dadosCandidato[topo][sub] = resposta;
  } else {
    state.dadosCandidato[pergunta.campo] = resposta;
  }

  state.currentQuestionIndex++;
  if (state.currentQuestionIndex < perguntas.length) {
    return client.sendMessage(userId, perguntas[state.currentQuestionIndex].texto);
  }

  state.step = 'resumo';
  state.resumo = gerarResumo(state.dadosCandidato);
  await client.sendMessage(userId, "🔎 RESUMO DO SEU PERFIL:");
  await client.sendMessage(userId, state.resumo);
  await client.sendMessage(userId, "Os dados estão corretos? Responda 'sim' ou 'não'.");
}

async function processarConfirmacaoResumo(client, message, state) {
  const userId = message.from;
  const lower = (message.body || '').trim().toLowerCase();

  if (lower === 'sim') {
    state.step = 'aguardando_cv';
    return client.sendMessage(userId, "📎 Agora envie seu currículo em PDF ou digite 'pular'.");
  }
  if (lower === 'não') {
    state.step = 'perguntas';
    state.dadosCandidato = {};
    state.currentQuestionIndex = 0;
    await client.sendMessage(userId, "🔄 Recomeçando...");
    return client.sendMessage(userId, perguntas[0].texto);
  }
  return client.sendMessage(userId, "Responda apenas 'sim' ou 'não'.");
}

async function processarEnvioCurriculo(client, message, state) {
  const userId = message.from;

  if (message.hasMedia) {
    const media = await message.downloadMedia();
    if (media.mimetype === 'application/pdf') {
      const buffer = Buffer.from(media.data, 'base64');
      const pasta = path.join(__dirname, 'data', 'cvs');
      if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });
      const arquivo = `${userId}-${Date.now()}.pdf`;
      fs.writeFileSync(path.join(pasta, arquivo), buffer);
      await client.sendMessage(userId, "✅ Currículo recebido!");
      return finalizarCadastro(client, userId, state);
    }
  }

  const lower = (message.body || '').trim().toLowerCase();
  if (lower === 'pular') {
    return finalizarCadastro(client, userId, state);
  }
  return client.sendMessage(userId, "⚠️ Envie um PDF válido ou digite 'pular'.");
}

async function finalizarCadastro(client, userId, state) {
  try {
    await saveCandidato(state.dadosCandidato, state.resumo);
    delete conversationState[userId];
    return client.sendMessage(userId, "🎉 Perfil finalizado com sucesso!");
  } catch (err) {
    console.error('Erro ao salvar candidato:', err);
    return client.sendMessage(userId, "❌ Erro ao salvar. Tente novamente mais tarde.");
  }
}

module.exports = {
  startMayaFlow,
  conversationState
};
