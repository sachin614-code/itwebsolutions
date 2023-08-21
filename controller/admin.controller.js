const UserModel = require("../models/user.model");
const eventModel = require("../models/event.model");
const venueModel = require("../models/venue.model");
const CourtModel = require("../models/court.model");
const CourtAvailabiltyModel = require("../models/court/courtAvailability.model");
const { registerValidation } = require("../validationSchema/auth-schema");
const { sendResponse } = require("../helpers/requestHandler.helper");
const mongoose = require("mongoose");

/**
 *
 * Handle get all users Get Request
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 */

exports.getUsers = async (req, res, next) => {
  try {
    let filter = req.query;
    const getCourts = await UserModel.find({
      isDelete: false,
      ...filter,
    })
      .sort([["updatedAt", -1]])
      .lean();
    let totalRecords = await UserModel.countDocuments({
      isDelete: false,
      ...filter,
    }).exec();
    let profile = await UserModel.findById(req.session.userId);
    return res.render("users", {
      currentUrl: "Users",
      getCourts,
      totalRecords,
      profile,
      filter,
    });
    // return res.json({ getCourts, totalRecords });
  } catch (error) {
    return res.json({ err: "Internal Server Error" });
  }
};

/**
 *
 * Handle dashboard get request
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 */
exports.dashboard = async (req, res, next) => {
  try {
    let profile = await UserModel.findById(req.session.userId);
    const totalAdmin = await UserModel.count({
      role: "admin",
      isDelete: false,
    });
    const totalReferee = await UserModel.count({
      role: "referee",
      isDelete: false,
    });
    const totalCoach = await UserModel.count({
      role: "coach",
      isDelete: false,
    });
    const totalParent = await UserModel.count({
      role: "parent",
      isDelete: false,
    });
    const totalPlayer = await UserModel.count({
      role: "player",
      isDelete: false,
    });
    const totalGameStaff = await UserModel.count({
      role: "gameStaff",
      isDelete: false,
    });
    const totalProgramStaff = await UserModel.count({
      role: "programStaff",
      isDelete: false,
    });
    const totalFan = await UserModel.count({ role: "fan", isDelete: false });
    const totalEvent = await eventModel.count();
    const totalVenue = await venueModel.count();

    let statData = [
      { tittle: "Admin", count: totalAdmin, role: "admin" },
      { tittle: "Referee", count: totalReferee, role: "referee" },
      { tittle: "Coach", count: totalCoach, role: "coach" },
      { tittle: "Parent", count: totalParent, role: "parent" },
      { tittle: "Player", count: totalPlayer, role: "player" },
      { tittle: "GameStaff", count: totalGameStaff, role: "gameStaff" },
      {
        tittle: "ProgramStaff",
        count: totalProgramStaff,
        role: "programStaff",
      },
      { tittle: "Fan", count: totalFan, role: "fan" },
      { tittle: "Events", count: totalEvent },
      { tittle: "Venues", count: totalVenue },
    ];

    return res.render("dashboard", {
      currentUrl: "Dashboard",
      profile,
      statData,
    });
  } catch (err) {
    return res.json({ err: "Internal Server Error" });
  }
};

/**
 *
 * Handle get profile by id get request
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 */

exports.getProfile = async (req, res, next) => {
  let profile = await UserModel.findById(req.session.userId);
  let userProfile = await UserModel.findById(req.params.id);
  res.render("Profile", { currentUrl: "Users", userProfile, profile });
};

/**
 *
 * Handle delete profile by id get request
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 */

exports.deleteProfile = async (req, res, next) => {
  try {
    let isDeleted = await UserModel.findByIdAndUpdate(req.params.id, {
      isDelete: true,
    });
    if (!isDeleted) return res.json({ err: "Internal Server Error" });
    return res.redirect("/getUsers");
  } catch (err) {
    return res.json({ err: "Internal Server Error" });
  }
};

/**
 *
 * Handle delete courts by id get request
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 */

exports.deleteCourt = async (req, res, next) => {
  try {
    let isDeleted = await CourtModel.findByIdAndUpdate(req.params.id, {
      isDelete: true,
    });
    if (!isDeleted) return res.json({ err: "Internal Server Error" });
    return sendResponse(res, true, 200, "Court Deleted Successfully!", "");
  } catch (err) {
    return sendResponse(res, true, 400, "Something went wrong!", err);
  }
};

/**
 *
 * Handle change user status get request
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 */

exports.changeStatus = async (req, res, next) => {
  try {
    let user = await UserModel.findById(req.params.id);
    let status = "";
    user.status == "active" ? (status = "inactive") : (status = "active");
    let isUpdated = await UserModel.findByIdAndUpdate(req.params.id, {
      status,
    });
    if (!isUpdated) return res.json({ err: "Internal Server Error" });
    return res.redirect(req.get("Referrer"));
  } catch (err) {
    return res.json({ err: "Internal Server Error" });
  }
};

