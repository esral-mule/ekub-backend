const Model = require("../models/contribution");

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
            .populate([{
                    path: 'round',
                    populate: {
                        path: 'equbType'
                    }
                },
                {
                    path: 'member',
                    populate: [{
                            path: 'equbLevel'
                        },
                        {
                            path: 'uniqueId'
                        },
                        {
                            path: 'member'
                        }
                    ]
                }
            ])
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
            round: req.params.id,
            deleted: false
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
            .populate([{
                    path: 'round',
                    populate: {
                        path: 'equbType'
                    }
                },
                {
                    path: 'member',
                    populate: [{
                            path: 'equbLevel'
                        },
                        {
                            path: 'uniqueId'
                        },
                        {
                            path: 'member'
                        }
                    ]
                }
            ])

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
        return response;
    } catch (err) {
        return err
    }
}