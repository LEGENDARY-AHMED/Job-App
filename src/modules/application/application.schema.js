import joi from "joi";

export const createApplication = joi.object({
  jobId: joi.string().hex().length(24).required(),
}).required();

export const deleteApplication = joi.object({
  applicationId: joi.string().hex().length(24).required(),
}).required();
