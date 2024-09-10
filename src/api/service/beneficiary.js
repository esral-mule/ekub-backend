const Model = require("../models/beneficiary");
const { GetActive } = require("./round");
const UniqueIdsService = require("./uniqueId");

async function getMetaInfo(id) {
    const previousUniqueId = await UniqueIdsService.GetOne(id);
    const activeRound = await GetActive(previousUniqueId.equbType)
    const {cycle} = activeRound;    
    const pot = previousUniqueId.equbType.maxUniqueIds * previousUniqueId.equbType.contribution
    return {
        round:activeRound,
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
            ...metaInfo,
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
            },
        }
        await UniqueIdsService.Update(req);

        const wins = await calculateWins(data.uniqueId);

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

exports.GetByRound = async (req) => {
    try {
        const {id} = req.params  
        const response = await Model.findOne({
            round:id
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
        const skip = (page - 1) * (limit || 1000);
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
            .limit(limit || 10)
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