const db = require('../../db/db');
const dayjs = require('dayjs');
const CryptoJS = require('crypto-js'); // importa o crypto-js

function salvarCandidato(dados, resumo) {
  return new Promise((resolve, reject) => {
    const {
      nome,
      contato,
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
      localidade
    } = dados;

    const secretKey = "prosync-secret-key"; // ⚠️ ideal usar variável de ambiente futuramente
    const emailCriptografado = CryptoJS.AES.encrypt(contato?.email, secretKey).toString();

    const sql = `
      INSERT INTO candidatos (
        nome, telefone, email, nivel, area, produto_negocio, tecnologias,
        experiencias, formacao, disponibilidade, tipo_vaga, modelo_contratacao,
        salario, linkedin, cidade, resumo, data_cadastro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      nome,
      contato?.telefone,
      emailCriptografado, // <- e-mail já criptografado aqui
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
      localidade,
      resumo,
      dayjs().format('YYYY-MM-DD HH:mm:ss')
    ];

    db.run(sql, values, function (err) {
      if (err) {
        console.error('Erro ao salvar candidato:', err.message);
        reject(err);
      } else {
        console.log('Candidato salvo com ID:', this.lastID);
        resolve(this.lastID);
      }
    });
  });
}

module.exports = salvarCandidato;
