const Joi = require("joi");
const { sendResponse } = require("../helpers/requestHandler.helper");
const { uniqueEmail } = require("./rules");
const { validate: uuidValidate } = require("uuid");

const loginValidation = async (data) => {
  try {
    const validateSchema = Joi.object({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
    });
    return validateSchema.validate(data, {
      abortEarly: true,
      allowUnknown: true,
    });
  } catch (err) {
  }
};
const registerValidation = async (data) => {
  try {
    const validateSchema = Joi.object({
      firstName: Joi.string().required().min(2).max(10),
      lastName: Joi.string().required().min(2).max(10),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
      role: Joi.string().required(),
    });
    return validateSchema.validate(data, {
      abortEarly: false,
      allowUnknown: true,
    });
  } catch (err) {
  }
};

const refreshTokenValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      token: Joi.string().required(),
    });

    let { value, error } = schema.validate(req.body);

    if (error !== undefined) {
      return sendResponse(res, false, 422, error.details[0].message);
    }

    if (!uuidValidate(value.token)) {
      return sendResponse(res, false, 422, "Invalid Token.");
    }

    //set the variable in the request for validated data
    req.validated = value;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginValidation,
  registerValidation,
  refreshTokenValidation,
};
