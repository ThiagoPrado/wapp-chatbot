// src/utils/perguntas.js

const perguntas = [
    {
      campo: "nome",
      texto: "1. Como que eu poderia te chamar? (Ex: João da Silva)\n"
    },
    {
      campo: "contato.telefone",
      texto: "2. Me confirma seu telefone (WhatsApp):\n"
    },
    {
      campo: "contato.email",
      texto: "   Agora, seu e-mail preferido:\n"
    },
    {
      campo: "nivel",
      texto: "3. Qual seu nível profissional? (Ex: Júnior, Pleno, Sênior, Tech Lead...)\n"
    },
    {
      campo: "area",
      texto: "4. Em qual área você atua ou gostaria de atuar? (Ex: Front, Back, Produto, Dados...)\n"
    },
    {
      campo: "produto_negocio",
      texto: "5. Em qual tipo de produto ou negócio você já atuou? (Ex: fintech, edtech, consultoria, plataforma...)\n"
    },
    {
      campo: "tecnologias",
      texto: "6. Me conta sobre suas experiências com tecnologias, ferramentas ou habilidades técnicas. (Ex: JavaScript, SQL, Cloud...)\n"
    },
    {
      campo: "experiencias",
      texto: "7. Conte brevemente suas experiências anteriores e os resultados alcançados.\n"
    },
    {
      campo: "formacao",
      texto: "8. Qual sua formação acadêmica? Possui alguma certificação relevante?\n"
    },
    {
      campo: "disponibilidade",
      texto: "9. Você está disponível em qual período do dia? (Manhã, Tarde, Noite, Integral)\n"
    },
    {
      campo: "tipo_vaga",
      texto: "10. Qual modelo de trabalho busca? (Presencial, Remoto, Híbrido)\n"
    },
    {
      campo: "modelo_contratacao",
      texto: "11. Você busca uma vaga CLT, PJ ou Freelancer?\n"
    },
    {
      campo: "salario",
      texto: "12. Qual sua pretensão salarial? Use R$ para reais, USD ou Euro. (Ex: R$10.000 ou USD7.000)\n"
    },
    {
      campo: "linkedin",
      texto: "13. Se tiver LinkedIn ou portfólio online, cole o link aqui 👇\n"
    }
  ];
  
  module.exports = { perguntas };

  function gerarResumo(respostas) {
    const {
      nivel,
      area,
      produto_negocio,
      tecnologias,
      experiencias,
      formacao,
      disponibilidade,
      tipo_vaga,
      modelo_contratacao,
      salario,
      linkedin,
      contato,
      nome
    } = respostas;
  
    return `
  📄 *Resumo Profissional - ${nome}*
  
  👤 *Nível*: ${nivel}
  🧩 *Área de Atuação*: ${area}
  🏢 *Produtos/Negócios*: ${produto_negocio}
  🛠️ *Principais Tecnologias*: ${tecnologias}
  📈 *Resumo de Experiências*: ${experiencias}
  🎓 *Formação*: ${formacao}
  🕒 *Disponibilidade*: ${disponibilidade}
  🌐 *Modelo de Vaga*: ${tipo_vaga}
  📝 *Tipo de Contratação*: ${modelo_contratacao}
  💰 *Pretensão Salarial*: ${salario || "Não informado"}
  🔗 *LinkedIn/Portfólio*: ${linkedin || "Não informado"}
  📍 *Contato*: ${contato.telefone} | ${contato.email}
    `;
  }
  