exports.userForm = async (req, res) => {
  try {
    let profile = await UserModel.findById(req.session.userId);
    return res.render("UserAddForm", { currentUrl: "Users", profile });
  } catch (err) {
    return res.json({ err: "Internal Server Error" });
  }
};

exports.addUser = async (req, res) => {
  try {
    let profile = await UserModel.findById(req.session.userId);
    const { error } = await registerValidation(req.body);
    if (error) {
      let ErrorData = [];
      error.details.map((er) => {
        let splitedError = er.message.split(`"`);
        ErrorData.push(`${splitedError[1]}${splitedError[2]}`);
      });

      return res.render("UserAddForm", {
        currentUrl: "Users",
        err: ErrorData,
        profile,
      });
    }
    if (req.body.password !== req.body.cpassword)
      return res.render("UserAddForm", {
        currentUrl: "Users",
        err: [`Password doesn't matched!`],
        profile,
      });
    const isExist = await UserModel.findOne({ email: req.body.email });
    if (isExist)
      return res.render("UserAddForm", {
        currentUrl: "Users",
        err: [`${req.body.email} already exist!`],
        profile,
      });
    let newUser = new UserModel(req.body);
    await newUser.save();
    return res.redirect("/getusers");
  } catch (err) {
    return res.json({ err: "Internal Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const isUpdated = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!isUpdated)
      return res.status(400).json({ err: "Something went wrong" });

    return res.status(200).json({ msg: "Profile Updated" });
  } catch (err) {
    return res.status(400).json({ err: "Internal Server Error" });
  }
};

exports.getVenues = async (req, res) => {
  let profile = await UserModel.findById(req.session.userId);
  let filter = req.query;
  const getVenues = await venueModel.aggregate([
    {
      $match: {
        isDelete: false,
      },
    },
    {
      $lookup: {
        from: "courts",
        localField: "courtId",
        foreignField: "_id",
        as: "courtInfo",
      },
    },
    {
      $group: {
        _id: "$_id",
        venueName: { $first: "$venueName" },
        courtId: { $first: "$courtId" },
        createdAt: { $first: "$createdAt" },
        venueAddress: { $first: "$venueAddress" },
        courtInfo: { $first: "$courtInfo" },
        ratings: {
          $push: "$courtInfo.courtRating",
        },
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        _id: 1,
        venueName: 1,
        createdAt: 1,
        courtInfo: 1,
        totalCourts: { $size: "$courtId" },
        location: {
          $concat: ["$venueAddress.city", ",", "$venueAddress.state"],
        },
        distance: { $ifNull: ["$distance", "3"] },
        ratings: { $arrayElemAt: ["$ratings", 0] },
        courtCost: { $literal: "red" },
        availabilityDays: { $literal: "10 days" },
      },
    },
  ]);
  let totalRecords = await venueModel.countDocuments({ isDelete: false });
  return res.render("venues", {
    currentUrl: "Venues",
    profile,
    getVenues,
    totalRecords,
    filter,
  });
};

exports.venueForm = async (req, res) => {
  try {
    let profile = await UserModel.findById(req.session.userId);
    return res.render("venueForm", { currentUrl: "Venues", profile });
  } catch (err) {
    return res.json({ err: "Internal Server Error" });
  }
};

/**
 * @method addVenue
 * @param {string} venueName                Venue name
 * @param {objectId} courtId                Court Id to get court data
 * @param {string} defaultTimeIncrement     Time increment
 * @param {string} paymentTerms             Payment Terms
 * @param {string} days                     Days
 * @param {object} venueAddress             Venue address
 * @param {object} manager                  Manager
 * @param {object} scheduleManager          Schedule manager
 * @param {object} paymentManager           Payment manager
 * @param {object} facilityManager          Facility manager
 * @description                             Add Venue into the application
 * @returns {Object}
 */

exports.addVenue = async (req, res) => {
  try {
    let newVenue = await new venueModel({
      ...req.body,
      createdBy: req.session.userId,
    });
    const saveVenue = await newVenue.save();
    return sendResponse(res, true, 200, "Venue Added Successfully", saveVenue);
  } catch (error) {
    return sendResponse(res, true, 500, "Internal Server Error", error);
  }
};

/**
 * @method addCourt
 * @param {string} CourtName               Court Name
 * @param {number} numberOfGyms            Number of gyms
 * @param {number} costPerHour             Cost per hour
 * @param {string} seatingRows             Seating rows
 * @param {string} floorRating             Floor rating
 * @param {string} floorMaterial           Floor material
 * @param {string} baselineDistance        Baseline distance
 * @param {string} sidelineDistance        Sideline distance
 * @param {string} sidelineDistance        Sideline distance
 * @param {date} availability              Availability date & time
 * @description                            Add Court into the application
 * @returns {Object}
 */

exports.addCourt = async (req, res) => {
  try {
    let newCourt = await new CourtModel({
      ...req.body,
      createdBy: req.session.userId,
    });
    const saveCourt = await newCourt.save();

    let venueId = req.query.venueId;
    if (venueId) {
      const updateCourt = await venueModel.updateOne(
        { _id: venueId },
        {
          $push: {
            courtId: saveCourt._id,
          },
        }
      );
    }

    return sendResponse(res, true, 200, "Court Added Successfully", saveCourt);
  } catch (error) {
    return sendResponse(res, true, 500, "Internal Server Error", error);
  }
};

exports.getCourts = async (req, res) => {
  let profile = await UserModel.findById(req.session.userId);
  return res.render("courts", { currentUrl: "Courts", profile });
};

exports.editCourt = async (req, res) => {
  try {
    let id = mongoose.Types.ObjectId(req.params.id);
    //let getCourt = await CourtModel.findById(id);
    const getCourt = await CourtModel.findById(id).lean();
    if (getCourt) {
      const getCourtAvailability=await CourtAvailabiltyModel.findOne({courtId:id})
      .lean()
      .select(['availability']);
      getCourt.availability=(getCourtAvailability)?getCourtAvailability.availability:[]
    }
      return sendResponse(res, true, 200, "Court Fetch Successfully", getCourt);
  } catch (error) {
    return sendResponse(res, true, 500, "Internal Server Error", error);
  }
};

exports.updateCourt = async (req, res) => {
  try {
    let court_id = mongoose.Types.ObjectId(req.body.court_id);

    let checkCourtCount = await CourtModel.countDocuments({
      _id: { $ne: court_id },
      courtName: { $eq: req.body.courtName },
      isDelete: false,
    });
    let validateValue = checkCourtCount > 0 ? false : true;
    if (!validateValue) {
      return sendResponse(
        res,
        false,
        422,
        "Court Name already exists. Please try with different."
      );
    }

    let UpdateCourts = await CourtModel.findByIdAndUpdate(court_id, {
      baselineDistance: req.body.baselineDistance,
      courtName: req.body.courtName,
      courtRating: req.body.courtRating,
      floorMaterial: req.body.floorMaterial,
      floorRating: req.body.floorRating,
      locationAndParkingInstructions: req.body.locationAndParkingInstructions,
      numberOfGyms: req.body.numberOfGyms,
      seatingRows: req.body.seatingRows,
      sidelineDistance: req.body.sidelineDistance,
      type: req.body.type,
      exteriorPhotos: req.body.exteriorPhotos ? req.body.exteriorPhotos : [],
      courtFloorPhotos: req.body.courtFloorPhotos
        ? req.body.courtFloorPhotos
        : [],
      gymPhotos: req.body.gymPhotos ? req.body.gymPhotos : [],
      costPerHour: req.body.costPerHour,
    });
    if (!UpdateCourts)
      return sendResponse(res, true, 500, "Internal server error", error);

    let courts = await CourtModel.findById(court_id);
    return sendResponse(res, true, 200, "Court updated successfully", courts);
  } catch (error) {
    return sendResponse(res, true, 500, "Internal server error", error);
  }
};

exports.getVenueDetails = async (req, res) => {
  try {
    let id = req.params.id;
    let profile = await UserModel.findById(req.session.userId);
    let filter = req.query;

    const getVenueDetails = await venueModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
          isDelete: false,
        },
      },
      {
        $lookup: {
          from: "courts",
          let: { courts: "$courtId" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$courts"] },
              },
            },
            {
              $project: {
                _id: 1,
                courtName: 1,
                costPerHour: 1,
                type: 1,
                floorRating: 1,
                floorMaterial: 1,
                courtRating: 1,
                courtFloorPhotos: 1,
              },
            },
            {
              $lookup: {
                from: "courtavailabilities",
                let: { courtId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$courtId", "$$courtId"] },
                    },
                  },
                  {
                    $project: { availability: 1 },
                  },
                ],

                as: "courtAvailabilities",
              },
            },
          ],
          as: "courtId",
        },
      },
      {
        $project: {
          venueName: 1,
          courtId: 1,
          venueAddress: 1,
          location: {
            $concat: ["$venueAddress.city", ",", "$venueAddress.state"],
          },
          fulladdress: {
            $concat: [
              "$venueAddress.address",
              " ",
              "$venueAddress.state",
              " ",
              "$venueAddress.city",
              ",",
              "$venueAddress.state",
            ],
          },
        },
      },
    ]);
    let getDetailsData = getVenueDetails[0];
    return res.render("venues/venuedetails", {
      currentUrl: "Venues",
      profile,
      filter,
      getDetailsData,
    });
  } catch (error) {
    return sendResponse(res, true, 500, "Internal server error", error);
  }
};

exports.updateVenue = async (req, res) => {
  try {
    return sendResponse(res, true, 200, "Venue updated successfully", "");
  } catch (error) {
    return sendResponse(res, true, 500, "Internal server error", error);
  }
};
