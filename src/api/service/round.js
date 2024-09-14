const Model = require("../models/round");
const EqubTypeModel = require('../models/equb-type')
const ContributionModel = require('../models/contribution');
const MemberModel = require('../models/membership');
const { GetOne } = require("./membership");
const MembershipModel = require("../models/membership");

exports.Create = async (data) => {
    try {
        const rounds = await Model.find({ equbType: data.equbType }).countDocuments();
        const equbType = await EqubTypeModel.findById({
            _id: data.equbType
        });
        const cycle = Math.floor(rounds/equbType.maxUniqueIds)+1        

        const response = await Model.create({
            ...data,
            round: rounds + 1,
            cycle
        });

        const members = await MemberModel.find({
            isActive: true,
            deleted:false,
            equbType: data.equbType
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

exports.AddMemberToRound = async (req) => {
    try {
        const {
            id
        } = req.params
        const memberShip = await MembershipModel.findById(req.body.member)
        .populate("member equbType equbLevel uniqueId")
        const activeRound = await Model.findOne({ closed: false,equbType:id })
        if (activeRound._id) {
            const res = await ContributionModel.create({
                member: memberShip._id,
                round: activeRound._id
            })            
            return res
        }
        return {
            error: true,
            message: "There is no active round"
        }
    } catch(err) {
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

exports.GetActive = async (equbType) => {
    try {
        const response = await Model.findOne({
            equbType,
            closed: false
            })
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
            equbType: req.params.id
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

        const response = await Model.deleteOne({
            _id: id
        })
        return response;
    } catch (err) {
        return err
    }
}