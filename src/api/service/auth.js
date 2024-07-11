const Admin = require('../models/admin');
const { generateTokenResponse } = require('../../middleware/auth')

exports.Register = async (adminData) => {
  try {
    const us = new Admin(adminData);
    const savedAdmin = await us.save();
    return { token: us.token(), admin: savedAdmin.transform() };
  } catch (err) {
    throw Admin.checkDuplication(err);
  }
};

exports.Login = async (adminData) => {
  const { admin, accessToken } = await Admin.ValidateAdminAndGenerateToken(adminData);
  const tokens = generateTokenResponse(admin, accessToken);
  return { tokens, admin };
};
