// bots/Storage/candidatoStorage.js
// Módulo para salvar candidatos no banco SQLite e em cache local JSON

const fs = require('fs');
const path = require('path');
// Ajuste de import: a conexão com o DB está em bots/data/database.js
const db = require(path.join(__dirname, '..', 'data', 'database'));

const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

async function saveCandidato(dados, resumo) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO candidatos (
        nome, telefone, email, nivel, area, produto_negocio,
        tecnologias, experiencias, formacao, disponibilidade,
        tipo_vaga, modelo_contratacao, salario, linkedin,
        cidade, resumo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      dados.nome || "",
      dados.contato?.telefone || "",
      dados.contato?.email || "",
      dados.nivel || "",
      dados.area || "",
      dados.produto_negocio || "",
      dados.tecnologias || "",
      dados.experiencias || "",
      dados.formacao || "",
      dados.disponibilidade || "",
      dados.tipo_vaga || "",
      dados.modelo_contratacao || "",
      dados.salario || "",
      dados.linkedin || "",
      dados.localidade || "",
      resumo || ""
    ];

    db.run(sql, params, function(err) {
      if (err) {
        console.error("❌ Erro ao salvar no banco:", err.message);
        return reject(err);
      }
      const id = this.lastID;
      console.log(`✅ Candidato salvo com ID ${id} no banco.`);

      const cacheObj = { id, ...dados, resumo };
      const filePath = path.join(cacheDir, `${id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(cacheObj, null, 2), 'utf-8');

      const masterFile = path.join(cacheDir, 'all_candidates.json');
      let all = [];
      if (fs.existsSync(masterFile)) {
        try { all = JSON.parse(fs.readFileSync(masterFile, 'utf-8')); } catch {
          all = [];
        }
      }
      const idx = all.findIndex(c => c.id === id);
      if (idx !== -1) all[idx] = cacheObj;
      else all.push(cacheObj);
      fs.writeFileSync(masterFile, JSON.stringify(all, null, 2), 'utf-8');

      resolve(id);
    });
  });
}

async function obterCandidatoPorId(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM candidatos WHERE id = ?", [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

module.exports = { saveCandidato, obterCandidatoPorId };
