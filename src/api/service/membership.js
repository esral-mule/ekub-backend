const Contribution = require("../models/contribution");
const Model = require("../models/membership");
const { GetActive } = require("./round");
const UniqueIdsService = require("./uniqueId");

exports.Create = async (data) => {
  try {
    const response = await Model.create(data);
    await UniqueIdsService.AddMember(data.uniqueId, response._id, data.isFull);
    return response;
  } catch (err) {
    return err;
  }
};

exports.GetOne = async (id) => {
  try {
    const response = await Model.findById({
      _id: id,
    }).populate("member equbType equbLevel uniqueId");
    return response;
  } catch (err) {
    return err;
  }
};

exports.CheckIsMember = async (req) => {
  console.log("req", req);

  try {
    console.log("req.user", req);

    const response = await Model.findOne({
      member: req.user,
      equbType: req.params.id,
    }).populate("member equbType equbLevel uniqueId");
    return response;
  } catch (err) {
    console.log("err", err);

    return err;
  }
};

exports.GetByMember = async (req) => {
  try {
    const response = await Model.find({
      member: req.user,
    }).populate("member equbType equbLevel uniqueId");
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
      equbType: req.params.id,
      deleted: false,
    };

    if (queryName) {
      filter[queryName] = {
        $regex: searchQuery,
        $options: "i",
      };
    }

    const response = await Model.find(filter)
      .sort(sort)
      .skip(skip || 0)
      .limit(limit || 1000)
      .populate("member equbType equbLevel uniqueId");

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
    const membership = await Model.findById({ _id: id }).populate("uniqueId");

    await UniqueIdsService.RemoveMember(
      membership.uniqueId._id,
      membership._id
    );

    const activeRound = await GetActive(membership.equbType);
    if (activeRound) {
      await Contribution.updateOne(
        {
          round: activeRound,
          member: membership._id,
        },
        { $set: { deleted: true } }
      );
    }
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
