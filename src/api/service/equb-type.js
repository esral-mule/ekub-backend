const EqubType = require("../models/equb-type");
const { GetByMember } = require("./membership");
const UniqueIdsService = require("./uniqueId")

exports.CreateEqubType = async (equbTypeData) => {
    try {
        const response = await EqubType.create(equbTypeData);

        // create unique number automatically
        await UniqueIdsService.InsertMany(response.maxUniqueIds, response._id)
        return response;
    } catch (err) {
        return err
    }
}

exports.GetOne = async (id) => {
    try {
        const response = await EqubType.findById({
            _id: id
        })
        return response;
    } catch (err) {
        return err
    }
}

exports.GetForMember = async (req) => {
    try {
      return await GetByMember(req)
    } catch (error) {
      return error;
    }
  };

exports.GetAll = async (req) => {
    try {
        const {
            limit,
            page,
            queryName,
            searchQuery,
            sort,
            populate
        } = req.query;
        const skip = (page - 1) * (limit || 10);
        const filter = {
            equbHouse: req.user,
            deleted: false
        }

        if (queryName) {
            filter[queryName] = {
                $regex: searchQuery,
                $options: 'i'
            };
        }

        const response = await EqubType
            .find(filter)
            .sort(sort)
            .skip(skip || 0)
            .limit(limit || 1000)

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
        const response = await EqubType.updateOne({
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

        const response = await EqubType.updateOne({
            _id: id
        }, { $set: { deleted: true }})
        return response;
    } catch (err) {
        return err
    }
}