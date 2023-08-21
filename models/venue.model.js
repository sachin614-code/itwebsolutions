const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const venueSchema = new mongoose.Schema(
  {
    venueName: {
      type: String,
    },
    venueNotes: {
      type: String,
    },
    courtId: {
      type: [Schema.Types.ObjectId],
      ref: "court",
    },
    defaultTimeIncrement: {
      type: String,
    },
    paymentTerms: {
      type: String,
    },
    days: {
      type: String,
    },
    venueLogo: {
      type: String,
    },
    venueAddress: {
      address: {
        type: String,
      },
      state: {
        type: String,
      },
      city: {
        type: String,
      },
      zipCode: {
        type: String,
      },
    },
    manager: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    scheduleManager: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    paymentManager: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    facilityManager: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const venue = mongoose.model("venue", venueSchema);
module.exports = venue;
