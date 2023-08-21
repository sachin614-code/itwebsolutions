const Joi = require("joi");
const { sendResponse } = require("../helpers/requestHandler.helper");
const venueModel = require("../models/venue.model")
exports.addVenueValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      venueName: Joi.string().max(50).required().trim(),
      defaultTimeIncrement: Joi.string(),
      paymentTerms: Joi.string().max(50),
      days: Joi.string().max(50),
    }).options({ allowUnknown: true });

    const { value, error } = schema.validate(req.body);

    if (error !== undefined) {
      return sendResponse(res, false, 422, error.details[0].message);
    }

    let result = await venueModel.countDocuments({
      venueName: req.body.venueName,
      isDelete: false,
    });
    let validateValue = result > 0 ? false : true;
    if (!validateValue) {
      return sendResponse(
        res,
        false,
        422,
        "Venue Name already exists. Please try with different."
      );
    }

    // set the variable in the request for validated data
    req.validated = value;
    next();
  } catch (error) {
    next(error);
  }
};
