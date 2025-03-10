import Randomstring from "randomstring";
import { User } from "../../db/model/user.model.js";
import { messages } from "../../utils/messages/index.js";
import { compare } from "../../utils/hashing/hash.js";
import { generateToken, verifyToken } from "../../utils/tokens/token.js";
import { sendOTPEvent } from "../../utils/otp/otp.js";
import "../../utils/otp/otpCleanup.js";
import { OTP_TYPES } from "../../utils/constent/index.js";

export const signUp = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    mobileNumber,
    DOB,
    gender,
  } = req.body;

  let user = await User.findOne({ email });
  if (user && user.deletedAt == null)
    return next(new Error("User already exists", { case: 409 }));

  if (password !== confirmPassword)
    return next(new Error("Passwords do not match", { case: 400 }));

  user = new User({
    firstName,
    lastName,
    email,
    password,
    mobileNumber,
    DOB,
    gender,
  });

  const otpCode = Randomstring.generate({ length: 5, charset: "numeric" });
  const expiresIn = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

  user.OTP.push({ type: "confirmEmail", code: otpCode, expiresIn });
  await user.save();

  sendOTPEvent.emit("sendOTP", { email, otp: otpCode });

  res.status(201).json({
    success: true,
    message: "Registration successful! OTP sent to your email.",
  });
};

export const confirmAccount = async (req, res, next) => {
  const { email, OTP } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new Error("User not found", { case: 404 }));
  if (user.isConfirmed)
    return next(new Error("Account already activated", { case: 403 }));

  const validOTP = user.OTP.find(
    (otp) => otp.code === OTP && otp.expiresIn > Date.now()
  );
  if (!validOTP)
    return next(new Error("Invalid or expired OTP", { case: 403 }));

  user.isConfirmed = true;
  user.OTP = [];
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Account confirmed successfully" });
};

export const resendOTP = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new Error("User not found", { case: 404 }));
  if (user.isConfirmed)
    return next(new Error("Account already activated", { case: 403 }));

  const otpCode = Randomstring.generate({ length: 5, charset: "numeric" });
  const expiresIn = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

  user.OTP = user.OTP.filter((otp) => otp.type !== "confirmEmail");

  user.OTP.push({ type: "confirmEmail", code: otpCode, expiresIn });
  await user.save();
  sendOTPEvent.emit("sendOTP", { email, otp: otpCode });

  res
    .status(200)
    .json({ success: true, message: "New OTP sent to your email." });
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new Error("Unauthorized", { case: 401 }));
  if (!user.isConfirmed)
    return next(new Error("Account not activated", { case: 403 }));
  if (user.bannedAt) return next(new Error("Account is banned", { case: 403 }));

  const isMatch = compare({ plaintext: password, hash: user.password });
  if (!isMatch) return next(new Error("Unauthorized", { case: 401 }));

  const accessToken = generateToken({
    payload: { email, id: user._id },
    options: { expiresIn: "1h" },
  });
  const refreshToken = generateToken({
    payload: {
      email,
      id: user._id,
    },
    options: { expiresIn: "7d" },
  });

  res.status(200).json({
    success: true,
    message: messages.AUTH.loginSuccess,
    accessToken,
    refreshToken,
  });
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken: refreshTokenBody } = req.body;

  if (!refreshTokenBody)
    return next(new Error("Refresh token is required", { case: 400 }));

  const payload = verifyToken({ token: refreshTokenBody });
  if (payload.error)
    return next(new Error("Invalid refresh token", { case: 401 }));

  const user = await User.findOne({ email: payload.email });
  if (!user) return next(new Error("User not found", { case: 404 }));

  const newAccessToken = generateToken({
    payload: { email: user.email },
    options: { expiresIn: "1h" },
  });

  res.status(200).json({
    success: true,
    message: messages.AUTH.refreshTokenSuccess,
    accessToken: newAccessToken,
  });
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return next(new Error("User not found", { case: 404 }));

  const otpCode = Randomstring.generate({ length: 5, charset: "numeric" });
  const expiresIn = Date.now() + 10 * 60 * 1000;

  user.OTP = user.OTP.filter((otp) => otp.type !== OTP_TYPES.FORGET_PASSWORD);

  user.OTP.push({ type: OTP_TYPES.FORGET_PASSWORD, code: otpCode, expiresIn });
  await user.save();

  sendOTPEvent.emit("sendOTP", { email, otp: otpCode });

  res.status(200).json({ success: true, message: "OTP sent to your email" });
};

export const resetPassword = async (req, res, next) => {
  const { email, OTP, password, confirmPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return next(new Error("User not found", { case: 404 }));

  const validOTP = user.OTP.find(
    (otp) => otp.code === OTP && otp.expiresIn > Date.now()
  );
  if (!validOTP)
    return next(new Error("Invalid or expired OTP", { case: 403 }));

  if (password !== confirmPassword)
    return next(new Error("Passwords do not match", { case: 400 }));

  user.password = password;
  user.OTP = []; // Clear OTPs after password reset
  await user.save();

  res.status(200).json({ success: true, message: "Password reset successful" });
};
