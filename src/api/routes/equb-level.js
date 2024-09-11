const app = require("express").Router();
const { validate } = require("express-validation");
const controller = require("../controller/equb-level");

const {
    Authorize
} = require("../../middleware/auth");
const {
    ADMIN,
    USER
} = require("../../utils/constants");
const { createEqubLevel, delteOne, updateEqubLevel } = require("../validations/equbLevel");

app.route("/")
    // .get(Authorize([ADMIN, USER]), controller.getAll)
    .post(Authorize([ADMIN, USER]),validate(createEqubLevel), controller.create)

app.route("/etype/:id")
    .get(Authorize([ADMIN, USER]), controller.getAll)

app.route("/:id")
    .get(Authorize([ADMIN, USER]),validate(createEqubLevel), controller.getOne)
    .put(Authorize([ADMIN, USER]),validate(updateEqubLevel), controller.update)
    .delete(Authorize([ADMIN, USER]),validate(delteOne), controller.deleteOne)


module.exports = app;