const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o arquivo do banco de dados
const dbPath = path.resolve(__dirname, 'candidatos.sqlite');

// Cria conexão com o banco
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco SQLite com sucesso!');
  }
});

// Cria tabela candidatos, se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS candidatos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      telefone TEXT,
      email TEXT,
      nivel TEXT,
      area TEXT,
      produto_negocio TEXT,
      tecnologias TEXT,
      experiencias TEXT,
      formacao TEXT,
      disponibilidade TEXT,
      tipo_vaga TEXT,
      modelo_contratacao TEXT,
      salario TEXT,
      linkedin TEXT,
      cidade TEXT,
      resumo TEXT,
      data_cadastro TEXT
    )
  `);
});

module.exports = db;
