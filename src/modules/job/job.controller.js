import { Router } from "express";
import * as jobService from "./job.service.js";
import * as jobSchema from "./job.schema.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isValidation } from "../../middlewares/validation.middleware.js";
import { IsAuthenticate } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { USER_ROLES } from "../../utils/constent/index.js";

const router = Router();

router.post(
  "/",
  IsAuthenticate,
  isAuthorized(USER_ROLES.ADMIN),
  isValidation(jobSchema.addJob),
  asyncHandler(jobService.addJob)
);

router.put(
  "/:jobId",
  IsAuthenticate,
  isAuthorized(USER_ROLES.ADMIN),
  isValidation(jobSchema.updateJob),
  asyncHandler(jobService.updateJob)
);

router.delete(
  "/:jobId",
  IsAuthenticate,
  isAuthorized(USER_ROLES.ADMIN),
  isValidation(jobSchema.deleteJob),
  asyncHandler(jobService.deleteJob)
);

router.get(
  "/",
  isValidation(jobSchema.getJobs),
  asyncHandler(jobService.getJobs)
);

router.get(
  "/:jobId/applications",
  IsAuthenticate,
  isValidation(jobSchema.getJobApplications),
  asyncHandler(jobService.getJobApplications)
);

// router.post(
//   "/:jobId/apply",
//   IsAuthenticate,
//   isAuthorized(USER_ROLES.USER),
//   isValidation(jobSchema.applyJob),
//   asyncHandler(jobService.applyJob)
// );

// router.put(
//   "/:jobId/application/:applicationId/status",
//   IsAuthenticate,
//   isValidation(jobSchema.updateApplicationStatus),
//   asyncHandler(jobService.updateApplicationStatus)
// );

export default router;
