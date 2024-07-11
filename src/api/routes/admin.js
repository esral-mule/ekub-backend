const app = require("express").Router();
const { validate } = require("express-validation");
const controller = require("../controller/admin");
const upload = require("../../utils/upload");

const { Authorize, OptionalAuthorize } = require("../../middleware/auth");
const {
  listUsers,
  createUser,
  changePassword,
  updateUser,
  updateUsername,
  updatePhoneNumber,
} = require("../validations/admin");

const { ADMIN, LOGGED_IN } = require("../../utils/constants");

app.param("userID", controller.load);

app
  .route("/main")
    .get(Authorize(ADMIN), validate(listUsers), controller.load)
    .post(Authorize(ADMIN), validate(createUser), controller.create);

app
  .route("/profile")
    .get(Authorize(), controller.loggedIn);

app
  .route("/:userID")
    .get(OptionalAuthorize(), controller.get)
    .patch(Authorize(ADMIN), validate(updateUser), controller.update)
    .delete(Authorize(ADMIN), controller.remove);

app
  .route("/change-password/:userID")
    .patch(
    Authorize(ADMIN),
    validate(changePassword),
    controller.changePassword
  );

  app
  .route("/update-phone-number/:userID")
    .patch(
    Authorize(ADMIN),
    validate(updatePhoneNumber),
    controller.updatePhoneNumber
  );

  app
  .route("/update-username/:userID")
    .patch(
    Authorize(ADMIN),
    validate(updateUsername),
    controller.updateUsername
  );


app
  .route("/:userID/upload")
  .post(Authorize(ADMIN), upload.single("profile"), controller.upload);

module.exports = app;
