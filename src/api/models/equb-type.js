const { Schema, model, Types } = require("mongoose");
const bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken");
const moment = require("moment");

const APIError = require("../../utils/APIError");
const {
  ROLES,
  DEFAULT_IMAGE,
  NO_RECORD_FOUND,
  NOT_FOUND,
  BAD_REQUEST,
  VALIDATION_ERROR,
  INVALID_CREDENTIALS,
  UNAUTHORIZED,
  PHONE_NUMBER_EXISTS,
} = require("../../utils/constants");
const {
  saltRound,
  jwtExpirationInterval,
  jwtSecret,
} = require("../../config/env-vars");

const EqubTypeModel = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    equb_id: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    period: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', "custome"],
        default: "weekly",
        required: true,
    },
    contributionDay: {
        type: Number,
        required: true,
    },
    lotteryDay: {
      type: Number,
    },
    maxContribution: {
        type: Number,
        required: true
    },
    // levels: [
    //     {
    //         name: String,
    //         amount: Number,
    //     }
    // ]
  },
  {
    timestamps: true,
  }
);

EqubTypeModel.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();
    const hash = await bcrypt.hash(this.password, Number(saltRound));
    this.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

EqubTypeModel.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "fullName",
      "equbTypename",
      "phoneNumber",
      "profilePicture",
      "password",
      "role",
      "equbName"
    ];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },
  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, "minutes").unix(),
      iat: moment().unix(),
      sub: this._id,
      role: this.role
    };
    return Jwt.sign(playload, jwtSecret);
  },
  async matchPassword(password) {
    return bcrypt.compare(password, this.password);
  },
});

EqubTypeModel.statics = {
    async get(id) {
    if (!Types.ObjectId.isValid(id)) {
      throw new APIError({
        message: VALIDATION_ERROR,
        errors: [
          {
            field: "id",
            location: "params",
            messages: "Please enter valid EqubType ID",
          },
        ],
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

    async ValidateEqubTypeAndGenerateToken(options) {
    const { phoneNumber, password } = options;
    const equbType = await this.findOne({
      phoneNumber,
    }).exec();
    if (!equbType) {
      throw new APIError({
        message: INVALID_CREDENTIALS,
        status: UNAUTHORIZED,
      });
    }
    if (!(await equbType.matchPassword(password))) {
      throw new APIError({
        message: INVALID_CREDENTIALS,
        status: UNAUTHORIZED,
      });

    }
    return {
      equbType: equbType.transform(),
      accessToken: equbType.token(),
    };
  },

    checkDuplication(error) {
    if (
      error.code === 11000 &&
      (error.name === "BulkWriteError" || error.name === "MongoError")
    ) {
      const keys = Object.keys(error.keyPattern);
      if (keys.includes("phoneNumber")) {
        return new APIError({
          message: PHONE_NUMBER_EXISTS,
          status: BAD_REQUEST,
          errors: [
            {
              field: "phoneNumber",
              location: "body",
              messages: "Phonenumber is already in use",
            },
          ],
        });
      }
    }
    console.log(error)
    return error;
  },
};

module.exports = model("equbTypes", EqubTypeModel);
