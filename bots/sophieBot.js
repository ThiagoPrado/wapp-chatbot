// bots/sophieBot.js

const path = require('path');
const db = require(path.join(__dirname, 'data', 'database'));

// Estado de conversa por usuário (recrutadores)
const conversationState = {};

// Mensagens iniciais
const introducaoSophie = `👋 Olá! Eu sou a Sophie, assistente virtual de recrutamento.

Aqui você pode buscar candidatos cadastrados pela Maya de forma rápida e segmentada.

Vamos começar?`;

const instrucoesSophie = `⚡ Vou te ajudar a encontrar candidatos.

Responda às perguntas abaixo para definir seus filtros de busca. Se quiser cancelar a qualquer momento, digite 'cancelar'.`;

const recruiterQuestions = [
  { key: 'area', texto: '1) Qual a área de atuação buscada?' },
  { key: 'nivel', texto: '2) Qual o nível de experiência (júnior, pleno, sênior)?' },
  { key: 'cidade', texto: '3) Em qual cidade ou região deve atuar?' },
  { key: 'tecnologias', texto: '4) Quais tecnologias (linguagens, frameworks) são obrigatórias?' },
  { key: 'experiencias', texto: '5) Qual a experiência mínima (anos ou projetos)?' },
  { key: 'formacao', texto: '6) Qual a formação acadêmica obrigatória?' },
  { key: 'disponibilidade', texto: '7) Qual a disponibilidade de início?' },
  { key: 'tipo_vaga', texto: '8) Qual o tipo de vaga (CLT, PJ, estágio)?' },
  { key: 'modelo_contratacao', texto: '9) Qual o modelo de trabalho (remoto, híbrido, presencial)?' },
  { key: 'salario', texto: '10) Qual a faixa salarial desejada?' },
  { key: 'produto_negocio', texto: '11) Em que produto/negócio o candidato vai atuar?' },
];

async function startSophieFlow(client, message) {
  const userId = message.from;
  const text = (message.body || '').trim().toLowerCase();

  if (!conversationState[userId]) {
    conversationState[userId] = { step: 'intro', filtros: {}, currentQuestionIndex: 0 };
    return client.sendMessage(userId, introducaoSophie);
  }

  if (text === 'cancelar') {
    delete conversationState[userId];
    return client.sendMessage(userId, "🛑 Busca cancelada. Se quiser reiniciar, digite 'oi'.");
  }

  const state = conversationState[userId];
  switch (state.step) {
    case 'intro':
      await client.sendMessage(userId, instrucoesSophie);
      state.step = 'perguntas';
      return client.sendMessage(userId, recruiterQuestions[0].texto);

    case 'perguntas':
      return processarFiltro(client, userId, (message.body || '').trim(), state);

    case 'busca':
      return processarBusca(client, userId, text, state);
  }
}

async function processarFiltro(client, userId, resposta, state) {
  const pergunta = recruiterQuestions[state.currentQuestionIndex];
  state.filtros[pergunta.key] = resposta;
  state.currentQuestionIndex++;

  if (state.currentQuestionIndex < recruiterQuestions.length) {
    return client.sendMessage(userId, recruiterQuestions[state.currentQuestionIndex].texto);
  }

  state.step = 'busca';
  const f = state.filtros;
  const resumoText =
    `🔍 Filtros definidos:\n` +
    `• Área: ${f.area}\n` +
    `• Nível: ${f.nivel}\n` +
    `• Cidade: ${f.cidade}\n` +
    `• Tecnologias: ${f.tecnologias}\n` +
    `• Experiência: ${f.experiencias}\n` +
    `• Formação: ${f.formacao}\n` +
    `• Disponibilidade: ${f.disponibilidade}\n` +
    `• Tipo de vaga: ${f.tipo_vaga}\n` +
    `• Modelo: ${f.modelo_contratacao}\n` +
    `• Salário: ${f.salario}\n` +
    `• Produto/Negócio: ${f.produto_negocio}\n\n` +
    `Digite 'listar' para ver os candidatos ou 'cancelar' para sair.`;

  return client.sendMessage(userId, resumoText);
}

async function processarBusca(client, userId, comando, state) {
  const f = state.filtros;

  if (comando === 'listar') {
    db.all(
      `SELECT id, nome, nivel, area, cidade, resumo
       FROM candidatos
       WHERE lower(area) = ?
         AND lower(nivel) = ?
         AND lower(cidade) LIKE ?
         AND lower(tecnologias) LIKE ?
         AND lower(experiencias) LIKE ?
         AND lower(formacao) LIKE ?
         AND lower(disponibilidade) = ?
         AND lower(tipo_vaga) = ?
         AND lower(modelo_contratacao) = ?
         AND lower(salario) LIKE ?
         AND lower(produto_negocio) LIKE ?`,
      [
        f.area.toLowerCase(),
        f.nivel.toLowerCase(),
        `%${f.cidade.toLowerCase()}%`,
        `%${f.tecnologias.toLowerCase()}%`,
        `%${f.experiencias.toLowerCase()}%`,
        `%${f.formacao.toLowerCase()}%`,
        f.disponibilidade.toLowerCase(),
        f.tipo_vaga.toLowerCase(),
        f.modelo_contratacao.toLowerCase(),
        `%${f.salario.toLowerCase()}%`,
        `%${f.produto_negocio.toLowerCase()}%`
      ],
      async (err, rows) => {
        if (err) {
          console.error('Erro na busca:', err);
          return client.sendMessage(userId, '❌ Erro ao buscar candidatos.');
        }
        if (!rows.length) {
          return client.sendMessage(userId, '🔎 Nenhum candidato encontrado. Digite "reiniciar" ou "cancelar".');
        }
        for (const c of rows) {
          await client.sendMessage(
            userId,
            `📄 ID: ${c.id}\nNome: ${c.nome}\nNível: ${c.nivel}\nÁrea: ${c.area}\nCidade: ${c.cidade}\nResumo: ${c.resumo}`
          );
        }
        return client.sendMessage(userId, '✅ Fim da lista. Digite "reiniciar" ou "cancelar".');
      }
    );
  }
  else if (comando === 'reiniciar') {
    delete conversationState[userId];
    return startSophieFlow(client, { from: userId, body: 'oi' });
  }
  else {
    return client.sendMessage(userId, 'Digite "listar", "reiniciar" ou "cancelar".');
  }
}

module.exports = {
  startSophieFlow,
  conversationState
};
