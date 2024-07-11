const { Schema, model } = require('mongoose');
const moment = require('moment');
const crypto = require('crypto');

const RefreshTokenModel = new Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  id: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  phoneNumber: {
    type: String,
    ref: 'users',
    required: true,
  },
  expires: {
    type: Date,
  },
});

RefreshTokenModel.statics = {
    generate(user) {
    const { phoneNumber, id } = user;
    const token = `${id}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment().add(30, 'days').toDate();
    const Obj = new RefreshToken({
      token, id, phoneNumber, expires,
    });
    Obj.save();
    return Obj.token;
  },
};

const RefreshToken = model('RefreshToken', RefreshTokenModel);

module.exports = RefreshToken;
