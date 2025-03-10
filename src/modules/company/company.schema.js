import joi from "joi";

export const addCompany = joi
  .object({
    companyName: joi.string().trim().min(3).max(100).required(),
    companyEmail: joi.string().email().trim().required(),
    description: joi.string().trim().min(10).max(1000).required(),
    industry: joi.string().required(),
    numberOfEmployees: joi.number().integer().min(1).max(100000).required(),
    address: joi
      .object({
        street: joi.string().trim().optional(),
        city: joi.string().trim().min(2).max(50).required(),
        state: joi.string().trim().min(2).max(50).optional(),
        country: joi.string().trim().min(2).max(50).required(),
        zipCode: joi
          .string()
          .pattern(/^\d{4,10}$/)
          .optional(),
      })
      .required(),
    createdBy: joi.string().hex().length(24).optional(),
  })
  .required();

export const updateCompany = joi
  .object({
    companyId: joi.string().hex().length(24).required(),
    companyName: joi.string().trim().min(3).max(100),
    companyEmail: joi.string().email().trim(),
    description: joi.string().trim().min(10).max(1000),
    industry: joi.string(),
    numberOfEmployees: joi.number().integer().min(1).max(100000),
    address: joi.object({
      street: joi.string().trim().optional(),
      city: joi.string().trim().min(2).max(50),
      state: joi.string().trim().min(2).max(50),
      country: joi.string().trim().min(2).max(50),
      zipCode: joi.string().pattern(/^\d{4,10}$/),
    }),
  })
  .required();


export const deleteCompanySchema = joi.object({
  companyId: joi.string().hex().length(24).required(),
});

export const searchCompanySchema = joi.object({
  name: joi.string().trim().min(1).max(100).optional(),
});

export const getCompanyWithJobsSchema = joi.object({
  companyId: joi.string().hex().length(24).required(),
});
