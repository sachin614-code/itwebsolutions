const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    divisionsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "division",
      },
    ],
    venuesId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "venue",
      },
    ],
    courtId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "court",
      },
    ],
    teamsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "team",
      },
    ],
    refereesId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staff",
      },
    ],
    eventType: {
      type: String,
    },
    gender: {
      type: String,
    },
    format: {
      type: String,
    },
    openTo: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    registrationOpenDate: {
      type: Date,
    },
    registrationDeadline: {
      type: Date,
    },
    standardPrice: {
      type: Number,
    },
    additonalPricingInfo: {
      type: String,
    },
    lateRegistrationFee: {
      type: Number,
    },
    minNumberOfGamesPerTeam: {
      type: Number,
    },
    potentialDaysOfPlay: [
      {
        day: {
          type: String,
        },
        earliestStartTime: {
          type: String,
        },
        latestStartTime: {
          type: String,
        },
      },
    ],
    blockoutsDates: [Date],
    locationDesc: {
      type: String,
    },
    centralLocation: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
    eventShortDescription: {
      type: String,
    },
    eventGeneralInfo: {
      type: String,
    },
    skillLevel: {
      type: [String],
      enum: ["Elite", "Competitive", "Developmental", "Learning"],
    },
    participation: {
      type: {
        type: String,
      },
      boysMin: {
        type: Number,
      },
      boysMax: {
        type: Number,
      },
      girlsMin: {
        type: Number,
      },
      girlsMax: {
        type: Number,
      },
    },
    cutOffDeadline: {
      type: Date,
    },
    importRules: {
      event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "event",
        required: false,
        set: (v) => (v === "" ? null : v),
      },
      isImported: {
        type: Boolean,
      },
    },
    periods: {
      type: String,
    },
    periodLength: {
      type: Number,
    },
    freeThrows: {
      type: String,
    },
    variances: {
      type: String,
    },
    timeouts: {
      type: String,
    },
    fullTimeoutsPer: {
      type: Number,
    },
    thirtySecTimeoutsPer: {
      type: Number,
    },
    clockStoppage: {
      type: String,
    },
    halftimeLength: {
      type: Number,
    },
    shotClock: {
      type: String,
    },
    foulingOut: {
      type: Number,
    },
    variancesSec: {
      type: String,
    },
    fullCourtPress: {
      type: String,
    },
    technicalFouls: {
      type: String,
    },
    coachRules: {
      type: String,
    },
    forfeitRules: {
      type: String,
    },
    otherRules: {
      type: String,
    },
    refrees: {
      type: String,
    },
    statMgrs: {
      type: String,
    },
    clockMgrs: {
      type: String,
    },
    basePay: [
      {
        level: {
          type: String,
        },
        cost: {
          type: Number,
        },
      },
    ],
    refereeAdvDescription: {
      type: String,
    },
    birthCertificate: {
      type: Boolean,
    },
    permissionSlips: {
      type: Boolean,
    },
    gradeVerification: {
      type: Boolean,
    },
    AAUcard: {
      type: Boolean,
    },
    vaccineCards: {
      type: Boolean,
    },
    waiver: {
      type: Boolean,
    },
    typeOfWaiver: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "registered", "not-scheduled"],
      default: "active",
    },
    stats: {
      teamReg: {
        type: Number,
        default: 0,
      },
      teamsPaid: {
        type: Number,
        default: 0,
      },
      referees: {
        type: Number,
        default: 0,
      },
      courts: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);
const event = mongoose.model("event", eventSchema);
module.exports = event;
