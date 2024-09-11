const Joi = require("joi");

module.exports = {

  createEqubLevel: {
    body: Joi.object({
    title: Joi.string().required().min(1).max(30),
    contribution: Joi.number().min(1).max(100000000).required(),
    }).options({ abortEarly: false }),
  },

  updateEqubLevel: {
    body: Joi.object({
    title: Joi.string().required().min(1).max(30),
    }).options({ abortEarly: false }),
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
