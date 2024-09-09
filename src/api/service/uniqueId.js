const {
    Types
} = require("mongoose");
const Model = require("../models/uniqueId");
const RoundModel = require("../models/round");
const { GetActive } = require("./round");
const BeneficiaryModel = require("../models/beneficiary")
const UniqueIdModel = require("../models/uniqueId")

exports.InsertMany = async (maxUniqueIds, id) => {
    try {
        const uniqueIds = [];
        for (let i = 0; i < maxUniqueIds; i++) {
            uniqueIds.push({
                equbType: id,
                uniqueId: i + 1,
            })
        }
        const response = await Model.insertMany(uniqueIds);
        console.log("\nDONE CREATING UNIQUE IDS OF EQUB.\n", response.length)
        return response;
    } catch (err) {
        return err
    }
}

exports.AddMember = async (uniqueIdId, memeberId) => {
    try {
        const previousUniqueId = await Model.findById({
            _id: uniqueIdId,
        });
        const idObjectId = new Types.ObjectId(memeberId)
        const newMembers = previousUniqueId.members ? previousUniqueId.members.concat([idObjectId, ]) : [idObjectId];

        const response = await Model.updateOne({
            _id: uniqueIdId
        }, {
            $set: {
                members: newMembers,
            }
        })

        console.log(`\nMember binded with UniqueID ${previousUniqueId.uniqueId}`)
        return response;
    } catch (err) {
        return err
    }
}

exports.RemoveMember = async (uniqueIdId, membershipId) => {
    try {
      const previousUniqueId = await Model.findById({
        _id: uniqueIdId,
      });
  
      const membershipObjectId = new Types.ObjectId(membershipId);
  
      const newMembers = previousUniqueId.members.filter(
        (member) => !member.equals(membershipObjectId)
      );
  
      const response = await Model.updateOne(
        { _id: uniqueIdId },
        {
          $set: {
            members: newMembers,
          },
        }
      );  
      return response;
    } catch (err) {
      return err;
    }
  };

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
        }).populate([{
                path: 'members',
                populate: [{
                        path: 'member'
                    },
                    {
                        path: 'equbLevel'
                    }
                ]
            },
            {
                path: 'equbType'
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
            uniqueId,
            isFull,
            isWinner,
            sort
        } = req.query;
        const skip = (page - 1) * (limit || 10);
        const filter = {
            equbType: req.params.id
        }

        if (uniqueId) filter.uniqueId = Number(uniqueId)
        if ((typeof Boolean(isFull)) === (typeof true)) filter.isFull = isFull === 'true'
        if ((typeof Boolean(isWinner)) === (typeof true)) filter.isWinner = isWinner

        const response = await Model
            .find({
                ...filter,
            })
            .sort(sort)
            .skip(skip || 0)
            .limit(limit || 1000)
            .populate([{
                    path: 'members',
                    populate: [{
                            path: 'member'
                        },
                        {
                            path: 'equbLevel'
                        }
                    ]
                },
                {
                    path: 'equbType'
                }
            ])

        return response;
    } catch (err) {
        return err
    }
}

exports.GetNotFull = async (req) => {
    try {

        const response = await Model
            .find({
                equbType: req.params.id,
                isFull:false
            })
            .populate([{
                    path: 'members',
                    populate: [{
                            path: 'member'
                        },
                        {
                            path: 'equbLevel'
                        }
                    ]
                },
                {
                    path: 'equbType'
                }
            ])

        return response;
    } catch (err) {
        return err
    }
}

exports.GetAvailable= async (equbType) => {
    try {
      // get the latest cycle from the active round in the equbType
      const activeRound = await GetActive(equbType)
      if(!activeRound){
        throw new Error("There is no active round");
       }
      const roundsInCycle = await RoundModel.find({cycle: activeRound.cycle,equbType,closed:true }).select('_id');
      // Extract the round IDs for the given cycle
      const roundIds = roundsInCycle.map(round => round._id);
      // Find uniqueIds that are already associated with beneficiaries for any round in this cycle
      const usedUniqueIds = await BeneficiaryModel.find({
        round: { $in: roundIds }
      }).distinct('uniqueId');
      // Find uniqueIds that are not in the usedUniqueIds array
      const availableUniqueIds = await UniqueIdModel.find({
        equbType,
        _id: { $nin: usedUniqueIds },
      }).populate('equbType members');
  
      return availableUniqueIds;
    } catch (error) {
      throw new Error(error.message);
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