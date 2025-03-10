import { Router } from "express";
import * as companyService from "./company.service.js";
import * as companySchema from "./company.schema.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isValidation } from "../../middlewares/validation.middleware.js";
import { IsAuthenticate } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { fileUpload } from "../../utils/file upload/multer.js";
import { fileValidation, USER_ROLES } from "../../utils/constent/index.js";

const router = Router();

router.post(
  "/",
  IsAuthenticate,
  isAuthorized(USER_ROLES.ADMIN),
  isValidation(companySchema.addCompany),
  asyncHandler(companyService.addCompany)
);

router.put(
  "/:companyId",
  IsAuthenticate,
  isAuthorized(USER_ROLES.ADMIN),
  isValidation(companySchema.updateCompany),
  asyncHandler(companyService.updateCompany)
);

router.delete(
  "/:companyId",
  IsAuthenticate,
  isAuthorized(USER_ROLES.ADMIN),
  isValidation(companySchema.deleteCompanySchema),
  asyncHandler(companyService.deleteCompany)
);

router.get(
  "/:companyId/jobs",
  IsAuthenticate,
  isValidation(companySchema.getCompanyWithJobsSchema),
  asyncHandler(companyService.getCompanyWithJobs)
);

router.get(
  "/search",
  IsAuthenticate,
  isValidation(companySchema.searchCompanySchema),
  asyncHandler(companyService.searchCompany)
);

router.post(
  "/:companyId/logo",
  IsAuthenticate,
  isAuthorized(USER_ROLES.ADMIN),
  fileUpload(fileValidation.IMAGES).single("logo"),
  asyncHandler(companyService.uploadCompanyLogo)
);

router.post(
  "/:companyId/cover",
  IsAuthenticate,
  isAuthorized(USER_ROLES.ADMIN),
  fileUpload(fileValidation.IMAGES).single("cover"),
  asyncHandler(companyService.uploadCompanyCover)
);

router.delete(
  "/:companyId/logo",
  IsAuthenticate,
  isAuthorized(USER_ROLES.ADMIN),
  asyncHandler(companyService.deleteCompanyLogo)
);

router.delete(
  "/:companyId/cover",
  IsAuthenticate,
  isAuthorized(USER_ROLES.ADMIN),
  asyncHandler(companyService.deleteCompanyCover)
);

export default router;
