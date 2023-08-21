const Joi = require("joi");
const { sendResponse } = require("../helpers/requestHandler.helper");
const CourtModel = require("../models/court.model");
const { validateMongoObjectId } = require("./rules");

const addCourtValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courtName: Joi.string().min(2).max(50).required().trim(),
      seatingRows: Joi.string().required().trim(),
      baselineDistance: Joi.string().required().trim(),
      sidelineDistance: Joi.string().required().trim(),
    }).options({ allowUnknown: true });

    const { value, error } = schema.validate(req.body);

    if (error !== undefined) {
      return sendResponse(res, false, 422, error.details[0].message);
    }

    let result = await CourtModel.countDocuments({
      courtName: req.body.courtName,
      isDelete: false,
    });
    let validateValue = result > 0 ? false : true;
    if (!validateValue) {
      return sendResponse(
        res,
        false,
        422,
        "Court Name already exists. Please try with different."
      );
    }

    // set the variable in the request for validated data
    req.validated = value;
    next();
  } catch (error) {
    next(error);
  }
};

const updateCourtValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courtName: Joi.string().min(2).max(50).required().trim(),
      seatingRows: Joi.string().required().trim(),
      baselineDistance: Joi.string().required().trim(),
      sidelineDistance: Joi.string().required().trim(),
    }).options({ allowUnknown: true });

    const { value, error } = schema.validate(req.body);

    if (error !== undefined) {
      return sendResponse(res, false, 422, error.details[0].message);
    }

    let result = await CourtModel.countDocuments({
      courtName: req.body.courtName,
      isDelete: false,
      _id: { $ne: req.params.id },
    });
    let validateValue = result > 0 ? false : true;
    if (!validateValue) {
      return sendResponse(
        res,
        false,
        422,
        "Court Name already exists. Please try with different."
      );
    }
    // set the variable in the request for validated data
    req.validated = value;
    next();
  } catch (error) {
    next(error);
  }
};

const getCourtValidation = async (req, res, next) => {
  try {
    await validateMongoObjectId(req.params.id);
    // set the variable in the request for validated data
    //  req.validated = value;
    next();
  } catch (error) {
    next(error);
  }
};

const getCourtAvailabilityValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      venueId: Joi.string().required().trim(),
    });

    const { value, error } = schema.validate(req.query);

    if (error !== undefined) {
      return sendResponse(res, false, 422, error.details[0].message);
    }

    await validateMongoObjectId(req.query.venueId);
    // set the variable in the request for validated data
    req.validated = value;
    next();
  } catch (error) {
    next(error);
  }
};

const updateCourtAvailabilityValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      updatedCourtAvailability: Joi.required(),
    });
    const { value, error } = schema.validate(req.body);
    await validateMongoObjectId(req.params.id);

    if (error !== undefined) {
      return sendResponse(res, false, 422, error.details[0].message);
    }

    // set the variable in the request for validated data
    req.validated = value;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCourtValidation,
  updateCourtValidation,
  getCourtAvailabilityValidation,
  updateCourtAvailabilityValidation,
  getCourtValidation,
};
