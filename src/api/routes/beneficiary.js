const app = require("express").Router();
const { validate } = require("express-validation");
const controller = require("../controller/beneficiary");

const {
    Authorize
} = require("../../middleware/auth");

const {
    ADMIN,
    USER
} = require("../../utils/constants");
const { createBeneficiary,getOne,deleteOne } = require("../validations/beneficiary");

app.route("/")
    // .get(Authorize([ADMIN, USER]), controller.getAll)
    .post(Authorize([ADMIN, USER]),validate(createBeneficiary), controller.create)

app.route("/etype/:id")
    .get(Authorize([ADMIN, USER]),validate(getOne), controller.getAll)

app.route("/round/:id")
    .get(Authorize([ADMIN, USER]),validate(getOne), controller.getByRound)

app.route('/wins/:uniqueId')
    .get(Authorize([ADMIN, USER]), controller.getWins)

app.route("/:id")
    .get(Authorize([ADMIN, USER]),validate(getOne), controller.getOne)
    .put(Authorize([ADMIN, USER]), controller.update)
    .delete(Authorize([ADMIN, USER]),validate(deleteOne), controller.deleteOne)


module.exports = app;