const app = require("express").Router();
const {
  validate
} = require("express-validation");
const controller = require("../controller/user");
const upload = require("../../utils/upload");

const userController = require("../controller/user");
const {
  Login
} = require("../validations/auth");

const {
  Authorize
} = require("../../middleware/auth");
const {
  ADMIN,
  USER
} = require("../../utils/constants");

const {
  listUsers,
  createUser,
  changePassword,
  updateUser,
  updateUsername,
  updatePhoneNumber,
} = require("../validations/user");

app.param("userID", controller.load);

app.route("/login").post(userController.login);

app.route("/").get(Authorize([ADMIN]), controller.getAll);

app
  .route("/main")
  .get(Authorize([ADMIN]), controller.load)
  .post(Authorize([ADMIN]), controller.create);

app.route("/profile").get(Authorize(), controller.loggedIn);

app
  .route("/:userID")
  .get(Authorize([ADMIN, USER]), controller.get)
  .patch(Authorize([ADMIN, USER]), controller.update)
  .delete(Authorize([ADMIN]), controller.remove);

app.route('/one/:id').get(Authorize([ADMIN, USER]), controller.getOne)

app
  .route("/change-password/:userID")
  .patch(
    Authorize([USER]),

    controller.changePassword,
  );

app
  .route("/update-phone-number/:userID")
  .patch(
    Authorize([USER]),

    controller.updatePhoneNumber,
  );

app
  .route("/update-username/:userID")
  .patch(
    Authorize([USER]),

    controller.updateUsername,
  );

app
  .route("/:userID/upload")
  .post(Authorize([USER]), upload.single("profile"), controller.upload);

module.exports = app;