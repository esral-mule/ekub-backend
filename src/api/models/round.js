const { Schema, model, Types } = require("mongoose");

const APIError = require("../../utils/APIError");
const {
  NO_RECORD_FOUND,
  NOT_FOUND,
  VALIDATION_ERROR,
} = require("../../utils/constants");

const RoundModel = new Schema(
  {
    equbType: {
      type: Schema.Types.ObjectId,
      ref: "equbTypes",
      required: true,
    },
    round: {
      type: Number,
      default: 0,
    },
    cycle: {
      type: Number,
    },
    closed: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

RoundModel.statics = {
  async get(id) {
    if (!Types.ObjectId.isValid(id)) {
      throw new APIError({
        message: VALIDATION_ERROR,
        errors: [
          {
            field: "id",
            location: "params",
            messages: "Please enter valid Round ID",
          },
        ],
        status: NOT_FOUND,
      });
    }
    const round = await this.findById(id).exec();
    if (!round)
      throw new APIError({
        message: NO_RECORD_FOUND,
        status: NOT_FOUND,
      });
    return round;
  },
};

module.exports = model("rounds", RoundModel);
