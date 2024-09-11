const app = require("express").Router();
const { validate } = require("express-validation");
const controller = require("../controller/uniqueId");

const {
    Authorize
} = require("../../middleware/auth");

const {
    ADMIN,
    USER
} = require("../../utils/constants");
const { createUniqueId,getOne,delteOne } = require("../validations/uniqueId");

app.route("/")
    // .get(Authorize([ADMIN, USER]), controller.getAll)
    .post(Authorize([ADMIN, USER]),validate(createUniqueId), controller.create)

app.route("/etype/:id")
    .get(Authorize([ADMIN, USER]),validate(getOne), controller.getAll)

// to get available(not full) unique ids for adding a new member
app.route("/notfull/etype/:id")
    .get(Authorize([ADMIN, USER]),validate(getOne), controller.getNotFull)
// to get available unique ids for lotory
app.route("/available/etype/:id")
    .get(Authorize([ADMIN, USER]),validate(getOne), controller.getAvailable)
    
app.route("/:id")
    .get(Authorize([ADMIN, USER]),validate(getOne), controller.getOne)
    .put(Authorize([ADMIN, USER]), controller.update)
    .delete(Authorize([ADMIN, USER]),validate(delteOne), controller.deleteOne)


module.exports = app;