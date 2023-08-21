const { sendResponse } = require("../helpers/requestHandler.helper");

const {
  S3_ACCESS_KEY,
  S3_BUCKET_REGION,
  S3_BUCKET,
  S3_SECRET_ACCESS_KEY,
} = require("../config/s3.config");

const S3 = require("aws-sdk/clients/s3");

const s3 = new S3({
  accessKeyId: S3_ACCESS_KEY, // your AWS access id
  secretAccessKey: S3_SECRET_ACCESS_KEY, // your AWS access key
});

/**
 * Description: Login user into the application
 * @param {file[]} req
 * @param {*} res
 * @param {*} next
 */
exports.upload = async (req, res, next) => {
  try {
    if (!req.files) {
      return sendResponse(res, false, 400, "file not selected");
    }

    const file = req.files.file;
    const type = req.body.type;
    let data = [];
    if (Array.isArray(file)) {
      for (i of file) {
        let img = await save(i, type);
        data.push(img);
      }
    } else {
      let img = await save(file, type);
      data.push(img);
    }

    return sendResponse(res, true, 200, "Uploaded successfully", {
      data,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * Description: Login user into the application
 * @param {file} req
 * @param {*} res
 * @param {*} next
 */
exports.uploadSingle = async (req, res, next) => {
  try {
    if (!req.files) {
      return sendResponse(res, false, 400, "file not selected");
    }

    const file = req.files.file;
    const type = req.body.type;

    let img = await save(file, type);
    let data = img;

    return sendResponse(res, true, 200, "Uploaded successfully", {
      data,
    });
  } catch (error) {
    next(error);
  }
};

async function save(file, type) {
  try {
    const key = `${type}/${Date.now()}-${file.name}`;
    const params = {
      Bucket: `${S3_BUCKET}`,
      Key: key,
      Region: S3_BUCKET_REGION,
      Body: file.data,
      ContentType: file.mimetype,
    };
    const uploaded = await s3.upload(params).promise();
    return uploaded.Key;
  } catch (e) {
    return e;
  }
}
