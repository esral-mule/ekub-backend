const Joi = require("joi");

module.exports = {
  login: {
    body: Joi.object({
      phoneNumber: Joi.string()
        .max(13)
        .min(10)
        .required(),
      password: Joi.string().min(6).max(128).required(),
    }).options({
      abortEarly: false,
    }),
  },
};
