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

const MembershipModel = new Schema({
    member: {
        type: Schema.Types.ObjectId,
        ref: "members",
        required: true
    },
    equbType: {
        type: Schema.Types.ObjectId,
        ref: "equbTypes",
        required: true
    },
    equbLevel: {
        type: Schema.Types.ObjectId,
        ref: "equbLevels",
        required: true
    },
    uniqueId: {
        type: Schema.Types.ObjectId,
        ref: 'uniqueIds',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});


MembershipModel.statics = {
    async get(id) {
        if (!Types.ObjectId.isValid(id)) {
            throw new APIError({
                message: VALIDATION_ERROR,
                errors: [{
                    field: "id",
                    location: "params",
                    messages: "Please enter valid Membership ID",
                }, ],
                status: NOT_FOUND,
            });
        }
        const membership = await this.findById(id).exec();
        if (!membership)
            throw new APIError({
                message: NO_RECORD_FOUND,
                status: NOT_FOUND,
            });
        return membership;
    },
};


module.exports = model("memberShips", MembershipModel);