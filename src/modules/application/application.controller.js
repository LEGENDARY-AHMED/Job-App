import { Router } from "express";
import * as applicationService from "./application.service.js";
import * as applicationSchema from "./application.schema.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isValidation } from "../../middlewares/validation.middleware.js";
import { IsAuthenticate } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { fileValidation, USER_ROLES } from "../../utils/constent/index.js";
import { fileUpload } from "../../utils/file upload/multer.js";

const router = Router();

router.post(
  "/:jobId",
  IsAuthenticate,
  isAuthorized(USER_ROLES.USER),
  fileUpload(fileValidation.FILES).single("userCV"),
  asyncHandler(applicationService.createApplication)
);

router.delete(
  "/:applicationId",
  IsAuthenticate,
  isValidation(applicationSchema.deleteApplication),
  asyncHandler(applicationService.deleteApplication)
);

export default router;
