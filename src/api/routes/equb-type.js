const app = require("express").Router();
const controller = require("../controller/equb-type");

const {
    Authorize
} = require("../../middleware/auth");
const {
    ADMIN,
    USER,
    MEMBER
} = require("../../utils/constants");


app.route("/")
.get(Authorize([ADMIN, USER]), controller.getAll)
.post(Authorize([ADMIN, USER]), controller.createEqubType)

app.route("/member").get(Authorize([MEMBER]),controller.getForMember)

app.route("/:id")
    .get(Authorize([ADMIN, USER]), controller.getOne)
    .put(Authorize([ADMIN, USER]), controller.update)
    .delete(Authorize([ADMIN, USER]), controller.deleteOne)


module.exports = app;