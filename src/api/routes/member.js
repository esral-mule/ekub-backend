const app = require("express").Router();
const { validate } = require("express-validation");
const controller = require("../controller/member");

const { Authorize } = require("../../middleware/auth");
const { ADMIN, USER } = require("../../utils/constants");
const { login, createMember, getOne, deleteOne } = require("../validations/member");
const { validateAndCovertPhoneNumber } = require("../../utils/functions");

app.route("/login").post(validate(login),validateAndCovertPhoneNumber,controller.login);
  
app
  .route("/")
  .get(Authorize([ADMIN]), controller.getAll)
  .post(Authorize([ADMIN, USER]),validate(createMember),validateAndCovertPhoneNumber, controller.create);
app
  .route("/house/:id")
  .get(Authorize([ADMIN,USER]), controller.getForHouse)

app
  .route("/:id")
  .get(Authorize([ADMIN, USER]),validate(getOne), controller.getOne)
  .put(Authorize([ADMIN, USER]), controller.update)
  .delete(Authorize([ADMIN, USER]),validate(deleteOne), controller.deleteOne);

module.exports = app;