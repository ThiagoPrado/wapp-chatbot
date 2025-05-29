// services/respostas.js
function salvarResposta(dadosCandidato, campo, resposta) {
  const partes = campo.split(".");
  if (partes.length > 1) {
    const [categoria, subcampo] = partes;
    if (!dadosCandidato[categoria]) dadosCandidato[categoria] = {};
    dadosCandidato[categoria][subcampo] = resposta;
  } else {
    dadosCandidato[campo] = resposta;
  }
}

module.exports = salvarResposta;
