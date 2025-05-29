const db = require('../../db/db');
const CryptoJS = require('crypto-js'); // importa crypto-js

function obterCandidatoPorId(id) {
  return new Promise((resolve, reject) => {
    const secretKey = "prosync-secret-key"; // ⚠️ ideal usar variável de ambiente

    const sql = 'SELECT * FROM candidatos WHERE id = ?';

    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error('Erro ao buscar candidato:', err.message);
        reject(err);
      } else if (row) {
        // Descriptografa o e-mail, se existir
        try {
          const bytes = CryptoJS.AES.decrypt(row.email, secretKey);
          row.email = bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) {
          console.error('Erro ao descriptografar e-mail:', e.message);
          row.email = null; // fallback
        }

        resolve(row);
      } else {
        resolve(null); // candidato não encontrado
      }
    });
  });
}

module.exports = obterCandidatoPorId;
