const Joi = require("joi");

module.exports = {
  login: {
    body: Joi.object({
      phoneNumber: Joi.string().max(13).min(10).required(),
      password: Joi.string().min(6).max(128).required(),
    }).options({
      abortEarly: false,
    }),
  },
  createMember: {
    body: Joi.object({
      fullName: Joi.string().required().min(5).max(35),
      phoneNumber: Joi.string().max(13).min(10).required(),
      password: Joi.string().min(6).max(128).required(),
      username: Joi.string().min(5).max(35),
      profilePicture: Joi.string().min(5).max(100),
      house: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required()
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
