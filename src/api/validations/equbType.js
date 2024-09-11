const Joi = require("joi");
const { ROLES } = require("../../utils/constants");

module.exports = {
  // POST /v1/users
  createEqubType: {
    body: Joi.object({
      name: Joi.string().required().min(5).max(35),
      contributionDay: Joi.number().min(1).max(365),
      lotteryDay: Joi.number().min(1).max(365),
      contribution: Joi.number().min(1).required(),
      maxUniqueIds: Joi.number().min(2).max(200).required(),
    }).options({ abortEarly: false }),
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
