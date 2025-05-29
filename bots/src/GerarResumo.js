// services/gerarResumo.js
function gerarResumo(dados) {
  const nome = dados.nome || "Nome não informado";
  const localidade = dados.localidade || "Localidade não informada";
  const telefone = dados.contato?.telefone || "Telefone não informado";
  const email = dados.contato?.email || "E-mail não informado";
  const linkedin = dados.linkedin || "Não informado";
  const nivel = dados.nivel || "Nível não informado";
  const area = dados.area || "Área não informada";
  const produto = dados.produto_negocio || "Não informado";
  const tecnologias = dados.tecnologias || "Tecnologias não informadas";
  const experiencias = dados.experiencias || "Experiências não informadas";
  const formacao = dados.formacao || "Formação não informada";
  const disponibilidade = dados.disponibilidade || "Disponibilidade não informada";
  const tipo_vaga = dados.tipo_vaga || "Não informado";
  const modelo_contratacao = dados.modelo_contratacao || "Não informado";
  const salario = dados.salario || "Não informado";
  const exibirSalario = dados.exibir_salario?.toLowerCase() === "sim";

  return `
👤 Olá! Aqui está o perfil de ${nome}:

📍 Localidade: ${localidade}
📞 Telefone: ${telefone}
📧 E-mail: ${email}
🔗 LinkedIn/Portfólio: ${linkedin}

💼 Nível profissional: ${nivel}
🧠 Área de atuação: ${area}
🏢 Tipo de produto ou negócio: ${produto}
🛠️ Tecnologias e ferramentas: ${tecnologias}

📈 Experiências anteriores:
${experiencias}

🎓 Formação acadêmica e certificações:
${formacao}

🕐 Disponibilidade: ${disponibilidade}
📌 Modalidade de trabalho: ${tipo_vaga}
📄 Tipo de contratação desejada: ${modelo_contratacao}
💰 Pretensão salarial: ${exibirSalario ? salario : "Não autorizada para exibição"}

Esse perfil foi gerado pela Maya com base nas respostas do(a) candidato(a).
`.trim();
}

module.exports = gerarResumo;
