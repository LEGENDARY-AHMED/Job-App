import { Schema, model } from "mongoose";
import { PUBLIC_ID, SECURE_URL } from "../../utils/constent/index.js";

// Schema
const companySchema = new Schema({
  companyName: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  industry: { type: String, required: true },

  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipCode: { type: String },
  },

  numberOfEmployees: { type: String, required: true },

  companyEmail: { type: String, required: true, unique: true },

  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

  logo: {
    secure_url: { type: String, default: SECURE_URL.defaultCompanyLogo },
    public_id: { type: String, default: PUBLIC_ID.defaultCompanyLogo },
  },

  coverPic: {
    secure_url: { type: String, default: SECURE_URL.defaultCompanyCover },
    public_id: { type: String, default: PUBLIC_ID.defaultCompanyCover },
  },

  HRs: [{ type: Schema.Types.ObjectId, ref: "User" }],

  bannedAt: { type: Date },
  deletedAt: { type: Date },

  legalAttachment: {
    secure_url: { type: String },
    public_id: { type: String },
  },

  approvedByAdmin: { type: Boolean },
});

// Model
export const Company = model("Company", companySchema);
