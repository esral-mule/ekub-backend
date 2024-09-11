const Joi = require("joi");

module.exports = {

  createContribution: {
    body: Joi.object({
        round:Joi.string().required().regex(/^[a-fA-F0-9]{24}$/),
        member:Joi.string().required().regex(/^[a-fA-F0-9]{24}$/),
        isPaid:Joi.boolean()
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
