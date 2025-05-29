// bots/src/utils/Models/candidato.js
const db = require("../../../data/database");

// Função para inserir um novo candidato no banco
function inserirCandidato(dados, callback) {
  const query = `
    INSERT INTO candidatos (
      nome,
      telefone,
      email,
      nivel,
      area,
      produto_negocio,
      tecnologias,
      experiencias,
      formacao,
      disponibilidade,
      tipo_vaga,
      modelo_contratacao,
      salario,
      linkedin,
      cidade,
      resumo,
      data_cadastro
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    dados.nome,
    dados.telefone,
    dados.email,
    dados.nivel || '',
    dados.area || '',
    dados.produto_negocio || '',
    dados.tecnologias || '',
    dados.experiencias || '',
    dados.formacao || '',
    dados.disponibilidade || '',
    dados.tipo_vaga || '',
    dados.modelo_contratacao || '',
    dados.salario || '',
    dados.linkedin || '',
    dados.cidade || '',
    dados.resumo || '',
    new Date().toISOString()           // ← data_cadastro
  ];

  db.run(query, params, function (err) {
    if (err) {
      console.error("❌ Erro ao inserir candidato:", err.message);
      return callback(err);
    }
    console.log(`✅ Candidato inserido (ID: ${this.lastID})`);
    callback(null, { id: this.lastID });
  });
}

module.exports = { inserirCandidato };
