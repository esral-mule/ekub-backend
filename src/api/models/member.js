const {
  Schema,
  model,
  Types
} = require("mongoose");

const bcrypt = require("bcryptjs");

const APIError = require("../../utils/APIError");
const {
  ROLES,
  DEFAULT_IMAGE,
  NO_RECORD_FOUND,
  NOT_FOUND,
  VALIDATION_ERROR,
} = require("../../utils/constants");

const {
  saltRound,
} = require("../../config/env-vars");

const MemberModel = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    trim: true,
  },
  profilePicture: {
    type: String,
    default: DEFAULT_IMAGE,
  },
  role: {
    type: String,
    enum: ROLES,
    default: "member",
  },
  password: {
    type: String,
    minlength: 6,
  },
}, {
  timestamps: true,
});

MemberModel.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();
    const hash = await bcrypt.hash(this.password, Number(saltRound));
    this.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});


MemberModel.statics = {
  async get(id) {
    if (!Types.ObjectId.isValid(id)) {
      throw new APIError({
        message: VALIDATION_ERROR,
        errors: [{
          field: "id",
          location: "params",
          messages: "Please enter valid Member ID",
        }, ],
        status: NOT_FOUND,
      });
    }
    const member = await this.findById(id).exec();
    if (!member)
      throw new APIError({
        message: NO_RECORD_FOUND,
        status: NOT_FOUND,
      });
    return member;
  },
};


module.exports = model("members", MemberModel);