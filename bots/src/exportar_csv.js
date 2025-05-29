// bots/scripts/exportar_csv.js
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const db = require('../data/database');   // ajuste se seu driver estiver noutro lugar

db.all('SELECT * FROM candidatos', [], (err, rows) => {
  if (err) {
    console.error('❌ Erro ao ler candidatos:', err.message);
    db.close();
    return;
  }

  if (!rows.length) {
    console.warn('⚠️  Nenhum candidato encontrado.');
    db.close();
    return;
  }

  try {
    const parser = new Parser();
    const csv = parser.parse(rows);

    const outPath = path.join(__dirname, '..', '..', 'candidatos.csv');
    fs.writeFileSync(outPath, csv);
    console.log(`✅ CSV gerado em ${outPath}`);
  } catch (e) {
    console.error('❌ Erro ao gerar CSV:', e.message);
  } finally {
    db.close();
  }
});


