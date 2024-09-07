const app = require("express").Router();
const controller = require("../controller/member");

const { Authorize } = require("../../middleware/auth");
const { ADMIN, USER } = require("../../utils/constants");

app.route("/login").post(controller.login);
  
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