import joi from "joi";
import {
  SENIORITY_LEVEL,
  WORKING_TIME,
  JOB_LOCATIONS,
} from "../../utils/constent/index.js";

export const addJob = joi
  .object({
    jobTitle: joi.string().min(3).max(100).required(),
    jobLocation: joi
      .string()
      .valid(...Object.values(JOB_LOCATIONS))
      .required(),
    workingTime: joi
      .string()
      .valid(...Object.values(WORKING_TIME))
      .required(),
    seniorityLevel: joi
      .string()
      .valid(...Object.values(SENIORITY_LEVEL))
      .required(),
    jobDescription: joi.string().min(10).max(2000).required(),
    technicalSkills: joi.array().items(joi.string()).min(1).required(),
    softSkills: joi.array().items(joi.string()).min(1).required(),
    companyId: joi.string().hex().length(24).required(),
  })
  .required();

export const updateJob = joi
  .object({
    jobId: joi.string().hex().length(24).required(),
    jobTitle: joi.string().min(3).max(100),
    jobLocation: joi.string().valid(...Object.values(JOB_LOCATIONS)),
    workingTime: joi.string().valid(...Object.values(WORKING_TIME)),
    seniorityLevel: joi.string().valid(...Object.values(SENIORITY_LEVEL)),
    jobDescription: joi.string().min(10).max(2000),
    technicalSkills: joi.array().items(joi.string()).min(1),
    softSkills: joi.array().items(joi.string()).min(1),
  })
  .required();

export const deleteJob = joi
  .object({
    jobId: joi.string().hex().length(24).required(),
  })
  .required();

export const getJobs = joi
  .object({
    companyId: joi.string().hex().length(24).optional(),
    search: joi.string().optional(),
    skip: joi.number().integer().min(0).optional(),
    limit: joi.number().integer().min(1).max(100).optional(),
    sort: joi.string().valid("createdAt").optional(),
  })
  .optional();

export const getJobApplications = joi
  .object({
    jobId: joi.string().hex().length(24).required(),
  })
  .required();
