const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const courtAvailabilitySchema = new mongoose.Schema(
  {
    availability:[{
    date: {
        type: Date,
      },
      time: {
        type: String,
      },
    }],
      venueId: {
        type: Schema.Types.ObjectId,
        ref: "venue",
      },
      courtId: {
        type: Schema.Types.ObjectId,
        ref: "court",
      },
  
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    }
  },
  {
    timestamps: true,
  }
);

const courtAvailability = mongoose.model("courtavailability", courtAvailabilitySchema);

module.exports = courtAvailability;
