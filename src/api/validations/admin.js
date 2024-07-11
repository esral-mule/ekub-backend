const Joi = require("joi");
const { ROLES } = require("../../utils/constants");

module.exports = {
  // GET /v1/users
  listUsers: {
    query: Joi.object({
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      fullName: Joi.string(),
      phoneNumber: Joi.string(),
      // role: Joi.string().valid(...ROLES),
    }).options({ abortEarly: false }),
  },

  // POST /v1/users
  createUser: {
    body: Joi.object({
      fullName: Joi.string().required().min(2).max(30),
      phoneNumber: Joi.string().min(10).max(13).required(),
      username: Joi.string().min(4).max(13),
      password: Joi.string().required().min(6).max(128),
      // role: Joi.string().valid(...ROLES),
    }).options({ abortEarly: false }),
  },

  // PATCH /v1/users/change-password/:userID
  changePassword: {
    body: Joi.object({
      oldPassword: Joi.string().min(6).max(128),
      password: Joi.string().min(6).max(128),
    }).options({ abortEarly: false }),
    params: Joi.object({
      userID: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    }).options({ abortEarly: false }),
  },

  // PATCH /v1/users/update-username/:userID
  updateUsername: {
    body: Joi.object({
      username: Joi.string().max(16).required(),
      password: Joi.string().min(6).max(128).required(),
    }).options({ abortEarly: false }),
  },

  updatePhoneNumber: {
    body: Joi.object({
      phoneNumber: Joi.string().max(16).required(),
      password: Joi.string().min(6).max(128).required(),
    }).options({ abortEarly: false }),
  },

  // PATCH /v1/users/:userID
  updateUser: {
    body: Joi.object({
      // phoneNumber: Joi.string().min(10).max(13), // phoneNumber shouldn't be changed
      fullName: Joi.string().max(128),
    }).options({ abortEarly: false }),
    params: Joi.object({
      userID: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    }).options({ abortEarly: false }),
  },

  // post /v1/users/:userID/upload
  uploadProfilePicture: {
    params: Joi.object({
      userID: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    }).options({ abortEarly: false }),
  },
};
