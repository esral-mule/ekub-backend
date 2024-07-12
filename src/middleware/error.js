const { ValidationError } = require('express-validation');
const APIError = require('../utils/APIError');
const { env } = require('../config/env-vars');


const Handler = (err, req, res, next) => {
  let _message = ""
  if (err.stack.indexOf("MongoServer") !== -1) {
    const _err = err.message.split(" ");
    const type = _err[_err.indexOf("index:")+1]
    const coll = _err.slice(1, _err.indexOf("collection:")-1).join(' ')
    _message = `${coll} ${type}`
  }
  const response = {
    code: err.status || 500,
    message: _message,
    errors: err.errors,
    stack: err.stack,
  };
  if (env === 'production') delete response.stack;
  res.status(response.code).json(response);
  res.end();
};

exports.ErrorHandler = Handler;
exports.Handler = Handler;

exports.ConvertError = (err, req, res, next) => {
  let ConvertedError = err;
  if (err instanceof ValidationError) {
    const errors = [];
    const entries = Object.entries(err.details);
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      errors.push(
        ...value.map((e) => ({
          location: key,
          messages: e.message.replace(/[^\w\s]/gi, ''),
          field: e.path[0],
        }))
      );
    }

    ConvertedError = new APIError({
      message: 'Validation Error',
      status: err.statusCode || 400,
      errors,
    });
  } else if (!(err instanceof APIError)) {
    ConvertedError = new APIError({
      message: err.message,
      status: err.status,
      stack: err.stack,
    });
  }
  return Handler(ConvertedError, req, res, next);
};

exports.NotFound = (req, res, next) => {
  const err = new APIError({
    message: 'Resource Not Found',
    status: 404,
  });
  return Handler(err, req, res, next);
};

exports.RateLimitHandler = (req, res, next) => {
  const err = new APIError({
    message: 'Rate limt exceeded, please try again later some time.',
    status: 429,
  });
  return Handler(err, req, res, next);
};
