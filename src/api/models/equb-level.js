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

const EqubLevel = new Schema({
    equbType: {
        type: Schema.Types.ObjectId,
        ref: "equbTypes",
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    contribution: {
        type: Number,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});


EqubLevel.statics = {
    async get(id) {
        if (!Types.ObjectId.isValid(id)) {
            throw new APIError({
                message: VALIDATION_ERROR,
                errors: [{
                    field: "id",
                    location: "params",
                    messages: "Please enter valid EqubLevel ID",
                }, ],
                status: NOT_FOUND,
            });
        }
        const equbLevel = await this.findById(id).exec();
        if (!equbLevel)
            throw new APIError({
                message: NO_RECORD_FOUND,
                status: NOT_FOUND,
            });
        return equbLevel;
    },
};


module.exports = model("equbLevels", EqubLevel);