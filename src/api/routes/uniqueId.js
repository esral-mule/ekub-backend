const app = require("express").Router();
const controller = require("../controller/uniqueId");

const {
    Authorize
} = require("../../middleware/auth");

const {
    ADMIN,
    USER
} = require("../../utils/constants");

app.route("/")
    // .get(Authorize([ADMIN, USER]), controller.getAll)
    .post(Authorize([ADMIN, USER]), controller.create)

app.route("/etype/:id")
    .get(Authorize([ADMIN, USER]), controller.getAll)

// to get available(not full) unique ids for adding a new member
app.route("/notfull/etype/:id")
    .get(Authorize([ADMIN, USER]), controller.getNotFull)
// to get available unique ids for lotory
app.route("/available/etype/:id")
    .get(Authorize([ADMIN, USER]), controller.getAvailable)
    
app.route("/:id")
    .get(Authorize([ADMIN, USER]), controller.getOne)
    .put(Authorize([ADMIN, USER]), controller.update)
    .delete(Authorize([ADMIN, USER]), controller.deleteOne)


module.exports = app;