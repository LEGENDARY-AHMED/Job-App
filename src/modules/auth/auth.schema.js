import joi from "joi";
import { GENDERS } from "../../utils/constent/index.js";

export let registerSchema = joi
  .object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%^&\\*])(?=.{8,})"
        )
      )
      .required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
    mobileNumber: joi.string().pattern(new RegExp("^(01)[0-9]{9}$")).required(),
    DOB: joi.date().max(Date.now()).required(),
    gender: joi
      .string()
      .valid(...Object.values(GENDERS))
      .required(),
  })
  .required();

export let confirmAccount = joi
  .object({
    email: joi.string().email().required(),
    OTP: joi.string().length(5).required(),
  })
  .required();

export let loginSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();

export let refreshTokenSchema = joi
  .object({
    refreshToken: joi.string().required(),
  })
  .required();

export let resendOTPSchema = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

export let forgotPasswordSchema = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

export let resetPasswordSchema = joi
  .object({
    email: joi.string().email().required(),
    OTP: joi.string().length(5).required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();
