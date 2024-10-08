const Joi = require("joi");

module.exports = {

  createBeneficiary: {
    body: Joi.object({
        uniqueId:Joi.string().required().regex(/^[a-fA-F0-9]{24}$/),
    }).options({ abortEarly: false })
  },

  getOne: {
    params: Joi.object({
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    }).options({ abortEarly: false }),
  },

  deleteOne: {
    params: Joi.object({
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    }).options({ abortEarly: false }),
  },

};
