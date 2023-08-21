const express = require("express");
const router = express.Router();
const { authenticated } = require("../middlewares/authenticated.middleware");
const {
  uploadTypeValidation,
  uploadValidation,
} = require("../validationSchema/upload");
const { upload, uploadSingle } = require("../controller/upload");

router.post(
  "/single",
  authenticated,
  uploadTypeValidation,
  uploadValidation,
  uploadSingle
);
router.post(
  "/multiple",
  authenticated,
  uploadTypeValidation,
  uploadValidation,
  upload
);

module.exports = router;
