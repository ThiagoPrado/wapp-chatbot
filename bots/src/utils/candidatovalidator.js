const Joi = require("joi");

const candidatoSchema = Joi.object({
  nome: Joi.string().min(3).required(),
  contato: Joi.object({
    telefone: Joi.string().pattern(/^\+?[\d\s\-().]{10,}$/).required(),
    email: Joi.string().email().required(),
  }).required(),
  nivel: Joi.string().required(),
  area: Joi.string().required(),
  produto_negocio: Joi.string().required(),
  tecnologias: Joi.string().required(),
  experiencias: Joi.string().required(),
  formacao: Joi.string().required(),
  disponibilidade: Joi.string().required(),
  tipo_vaga: Joi.string().required(),
  modelo_contratacao: Joi.string().required(),
  salario: Joi.string().required(),
  linkedin: Joi.string().allow("", null),
  localidade: Joi.string().required(),
  exibir_salario: Joi.string().valid("sim", "não", "Sim", "Não").required(),
});

module.exports = candidatoSchema;
