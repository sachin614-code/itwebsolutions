const express = require("express");
const router = express.Router();
const { authenticated } = require("../middlewares/authenticated.middleware");
const { registerValidation } = require("../validationSchema/auth-schema");
const {
  dashboard,
  getUsers,
  getProfile,
  deleteProfile,
  changeStatus,
  userForm,
  addUser,
  updateProfile,
  getVenues,
  getVenueDetails,
  getCourts,
  editCourt,
  updateVenue,
  venueForm,
  addVenue,
  addCourt,
  deleteCourt,
  updateCourt,
} = require("../controller/admin.controller");
const { addVenueValidation } = require("../validationSchema/venue");
const { addCourtValidation } = require("../validationSchema/court");

router.get("/", (req, res) => res.redirect("/dashboard"));

router.get("/dashboard", authenticated, dashboard);

router.get("/getUsers", authenticated, getUsers);

router.get("/user/add", authenticated, userForm);

router.post("/user/add", authenticated, addUser);

router.get("/profile/:id", authenticated, getProfile);
router.get("/profile/delete/:id", authenticated, deleteProfile);
router.get("/profile/status/:id", authenticated, changeStatus);

router.post("/profile/:id", authenticated, updateProfile);

router.get("/venues", authenticated, getVenues);
router.get("/venues/add", authenticated, venueForm);
router.post("/venues/add", authenticated, addVenueValidation, addVenue);
router.get("/venues/details/:id", authenticated, getVenueDetails);
router.post("/venues/update", authenticated, updateVenue);

router.post("/court/add", authenticated, addCourtValidation, addCourt);
router.get("/court/edit/:id", authenticated, editCourt);
router.post("/court/update", authenticated, updateCourt);
router.get("/court/delete/:id", authenticated, deleteCourt);

router.get("/courts", authenticated, getCourts);

module.exports = router;
