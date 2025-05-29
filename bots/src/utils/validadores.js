// utils/validadores.js

// Validador de email
function validarEmail(email) {
    const regex = /^[\w._-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email.trim());
  }
  
  // Validador de telefone
  function validarTelefone(telefone) {
    // Regex para telefones brasileiros com ou sem DDD e com ou sem o +55
    const regex = /^\+?(\d{1,3})?\s?(\(?\d{2}\)?)?\s?\d{4,5}-?\d{4}$/;
    return regex.test(telefone.trim());
  }
  
  // Validador de nome
  function validarNome(nome) {
    // Garante pelo menos duas palavras (com acentos, se necessário)
    const regex = /^[a-zA-ZÀ-ÿ]+(?:\s[a-zA-ZÀ-ÿ]+)+$/;
    return regex.test(nome.trim());
  }
  
  // Função genérica de validação (opcional, se quiser usar em outros lugares depois)
  function validarCampo(tipo, valor) {
    switch (tipo) {
      case "email":
        return validarEmail(valor) ? null : "E-mail inválido.";
      case "telefone":
        return validarTelefone(valor) ? null : "Telefone inválido.";
      case "nome":
        return validarNome(valor) ? null : "Nome inválido. Deve ter pelo menos 2 palavras.";
      default:
        return "Tipo de campo não reconhecido.";
    }
  }
  
  module.exports = {
    validarEmail,
    validarTelefone,
    validarNome,
    validarCampo
  };
  