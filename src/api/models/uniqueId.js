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

const UniqueId = new Schema({
    // type: {
    //     type: String,
    //     enum: ['full', 'part'],
    // },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "memberShips",
        required: true
    }],
    equbType: {
        type: Schema.Types.ObjectId,
        ref: "equbTypes",
        required: true
    },
    uniqueId: {
        type: Number,
        required: true
    },
    isFull: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});


UniqueId.statics = {
    async get(id) {
        if (!Types.ObjectId.isValid(id)) {
            throw new APIError({
                message: VALIDATION_ERROR,
                errors: [{
                    field: "id",
                    location: "params",
                    messages: "Please enter valid UniqueId ID",
                }, ],
                status: NOT_FOUND,
            });
        }
        const uniqueId = await this.findById(id).exec();
        if (!uniqueId)
            throw new APIError({
                message: NO_RECORD_FOUND,
                status: NOT_FOUND,
            });
        return uniqueId;
    },
};


module.exports = model("uniqueIds", UniqueId);