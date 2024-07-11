const app = require("express").Router();
const { validate } = require("express-validation");
const controller = require("../controller/auth");
const userController = require("../controller/user");
const { Login, Register } = require("../validations/auth");

const { Authorize } = require("../../middleware/auth");
const { ADMIN } = require("../../utils/constants");

app
  .route("/register-user")
  .post(Authorize(ADMIN), validate(Register), userController.create);

app.route("/login").post(validate(Login), controller.login);

module.exports = app;
