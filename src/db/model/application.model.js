import { Schema, model } from "mongoose";
import { APPLICATION_STATUS } from "../../utils/constent/index.js";

// Schema
const applicationSchema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },

    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    userCV: {
      secure_url: { type: String, required: true }, 
      public_id: { type: String, required: true }, 
    },

    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: "pending",
    },
  },

);

// Model
export const Application = model("Application", applicationSchema);
