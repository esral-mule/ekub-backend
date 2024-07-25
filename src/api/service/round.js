const Model = require("../models/round");
const BeneficiaryModel = require("../models/beneficiary")
const EqubTypeModel = require('../models/equb-type')
const ContributionModel = require('../models/contribution');
const MemberModel = require('../models/membership');

exports.Create = async (data) => {
    try {
        const rounds = await Model.find().countDocuments();
        const equbType = await EqubTypeModel.findById({
            _id: data.equbType
        });
        const cycle = Math.floor(rounds + 1 / equbType.maxUniqueIds)

        const response = await Model.create({
            ...data,
            round: rounds + 1,
            cycle
        });

        const members = await MemberModel.find({
            isActive: true
        });

        const contributions = members.map(val => ({
            member: val._id,
            round: response._id
        }))

        await ContributionModel.insertMany(contributions);

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
        const filter = {}

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
            .limit(limit || 10)
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

        const response = await Model.deleteOne({
            _id: id
        })
        return response;
    } catch (err) {
        return err
    }
}