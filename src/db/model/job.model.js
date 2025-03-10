import { Schema, model } from "mongoose";
import {
  JOB_LOCATIONS,
  SENIORITY_LEVEL,
  WORKING_TIME,
} from "../../utils/constent/index.js";

// Schema
const jobSchema = new Schema({
  jobTitle: { type: String, required: true },

  jobLocation: {
    type: String,
    enum: Object.values(JOB_LOCATIONS),
    required: true,
  },

  workingTime: {
    type: String,
    enum: Object.values(WORKING_TIME),
    required: true,
  },

  seniorityLevel: {
    type: String,
    enum: Object.values(SENIORITY_LEVEL),
    required: true,
  },

  jobDescription: { type: String, required: true },

  technicalSkills: [{ type: String, required: true }],

  softSkills: [{ type: String, required: true }],

  addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },

  closed: { type: Boolean, default: false },

  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
});

// Model
export const Job = model("Job", jobSchema);
