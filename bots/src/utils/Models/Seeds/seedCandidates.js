// bots/src/utils/Models/Seeds/seedCandidates.js
const fs = require('fs');
const path = require('path');
const { inserirCandidato } = require('../candidato'); // ← modelo (arquivo em minúsculas)

/**
 * Lê candidates.json, percorre cada objeto e chama inserirCandidato.
 * Ao final, imprime quantos registros foram inseridos.
 */
(async () => {
  try {
    // ——— 1. Carregar dados-exemplo ———
    const filePath = path.join(__dirname, 'candidates.json');
    const candidatos = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!Array.isArray(candidatos) || !candidatos.length) {
      throw new Error('Arquivo candidates.json vazio ou inválido.');
    }

    // ——— 2. Inserir um por um ———
    for (const cand of candidatos) {
      await new Promise((resolve, reject) =>
        inserirCandidato(cand, (err) => (err ? reject(err) : resolve()))
      );
    }

    console.log(`✅ ${candidatos.length} candidatos inseridos com sucesso!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro no seed:', err.message || err);
    process.exit(1);
  }
})();
    