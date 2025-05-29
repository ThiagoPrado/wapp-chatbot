// src/database.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Caminho absoluto para o banco de dados
const dbPath = path.resolve(__dirname, "maya.db");

// Conexão com o banco
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco de dados:", err.message);
  } else {
    console.log("✅ Conectado ao banco de dados SQLite com sucesso.");
  }
});

// Criação da tabela de candidatos, se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS candidatos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL,
      email TEXT NOT NULL,
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
      data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error("❌ Erro ao criar a tabela 'candidatos':", err.message);
    } else {
      console.log("📄 Tabela 'candidatos' pronta para uso.");
    }
  });
});

module.exports = db;
