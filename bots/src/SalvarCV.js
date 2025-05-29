// src/services/salvarCurriculo.js
const fs = require('fs');
const path = require('path');

/**
 * Salva o currículo enviado em PDF.
 * @param {string} userId - Número do WhatsApp (ex: '5511999999999')
 * @param {Buffer} fileBuffer - Arquivo binário em PDF
 * @returns {string} Caminho salvo
 */
function salvarCurriculo(userId, fileBuffer) {
  const fileName = `${userId}_${Date.now()}.pdf`;
  const dir = path.join(__dirname, '../../storage/curriculos');
  const filePath = path.join(dir, fileName);

  fs.writeFileSync(filePath, fileBuffer);
  return filePath;
}

module.exports = salvarCurriculo;
