const {
    CreateEqubType,
    GetOne,
    GetAll,
    Update,
    DeleteOne,
    GetForMember
} = require('../service/equb-type');

const {
    OK,
    CREATED,
} = require("../../utils/constants");


exports.createEqubType = async (req, res, next) => {
    try {
        const response = await CreateEqubType({
            ...req.body,
            equbHouse: req.user
        })
        return res.status(CREATED).json({
            data: response,
            success: "SUCCESS"
        })
    } catch (err) {
        return next(err)
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const response = await GetAll(req)
        return res.status(OK).json({
            data: response,
            success: "SUCCESS"
        })
    } catch (err) {
        return next(err)
    }
}

exports.getOne = async (req, res, next) => {
    try {
        const response = await GetOne(req.params.id)
        return res.status(OK).json({
            data: response,
            success: "SUCCESS"
        })
    } catch (err) {
        return next(err)
    }
}

exports.getForMember = async (req, res, next) => {
    try {
        
        const equbTypes = await GetForMember(req);

        return res.status(OK).json({
            data: equbTypes,
            success: "SUCCESS",
          });
      } catch (error) {
        return next(error);
      }
}

exports.update = async (req, res, next) => {
    try {
        const response = await Update(req)
        return res.status(OK).json({
            data: response,
            success: "SUCCESS"
        })
    } catch (err) {
        return next(err)
    }
}

exports.deleteOne = async (req, res, next) => {
    try {
        const response = await DeleteOne(req)
        return res.status(OK).json({
            data: response,
            success: "SUCCESS"
        })
    } catch (err) {
        return next(err)
    }
}