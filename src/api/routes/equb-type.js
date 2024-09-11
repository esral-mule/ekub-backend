const app = require("express").Router();
const { validate } = require("express-validation");
const controller = require("../controller/equb-type");

const {
    Authorize
} = require("../../middleware/auth");
const {
    ADMIN,
    USER,
    MEMBER
} = require("../../utils/constants");
const { createEqubType, getOne, deleteOne } = require("../validations/equbType");

app.route("/")
.get(Authorize([ADMIN, USER]), controller.getAll)
.post(Authorize([ADMIN, USER]), validate(createEqubType),controller.createEqubType)

app.route("/member").get(Authorize([MEMBER]),controller.getForMember)

app.route("/:id")
    .get(Authorize([ADMIN, USER]),validate(getOne), controller.getOne)
    .put(Authorize([ADMIN, USER]), controller.update)
    .delete(Authorize([ADMIN, USER]),validate(deleteOne), controller.deleteOne)


module.exports = app;