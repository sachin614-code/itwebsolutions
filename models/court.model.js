const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const courtSchema = new mongoose.Schema(
  {
    courtName: {
      type: String,
    },

    type: {
      type: String,
      default: "Main",
    },
    courtRating: {
      type: Number,
    },
    numberOfGyms: {
      type: Number,
    },
    costPerHour: {
      type: Number,
    },
    seatingRows: {
      type: String,
    },
    floorRating: {
      type: String,
    },
    floorMaterial: {
      type: String,
    },
    baselineDistance: {
      type: String,
    },
    sidelineDistance: {
      type: String,
    },
    exteriorPhotos: {
      type: [String],
    },
    courtFloorPhotos: {
      type: [String],
    },
    gymPhotos: {
      type: [String],
    },

    // availability: [
    //   {
    //     date: {
    //       type: String,
    //     },
    //     time: {
    //       type: String,
    //     },
    //   },
    // ],
    locationAndParkingInstructions: {
      type: String,
    },
    courtCost: {
      type: String,
      default: "$red",
    },
    availabilityDays: {
      type: String,
      default: "10 Days",
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const court = mongoose.model("court", courtSchema);

module.exports = court;
