const { sendResponse } = require("../helpers/requestHandler.helper");
const path = require("path");
const Joi = require("joi");
allowedExtension = [
  ".png",
  ".jpg",
  ".jpeg",
  ".jfif",
  ".pjpeg",
  ".pjp",
  ".avif",
  ".csv",
  ".pdf",
  ".xlsx",
];

const uploadTypeValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      type: Joi.string().trim().min(1).required(),
    }).options({ allowUnknown: true });

    const { value, error } = schema.validate(req.body);

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

const uploadValidation = async (req, res, next) => {
  try {
    if (req.files == undefined)
      return sendResponse(res, false, 400, "Upload Atleast one document");
    const file = req.files.file;
    if (file.length > 1) {
      for (const element of file) {
        const extensionName = path.extname(element.name);
        if (!allowedExtension.includes(extensionName))
          return sendResponse(
            res,
            false,
            422,
            "The File format is not allowed"
          );
        // Check filesize
        if (element.size > process.env.MAX_FILE_UPLOAD) {
          return sendResponse(
            res,
            false,
            400,
            `The File should be less than 8 Mb`
          );
        }
      }
    } else {
      const extensionName = path.extname(file.name);
      if (!allowedExtension.includes(extensionName))
        return sendResponse(res, false, 422, "The File format is not allowed");
      // Check filesize
      if (file.size > process.env.MAX_FILE_UPLOAD) {
        return sendResponse(
          res,
          false,
          400,
          `The File should be less than 8 Mb`
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadValidation,
  uploadTypeValidation,
};
