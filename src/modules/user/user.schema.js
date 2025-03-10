import joi from "joi";
import { GENDERS } from "../../utils/constent/index.js";

export const updateUser = joi
  .object({
    firstName: joi.string().trim().min(2).max(50).required(),
    lastName: joi.string().trim().min(2).max(50).required(),
    email: joi.string().email().trim().optional(),
    DOB: joi.date().max("now").required(),
    mobileNumber: joi
      .string()
      .length(11)
      .pattern(/^\d+$/)
      .message("Mobile number must contain only digits and be 11 digits long")
      .required(),
    gender: joi
      .string()
      .valid(...Object.values(GENDERS))
      .required(),
    profilePic: joi.string().uri().optional(),
    coverPic: joi.string().uri().optional(),
  })
  .required();

export const updatePassword = joi
  .object({
    oldPassword: joi.string().min(8).max(50).required(),
    newPassword: joi
      .string()
      .min(8)
      .max(50)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
      .message(
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .required(),
  })
  .required();

export const deleteAccount = joi
  .object({
    confirm: joi
      .string()
      .valid("DELETE")
      .required()
      .messages({
        "any.only": "You must type 'DELETE' to confirm account deletion",
      }),
  })
  .required();
