const db = require("./database");
const readline = require("readline");
const CryptoJS = require("crypto-js"); // integração

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Chave secreta para criptografia (você pode mover para uma variável de ambiente)
const SECRET_KEY = "prosync_secret_key_2025";

// Função para criptografar dados sensíveis
const criptografar = (dado) => {
  return CryptoJS.AES.encrypt(dado, SECRET_KEY).toString();
};

// Função auxiliar para perguntar via terminal
const perguntar = (pergunta) => {
  return new Promise((resolve) => rl.question(pergunta, resolve));
};

(async () => {
  console.log("\n🔎 Vamos filtrar os candidatos?");
  const cidade = await perguntar("📍 Cidade (pressione Enter para ignorar): ");
  const area = await perguntar("💼 Área (pressione Enter para ignorar): ");
  const nivel = await perguntar("📈 Nível (pressione Enter para ignorar): ");

  // Monta a consulta com base nos filtros informados
  let sql = `
    SELECT id, nome, telefone, email, nivel, area, cidade, tipo_vaga, modelo_contratacao, salario
    FROM candidatos
    WHERE 1 = 1
  `;
  const params = [];

  if (cidade) {
    sql += " AND cidade LIKE ?";
    params.push(`%${cidade}%`);
  }

  if (area) {
    sql += " AND area LIKE ?";
    params.push(`%${area}%`);
  }

  if (nivel) {
    sql += " AND nivel LIKE ?";
    params.push(`%${nivel}%`);
  }

  sql += " ORDER BY id DESC";

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("Erro ao buscar candidatos:", err.message);
      rl.close();
      return;
    }

    if (rows.length === 0) {
      console.log("\n⚠️ Nenhum candidato encontrado com esses filtros.");
    } else {
      console.log(`\n📋 ${rows.length} candidato(s) encontrado(s):\n`);
      rows.forEach((candidato, index) => {
        const telefoneCripto = criptografar(candidato.telefone);
        const emailCripto = criptografar(candidato.email);

        console.log(`🔹 Candidato #${index + 1}`);
        console.log(`   🧑 Nome: ${candidato.nome}`);
        console.log(`   📞 Telefone (criptografado): ${telefoneCripto}`);
        console.log(`   📧 Email (criptografado): ${emailCripto}`);
        console.log(`   💼 Nível: ${candidato.nivel}`);
        console.log(`   📊 Área: ${candidato.area}`);
        console.log(`   🌍 Cidade: ${candidato.cidade}`);
        console.log(`   💻 Tipo de vaga: ${candidato.tipo_vaga}`);
        console.log(`   📝 Modelo de contratação: ${candidato.modelo_contratacao}`);
        console.log(`   💰 Pretensão Salarial: ${candidato.salario}\n`);
      });
    }

    rl.close();
  });
})();
