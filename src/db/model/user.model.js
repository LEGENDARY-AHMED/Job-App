import { Schema, Types, model } from "mongoose";
import {
  GENDERS,
  OTP_TYPES,
  PROVIDERS,
  PUBLIC_ID,
  SECURE_URL,
  USER_ROLES,
} from "../../utils/constent/index.js";
import { hash, compare } from "../../utils/hashing/hash.js";
import { decrypt, encrypt } from "../../utils/encryption/encryption.js";

// Schema
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    provider: {
      type: String,
      enum: Object.values(PROVIDERS),
    },
    gender: { type: String, enum: Object.values(GENDERS), required: true },
    DOB: { type: Date, max: Date.now(), required: true },
    mobileNumber: { type: String, required: true },
    role: { type: String, enum: Object.values(USER_ROLES), default: "user" },
    isConfirmed: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    bannedAt: { type: Date, default: null },
    updatedBy: { type: Types.ObjectId, ref: "User", default: null },
    changeCredentialTime: { type: Date },
    profilePic: {
      secure_url: {
        type: String,
        default: SECURE_URL.defaultUserProf,
      },
      public_id: { type: String, default: PUBLIC_ID.defaultUserProf },
    },
    coverPic: {
      secure_url: {
        type: String,
        default: SECURE_URL.defaultUserCover,
      },
      public_id: { type: String, default: PUBLIC_ID.defaultUserCover },
    },
    OTP: [
      {
        code: { type: String },
        type: { type: String, enum: Object.values(OTP_TYPES) },
        expiresIn: { type: Date },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("username").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// hooks
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = hash({
      plaintext: this.password,
    });
  }
  if (this.isModified("mobileNumber")) {
    this.mobileNumber = encrypt({
      plaintext: this.mobileNumber,
    });
  }
  return next();
});

userSchema.methods.getDecryptedMobile = function () {
  return decrypt({
    ciphertext: this.mobileNumber,
  });
};

userSchema.methods.comparePassword = function (enteredPassword) {
  return compare({
    plaintext: enteredPassword,
    hash: this.password,
  });
};

// Model
export const User = model("User", userSchema);
