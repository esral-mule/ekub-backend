const app = require("express").Router();
const controller = require("../controller/equb-type");

const {
    Authorize
} = require("../../middleware/auth");
const {
    ADMIN,
    USER
} = require("../../utils/constants");

app.route("/")
    .get(Authorize([ADMIN, USER]), controller.getAll)
    .post(Authorize([ADMIN]), controller.createEqubType)

app.route("/:id")
    .get(Authorize([ADMIN, USER]), controller.getOne)
    .put(Authorize([ADMIN]), controller.update)
    .delete(Authorize([ADMIN]), controller.deleteOne)


module.exports = app;