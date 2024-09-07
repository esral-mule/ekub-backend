const Model = require("../models/member");
const { generateTokenResponse } = require("../../middleware/auth");

exports.Login = async (userData) => {
  console.log("userData", userData);
  const { user, accessToken } = await Model.ValidateUserAndGenerateToken(
    userData
  );

  const tokens = generateTokenResponse(user, accessToken);
  return {
    tokens,
    user,
  };
};


exports.Create = async (data) => {
  try {
    const response = await Model.create(data);
    return response;
  } catch (err) {
    return err;
  }
};

exports.GetOne = async (id) => {
  try {
    const response = await Model.findById({
      _id: id,
    });
    return response;
  } catch (err) {
    return err;
  }
};

exports.GetAll = async (req) => {
  try {
    const { limit, page, queryName, searchQuery, sort } = req.query;
    const skip = (page - 1) * (limit || 10);
    const filter = {
      // deleted: false
    };

    if (queryName) {
      filter[queryName] = {
        $regex: searchQuery,
        $options: "i",
      };
    }

    const response = await Model.find(filter)
      .skip(skip || 0)
      .limit(limit || 1000)
      .limit(limit);

    return response;
  } catch (err) {
    return err;
  }
};

exports.Update = async (req) => {
  try {
    const { body } = req;
    const { id } = req.params;
    const response = await Model.updateOne(
      {
        _id: id,
      },
      body
    );
    return response;
  } catch (err) {
    return err;
  }
};

exports.DeleteOne = async (req) => {
  try {
    const { id } = req.params;

    const response = await Model.updateOne(
      {
        _id: id,
      },
      { $set: { deleted: true } }
    );
    return response;
  } catch (err) {
    return err;
  }
};
