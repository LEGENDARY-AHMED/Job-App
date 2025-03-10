import { Router } from "express";
import * as userService from "./user.service.js";
import * as userSchema from "./user.schema.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isValidation } from "../../middlewares/validation.middleware.js";
import { IsAuthenticate } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { fileUpload } from "../../utils/file upload/multer.js";
import { fileValidation, USER_ROLES } from "../../utils/constent/index.js";

const router = Router();

router.put(
  "/",
  IsAuthenticate,
  isAuthorized(USER_ROLES.USER),
  isValidation(userSchema.updateUser),
  asyncHandler(userService.updateUser)
);

router.get(
  "/profile",
  IsAuthenticate,
  asyncHandler(userService.getMyProfile)
);

router.get(
  "/:userId",
  IsAuthenticate,
  asyncHandler(userService.getProfile)
);

router.put(
  "/password",
  IsAuthenticate,
  isAuthorized(USER_ROLES.USER),
  isValidation(userSchema.updatePassword),
  asyncHandler(userService.updatePassword)
);

router.put(
  "/profile-pic",
  IsAuthenticate,
  fileUpload(fileValidation.IMAGES).single("profilePic"),
  isAuthorized(USER_ROLES.USER),
  asyncHandler(userService.uploadProfilePic)
);

router.put(
  "/cover-pic",
  IsAuthenticate,
  fileUpload(fileValidation.IMAGES).single("coverPic"),
  isAuthorized(USER_ROLES.USER),
  asyncHandler(userService.uploadCoverPic)
);

router.delete(
  "/profile-pic",
  IsAuthenticate,
  isAuthorized(USER_ROLES.USER),
  asyncHandler(userService.deleteProfilePic)
);

router.delete(
  "/cover-pic",
  IsAuthenticate,
  isAuthorized(USER_ROLES.USER),
  asyncHandler(userService.deleteCoverPic)
);

router.delete(
  "/",
  IsAuthenticate,
  isAuthorized(USER_ROLES.USER),
  isValidation(userSchema.deleteAccount),
  asyncHandler(userService.deleteAccount)
);

export default router;
