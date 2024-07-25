const { omit } = require("lodash");
const bcrypt = require("bcryptjs");
const { saltRound } = require("../../config/env-vars");
const User = require("../models/user");

const { generateTokenResponse } = require("../../middleware/auth");

exports.Login = async (userData) => {
  console.log(userData);
  const { user, accessToken } =
    await User.ValidateUserAndGenerateToken(userData);
  const tokens = generateTokenResponse(user, accessToken);
  return { tokens, user };
};

exports.LoginUser = (req, res) => res.json(req.user.transform());

exports.CreateUser = async (userData) => {
  try {
    const user = new User(userData);
    const su = await user.save();
    return su.transform();
  } catch (err) {
    throw User.checkDuplication(err);
  }
};

exports.Get = async (id) => User.get(id);

exports.GetAll = async (req) => {
  try {
    const { limit, page, queryName, searchQuery, sort } = req.query;
    const skip = (page - 1) * (limit || 10);
    const filter = {};

    if (queryName) {
      filter[queryName] = {
        $regex: searchQuery,
        $options: "i",
      };
    }

    const response = await User.find(filter).sort(sort).skip(skip||0).limit(limit||10);
    // const response = await User.find()

    return response;
  } catch (err) {
    return err;
  }
};

exports.UpdateUser = async (user, newData) => {
  try {
    const role = user.role !== "admin" ? "role" : "";
    const userToUpdate = omit(newData, role);
    const updateData = Object.assign(user, userToUpdate);
    const savedUser = await updateData.save();
    return savedUser.transform();
  } catch (err) {
    throw User.checkDuplication(err);
  }
};

exports.ChangePassword = async (user, oldPassword, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, Number(saltRound));
    const updatedPassword = new User({ ...user, password: hashedPassword });
    const newUserObject = omit(updatedPassword.toObject(), "_id");
    await user.updateOne(newUserObject, {
      override: true,
      upsert: true,
    });
    const savedUser = await User.findById(user._id);

    return savedUser.transform();
  } catch (error) {
    throw User.checkDuplication(error);
  }
};

exports.RemoveUser = async (id) => {
  const res = await User.deleteOne({ _id: id });
  console.log(res);
  return res;
};

exports.UploadFile = async (file) => {
  const { path } = file;
  return path;
};
