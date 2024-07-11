const Joi = require('joi');

module.exports = {
  // POST /v1/auth/login
  Login: {
    body: Joi.object({
      phoneNumber: Joi.string().required(),
      password: Joi.string().required().min(6).max(128),
    }).options({ abortEarly: false }),
  },

  // POST /v1/auth/register
  Register: {
    body: Joi.object({
      fullName: Joi.string().required().min(2).max(30),
      phoneNumber: Joi.string().min(10).max(13).required(),
      username: Joi.string().min(4).max(13),
      password: Joi.string().required().min(6).max(128),
      equbName: Joi.string().required().min(6),
    }).options({ abortEarly: false }),
  },
};
