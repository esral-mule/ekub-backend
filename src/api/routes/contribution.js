const app = require("express").Router();
const { validate } = require("express-validation");
const controller = require("../controller/contribution");

const {
    Authorize
} = require("../../middleware/auth");
const {
    ADMIN,
    USER,
    MEMBER
} = require("../../utils/constants");
const { createContribution,getOne,deleteOne,UpdateContribution } = require("../validations/contribution");

app.route("/")
    // .get(Authorize([ADMIN, USER]), controller.getAll)
    .post(Authorize([ADMIN, USER]),validate(createContribution),controller.create)

app.route("/round/:id")
    .get(Authorize([ADMIN, USER]),validate(getOne), controller.getAll)

app.route("/equbtype/:id").get(Authorize([MEMBER]),validate(getOne),controller.getByEqubType)

app.route("/:id")
    .get(Authorize([ADMIN, USER]),validate(getOne), controller.getOne)
    .put(Authorize([ADMIN, USER]),validate(UpdateContribution), controller.update)
    .delete(Authorize([ADMIN, USER]),validate(deleteOne), controller.deleteOne)


module.exports = app;