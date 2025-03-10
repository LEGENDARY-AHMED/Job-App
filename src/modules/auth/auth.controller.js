import { Router } from "express";
import * as authService from "./auth.service.js";
import * as authSchema from "./auth.schema.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isValidation } from "../../middlewares/validation.middleware.js";

const router = Router();

router.post(
  "/Sign-Up",
  isValidation(authSchema.registerSchema),
  asyncHandler(authService.signUp)
);
router.post(
  "/Confirm-Account",
  isValidation(authSchema.confirmAccount),
  asyncHandler(authService.confirmAccount)
);
router.post(
  "/resend-OTP",
  isValidation(authSchema.resendOTPSchema),
  asyncHandler(authService.resendOTP)
)
router.post(
  "/Sign-In",
  isValidation(authSchema.loginSchema),
  asyncHandler(authService.signIn)
);
router.post(
  "/Refresh-Token",
  isValidation(authSchema.refreshTokenSchema),
  asyncHandler(authService.refreshToken)
);
router.post(
  "/Forgot-Password",
  isValidation(authSchema.forgotPasswordSchema),
  asyncHandler(authService.forgotPassword)
);
router.post(
  "/Reset-Password",
  isValidation(authSchema.resetPasswordSchema),
  asyncHandler(authService.resetPassword)
);
export default router;
