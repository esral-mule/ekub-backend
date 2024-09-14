const { Schema, model, Types } = require("mongoose");
const Jwt = require("jsonwebtoken");
const moment = require("moment");

const bcrypt = require("bcryptjs");

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


const MemberModel = new Schema(
  {
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
      sparse: true,
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
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

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

MemberModel.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "fullName",
      "username",
      "phoneNumber",
      "profilePicture",
      "password",
      "role",
      "equbName",
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
      role: this.role,
    };
    return Jwt.sign(playload, jwtSecret);
  },
  async matchPassword(password) {
    return bcrypt.compare(password, this.password);
  },
});

MemberModel.statics = {
  async get(id) {
    if (!Types.ObjectId.isValid(id)) {
      throw new APIError({
        message: VALIDATION_ERROR,
        errors: [
          {
            field: "id",
            location: "params",
            messages: "Please enter valid User ID",
          },
        ],
        status: NOT_FOUND,
      });
    }
    const user = await this.findById(id).exec();
    if (!user)
      throw new APIError({
        message: NO_RECORD_FOUND,
        status: NOT_FOUND,
      });
    return user;
  },

  async ValidateUserAndGenerateToken(options) {
    const { phoneNumber, password } = options;
    const user = await this.findOne({
      phoneNumber,
    }).exec();
    console.log("user",user);
    
    if (!user) {
      throw new APIError({
        message: INVALID_CREDENTIALS,
        status: BAD_REQUEST,
      });
    }
    if (!(await user.matchPassword(password))) {
      throw new APIError({
        message: INVALID_CREDENTIALS,
        status: BAD_REQUEST,
      });
    }
    return {
      user: user.transform(),
      accessToken: user.token(),
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
    console.log(error);
    return error;
  },
};

module.exports = model("members", MemberModel);
