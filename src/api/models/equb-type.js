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

const EqubTypeModel = new Schema({
  equbHouse: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', "custome"],
    default: "weekly",
  },
  contributionDay: {
    type: Number,
  },
  lotteryDay: {
    type: Number,
  },
  contribution: {
    type: Number,
    required: true
  },
  maxUniqueIds: {
    type: Number,
    required: true
  },
  round: {
    type: Number
  },
  cycle: {
    type: Number,
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
});


EqubTypeModel.statics = {
  async get(id) {
    if (!Types.ObjectId.isValid(id)) {
      throw new APIError({
        message: VALIDATION_ERROR,
        errors: [{
          field: "id",
          location: "params",
          messages: "Please enter valid EqubType ID",
        }, ],
        status: NOT_FOUND,
      });
    }
    const equbType = await this.findById(id).exec();
    if (!equbType)
      throw new APIError({
        message: NO_RECORD_FOUND,
        status: NOT_FOUND,
      });
    return equbType;
  },
};

module.exports = model("equbTypes", EqubTypeModel);