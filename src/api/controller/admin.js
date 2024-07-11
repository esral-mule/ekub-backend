const {
  Get, CreateUser,
  UpdateUser, RemoveUser,
  ChangePassword,
  UploadFile,
} = require('../service/admin');
const { Handler } = require('../../middleware/error');
const { CREATED, FORBIDDEN, INVALID_CREDENTIALS } = require('../../utils/constants')

exports.load = async (req, res, next, id) => {
  try {
    const user = await Get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return Handler(error, req, res, next);
  }
};

exports.get = (req, res) => res.json({ data: req.locals.user.transform(), success: 'SUCCESS' });

exports.loggedIn = (req, res) => res.json({ data: req.user.transform(), success: 'SUCCESS' });

exports.create = async (req, res, next) => {
  try {
    const response = await CreateUser(req.body);
    return res.status(CREATED).json({ data: response, success: 'SUCCESS' });
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const response = await UpdateUser(user, req.body);
    return res.json({ data: response, success: 'SUCCESS' });
  } catch (error) {
    return next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const compare = await req.user.matchPassword(req.body.oldPassword);
    if (!compare) return res.status(FORBIDDEN).json({ code: FORBIDDEN, message: INVALID_CREDENTIALS });
    const response = await ChangePassword(req.user, req.body.oldPassword, req.body.password);
    return res.json({ data: response, success: 'SUCCESS' });
  } catch (error) {
    return next(error);
  }
};


exports.updateUsername = async (req, res, next) => {
  try {
    const correctPassword = await req.user.matchPassword(req.body.password);
    if (!correctPassword) return res.status(FORBIDDEN).json({ code: FORBIDDEN, message: INVALID_CREDENTIALS });
    const response = await UpdateUser(req.user, {...req.user, username: req.body.username})
    return res.json({ data: response, success: 'SUCCESS' });
  } catch (error) {
    return next(error);
  }
};


exports.updatePhoneNumber = async (req, res, next) => {
  try {
    const correctPassword = await req.user.matchPassword(req.body.password);
    if (!correctPassword) return res.status(FORBIDDEN).json({ code: FORBIDDEN, message: INVALID_CREDENTIALS });
    const response = await UpdateUser(req.user, {...req.user, phoneNumber: req.body.phoneNumber})
    return res.json({ data: response, success: 'SUCCESS' });
  } catch (error) {
    return next(error);
  }
};



exports.remove = async (req, res, next) => {
  try {
    await RemoveUser(req.params.userID);
    res.status(203).end();
  } catch (error) {
    next(error);
  }
};

exports.upload = async (req, res, next) => {
  try {
    const data = await UploadFile(req.file);
    const user = await UpdateUser(req.user, {...req.user, profilePicture: data})
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
