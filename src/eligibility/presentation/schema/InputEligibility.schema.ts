import Joi from "joi"

export const  InputEligibilitySchema = Joi.object({
     numeroDoDocumento: Joi.string().required(),
     tipoDeConexao: Joi.string().valid('monofasico', 'bifasico', 'trifasico').required(),
     classeDeConsumo: Joi.string().valid('comercial','residencial','industrial', 'rural', 'poder publico').required(),
     modalidadeTarifaria: Joi.string().valid('branca', 'azul', 'verde', 'convencional').required(),
     historicoDeConsumo: Joi.array().items(Joi.number()).max(12).min(12).required(),
});
     