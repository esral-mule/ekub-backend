const app = require("express").Router();
const { validate } = require("express-validation");

const controller = require("../controller/membership");

const {
    Authorize
} = require("../../middleware/auth");
const {
    ADMIN,
    USER
} = require("../../utils/constants");
const { createMembership,getOne,delteOne } = require("../validations/membership");


app.route("/")
    // .get(Authorize([ADMIN, USER]), controller.getAll)
    .post(Authorize([ADMIN, USER]),validate(createMembership), controller.create)

app.route("/etype/:id")
    .get(Authorize([ADMIN, USER]), controller.getAll)

app.route("/:id")
    .get(Authorize([ADMIN, USER]),validate(getOne), controller.getOne)
    .put(Authorize([ADMIN, USER]) ,controller.update)
    .delete(Authorize([ADMIN, USER]),validate(delteOne), controller.deleteOne)


module.exports = app;