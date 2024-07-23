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

const BeneficiaryModel = new Schema({
    uniqueId: {
        type: Schema.Types.ObjectId,
        ref: "uniqueIds",
        required: true
    },
    pot: {
        type: Number,
        // required: true
    },
    draw: {
        type: Number
    },
    cycle: {
        type: Number
    },
    evidence: [
        {
            type: String
        }
    ],
    date: Date
}, {
    timestamps: true,
});


BeneficiaryModel.statics = {
    async get(id) {
        if (!Types.ObjectId.isValid(id)) {
            throw new APIError({
                message: VALIDATION_ERROR,
                errors: [{
                    field: "id",
                    location: "params",
                    messages: "Please enter valid BeneficiaryModel ID",
                }, ],
                status: NOT_FOUND,
            });
        }
        const beneficiaryModel = await this.findById(id).exec();
        if (!beneficiaryModel)
            throw new APIError({
                message: NO_RECORD_FOUND,
                status: NOT_FOUND,
            });
        return beneficiaryModel;
    },
};


module.exports = model("beneficiaries", BeneficiaryModel);