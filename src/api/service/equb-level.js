const Model = require("../models/equb-level");
const MemberShipModel = require('../models/membership')
const ContributionModel = require('../models/contribution')

exports.Create = async (data) => {
    try {
        const response = await Model.create(data);
        return response;
    } catch (err) {
        return err
    }
}

exports.GetOne = async (id) => {
    try {
        const response = await Model.findById({
                _id: id
            })
            .populate("equbType")
        return response;
    } catch (err) {
        return err
    }
}

exports.GetAll = async (req) => {
    try {
        const {
            limit,
            page,
            queryName,
            searchQuery,
            sort
        } = req.query;
        const skip = (page - 1) * (limit || 10);
        const filter = {
            equbType: req.params.id,
            deleted: false,
        }

        if (queryName) {
            filter[queryName] = {
                $regex: searchQuery,
                $options: 'i'
            };
        }


        const response = await Model
            .find(filter)
            .sort(sort)
            .skip(skip || 0)
            .limit(limit || 1000)
            .populate("equbType")

        return response;
    } catch (err) {
        return err
    }
}

exports.Update = async (req) => {
    try {
        const {
            body
        } = req;
        const {
            id
        } = req.params
        const response = await Model.updateOne({
            _id: id
        }, body);
        return response;
    } catch (err) {
        return err
    }
}

exports.DeleteOne = async (req) => {
    try {
        const {
            id
        } = req.params

        const response = await Model.updateOne({
            _id: id
        }, { $set: { deleted: true }})

        let members = await MemberShipModel.find({ equbLevel: id })

        if (members.length) {
            members = members.map(val => val._id)
            
            await ContributionModel.updateMany({ _id: { $in: members } }, { $set: {deleted: true}})
        }

        await MemberShipModel.updateMany({ equbLevel: id }, { $set: { deleted: true }})

        return response;
    } catch (err) {
        return err
    }
}