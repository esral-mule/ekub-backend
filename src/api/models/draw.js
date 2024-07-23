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

const DrawModel = new Schema({
    equbType: {
        type: Schema.Types.ObjectId,
        ref: "equbTypes",
        required: true
    },
    turn: {
        type: Number
    },
}, {
    timestamps: true,
});


DrawModel.statics = {
    async get(id) {
        if (!Types.ObjectId.isValid(id)) {
            throw new APIError({
                message: VALIDATION_ERROR,
                errors: [{
                    field: "id",
                    location: "params",
                    messages: "Please enter valid Draw ID",
                }, ],
                status: NOT_FOUND,
            });
        }
        const draw = await this.findById(id).exec();
        if (!draw)
            throw new APIError({
                message: NO_RECORD_FOUND,
                status: NOT_FOUND,
            });
        return draw;
    },
};

module.exports = model("draws", DrawModel);