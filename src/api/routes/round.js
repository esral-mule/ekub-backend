const app = require("express").Router();
const { validate } = require("express-validation");
const controller = require("../controller/round");

const {
    Authorize
} = require("../../middleware/auth");
const {
    ADMIN,
    USER
} = require("../../utils/constants");
const { addMemberRound, startRound, getOne,deleteOne } = require("../validations/round");

// app.route("/")
//     .get(Authorize([ADMIN, USER]), controller.getAll)

app.route("/etype/:id")
    .get(Authorize([ADMIN, USER]), controller.getAll)

app.route("/add-to-round/:id")
    .post(Authorize([ADMIN, USER]),validate(addMemberRound), controller.addMemberToRound)

app.route("/start")
    .post(Authorize([ADMIN, USER]),validate(startRound), controller.create)

app.route("/:id")
    .get(Authorize([ADMIN, USER]),validate(getOne), controller.getOne)
    .put(Authorize([ADMIN, USER]), controller.update)
    .delete(Authorize([ADMIN, USER]),validate(deleteOne) ,controller.deleteOne)


module.exports = app;