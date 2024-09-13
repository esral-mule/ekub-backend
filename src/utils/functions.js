const APIError = require("./APIError");
const { BAD_REQUEST } = require("./constants");

const validateAndCovertPhoneNumber = (req, res, next) => {
  let { phoneNumber } = req.body;
  if (phoneNumber.startsWith("+")) {
    phoneNumber= phoneNumber.replace("+251", "0");
  }
  
  if (phoneNumber.length !== 10 || !(phoneNumber.startsWith("09"))) {
    const err = new APIError({
      message: "Validation Error",
      status: BAD_REQUEST,
      errors:[
        {
          "field":"phoneNumber",
          "messages":"invalid Phone Number"
        }
      ]
    });
    return next(err);
  }

  req.body.phoneNumber = phoneNumber;
  return next();
};

module.exports = {
  validateAndCovertPhoneNumber,
};
