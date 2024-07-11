const { Schema, model, Types } = require('mongoose');

const APIError = require('../../utils/APIError');

const {
  NO_RECORD_FOUND,
  NOT_FOUND,
  VALIDATION_ERROR,
} = require('../../utils/constants');

const AnswerModel = new Schema({
  question: {
    type: Schema.Types.ObjectId,
    ref: 'questions',
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  upvotes: {
    type: Number, 
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  accepted: {
    type: Boolean,
    default: true
  },
  isAnon: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

AnswerModel.pre('find', async function find(next) {
  try {
    if (this.isAnon) return next();
    this.author = undefined;
    return next();
  } catch (err) {
    return next(err);
  }
});

AnswerModel.method({
  transform() {
    const transformed = {};
    const fields = [
      'id',
      'question',
      this.isAnon === true ? undefined : 'author',
      'upvotes',
      'downvotes',
      'body',
      'isAnon',
      'accepted'
    ];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },
});

AnswerModel.statics = {
    async get(id) {
    if (!Types.ObjectId.isValid(id)) {
      throw new APIError({
        message: VALIDATION_ERROR,
        errors: [
          {
            field: 'id',
            answer: 'params',
            messages: 'Please enter valid Answer ID',
          },
        ],
        status: NOT_FOUND,
      });
    }
    const answer = await this.findById(id).populate(["author"]).exec();
    if (!answer)
      throw new APIError({
        message: NO_RECORD_FOUND,
        status: NOT_FOUND,
      });
    return answer;
  },
};

module.exports = model('answers', AnswerModel);
