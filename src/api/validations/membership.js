const Joi = require("joi");

module.exports = {

  createMembership: {
    body: Joi.object({
        member:Joi.string().required().regex(/^[a-fA-F0-9]{24}$/),
        equbType:Joi.string().required().regex(/^[a-fA-F0-9]{24}$/),
        equbLevel:Joi.string().required().regex(/^[a-fA-F0-9]{24}$/),
        uniqueId:Joi.string().required().regex(/^[a-fA-F0-9]{24}$/)
    }).options({ abortEarly: false })
  },

  getOne: {
    params: Joi.object({
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    }).options({ abortEarly: false }),
  },

  delteOne: {
    params: Joi.object({
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    }).options({ abortEarly: false }),
  },

};
