const { Login, Register } = require('../service/auth');
const { OK, CREATED } = require('../../utils/constants');

exports.login = async (req, res, next) => {
  try {
    const data = await Login(req.body);
    res.status(OK).json({ data, success: 'SUCCESS' });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const data = await Register(req.body);
    res.status(CREATED).json({ data, success: 'SUCCESS' });
  } catch (err) {
    next(err);
  }
};
