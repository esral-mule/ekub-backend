const Model = require("../models/beneficiary");
const UniqueIdsService = require("./uniqueId");

async function getMetaInfo(id, history = 1) {
    const previousUniqueId = await UniqueIdsService.GetOne(id);
    const totalDraws = await Model.find().countDocuments() + history;
    const cycle = Math.floor(totalDraws / previousUniqueId.equbType.maxUniqueIds)
    const pot = previousUniqueId.equbType.maxUniqueIds * previousUniqueId.equbType.contribution
    return {
        totalDraws,
        cycle,
        pot
    }
}

async function calculateWins(id) {
    const previousUniqueId = await UniqueIdsService.GetOne(id);
    const metaInfo = await getMetaInfo(id);

    const wins = previousUniqueId.members.map((val) => {
        const {
            pot
        } = metaInfo;
        const {
            member,
            equbLevel
        } = val;

        const percentage = equbLevel.contribution / previousUniqueId.equbType.contribution;
        const win = {
            member: {
                _id: member._id,
                fullName: member.fullName,
                phoneNumber: member.phoneNumber,
            },
            percentage,
            strPercentage: `${(percentage * 100).toFixed(2)}%`,
            cash: pot * percentage
        }
        return win
    })

    return wins;
}

exports.Create = async (data) => {
    try {
        const previousUniqueId = await UniqueIdsService.GetOne(data.uniqueId);

        const metaInfo = await getMetaInfo(data.uniqueId);

        const response = await Model.create({
            ...data,
            ...metaInfo
        });

        const req = {
            params: {
                id: previousUniqueId._id
            },
            body: {
                members: previousUniqueId.members.map(val => val._id),
                equbType: previousUniqueId.equbType._id,
                uniqueId: previousUniqueId.uniqueId,
                isFull: previousUniqueId.isFull,
                isWinner: true,
            },
        }
        await UniqueIdsService.Update(req);

        const wins = await calculateWins(data.uniqueId);

        console.info({
            metaInfo,
            wins
        })

        return {
            response,
            wins
        };
    } catch (err) {
        return err
    }
}

exports.GetWins = async (id) => {
    const metaInfo = await getMetaInfo(id);
    const wins = await calculateWins(id, metaInfo);

    return wins
}

exports.GetOne = async (id) => {
    try {
        const response = await Model.findById({
            _id: id
        }).populate({
            path: 'uniqueId',
            populate: [{
                path: 'members',
                populate: [{
                        path: 'equbLevel',
                    },
                    {
                        path: 'equbType'
                    },
                    {
                        path: 'member'
                    }
                ]
            }]
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
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'uniqueId',
                populate: [{
                    path: 'members',
                    populate: [{
                            path: 'equbLevel',
                        },
                        {
                            path: 'equbType'
                        },
                        {
                            path: 'member'
                        }
                    ]
                }]
            })

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