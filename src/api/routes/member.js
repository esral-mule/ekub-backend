const app = require("express").Router();
const { validate } = require("express-validation");
const controller = require("../controller/member");

const { Authorize } = require("../../middleware/auth");
const { ADMIN, USER } = require("../../utils/constants");
const { login } = require("../validations/member");
const { validateAndCovertPhoneNumber } = require("../../utils/functions");

app.route("/login").post(validate(login),validateAndCovertPhoneNumber,controller.login);
  
app
  .route("/")
  .get(Authorize([ADMIN, USER]), controller.getAll)
  .post(Authorize([ADMIN, USER]), controller.create);


app
  .route("/:id")
  .get(Authorize([ADMIN, USER]), controller.getOne)
  .put(Authorize([ADMIN, USER]), controller.update)
  .delete(Authorize([ADMIN, USER]), controller.deleteOne);

module.exports = app;