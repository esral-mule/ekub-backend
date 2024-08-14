const {
    Schema,
    model,
    Types
} = require("mongoose");

const APIError = require("../../utils/APIError");
const {
    NO_RECORD_FOUND,
    NOT_FOUND,
    VALIDATION_ERROR,
} = require("../../utils/constants");

const Contribution = new Schema({
    round: {
        type: Schema.Types.ObjectId,
        ref: 'rounds'
    },
    member: {
        type: Schema.Types.ObjectId,
        ref: 'memberShips',
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

Contribution.statics = {
    async get(id) {
        if (!Types.ObjectId.isValid(id)) {
            throw new APIError({
                message: VALIDATION_ERROR,
                errors: [{
                    field: "id",
                    location: "params",
                    messages: "Please enter valid Contribution ID",
                }, ],
                status: NOT_FOUND,
            });
        }
        const contribution = await this.findById(id).exec();
        if (!contribution)
            throw new APIError({
                message: NO_RECORD_FOUND,
                status: NOT_FOUND,
            });
        return contribution;
    },
};


module.exports = model("contributions", Contribution);