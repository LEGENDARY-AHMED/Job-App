import { PUBLIC_ID, SECURE_URL } from "../../utils/constent/index.js";
import { Company } from "./../../db/model/company.model.js";
import { Job } from "../../db/model/job.model.js";
import cloudinary from "./../../utils/file upload/cloud-config.js";

export const addCompany = async (req, res, next) => {
  if (req.userExist.role !== "admin") {
    return next(
      Error("Unauthorized: Only admins can create companies.", {
        cause: 403,
      })
    );
  }

  const { companyName, companyEmail } = req.body;
  const existingCompany = await Company.findOne({
    $or: [{ companyName }, { companyEmail }],
  });

  if (existingCompany) {
    return next(Error("Company name or email already exists.", { cause: 400 }));
  }

  req.body.createdBy = req.userExist._id;
  const newCompany = await Company.create(req.body);

  res.status(201).json({ success: true, company: newCompany });
};

export const updateCompany = async (req, res, next) => {
  if (req.userExist.role !== "admin") {
    return next(
      Error("Unauthorized: Only admins can update companies.", {
        cause: 403,
      })
    );
  }

  const { companyId } = req.params;
  const company = await Company.findById(companyId);
  if (!company) return next(Error("Company not found.", { cause: 404 }));

  const updatedCompany = await Company.findByIdAndUpdate(companyId, req.body, {
    new: true,
  });

  res.status(200).json({ success: true, company: updatedCompany });
};

export const deleteCompany = async (req, res, next) => {
  if (req.userExist.role !== "admin") {
    return next(
      Error("Unauthorized: Only admins can delete companies.", {
        cause: 403,
      })
    );
  }

  const { companyId } = req.params;
  const company = await Company.findById(companyId);
  if (!company) return next(Error("Company not found.", { cause: 404 }));

  company.deletedAt = new Date();
  await company.save();

  res
    .status(200)
    .json({ success: true, message: "Company soft deleted successfully." });
};

export const getCompanyWithJobs = async (req, res, next) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId);
  if (!company) {
    return next(new Error("Company not found.", { cause: 404 }));
  }

  const jobs = await Job.find({ companyId });

  res.status(200).json({ success: true, company, jobs });
};

export const searchCompany = async (req, res, next) => {
  const { name } = req.query;

  const companies = await Company.find({
    companyName: name,
  });

  res.status(200).json({ success: true, companies });
};

export const uploadCompanyLogo = async (req, res, next) => {
  if (req.userExist.role !== "admin") {
    return next(
      Error("Unauthorized: Only admins can upload company logos.", {
        cause: 403,
      })
    );
  }

  const { companyId } = req.params;
  const company = await Company.findById(companyId);
  if (!company) return next(Error("Company not found.", { cause: 404 }));

  if (company.logo.public_id !== PUBLIC_ID.defaultCompanyLogo) {
    await cloudinary.uploader.destroy(company.logo.public_id);
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Job-App/company/${company._id}/Logo`,
    }
  );
  company.logo = { secure_url: secure_url, public_id: public_id };
  await company.save();

  res.status(200).json({ success: true, data: company.logo });
};

export const uploadCompanyCover = async (req, res, next) => {
  if (req.userExist.role !== "admin") {
    return next(
      Error("Unauthorized: Only admins can upload company logos.", {
        cause: 403,
      })
    );
  }

  const { companyId } = req.params;
  const company = await Company.findById(companyId);
  if (!company) return next(Error("Company not found.", { cause: 404 }));

  if (company.coverPic.public_id !== PUBLIC_ID.defaultCompanyCover) {
    await cloudinary.uploader.destroy(company.coverPic.public_id);
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Job-App/company/${company._id}/Cover`,
    }
  );
  company.coverPic = { secure_url: secure_url, public_id: public_id };
  await company.save();

  res.status(200).json({ success: true, data: company.coverPic });
};

export const deleteCompanyLogo = async (req, res, next) => {
  if (req.userExist.role !== "admin") {
    return next(
      Error("Unauthorized: Only admins can delete company logos.", {
        cause: 403,
      })
    );
  }

  const { companyId } = req.params;
  const company = await Company.findById(companyId);
  if (!company) return next(Error("Company not found.", { cause: 404 }));

  if (company.logo?.public_id) {
    await cloudinary.uploader.destroy(company.logo.public_id);
    company.logo = {
      secure_url: SECURE_URL.defaultCompanyLogo,
      public_id: PUBLIC_ID.defaultCompanyLogo,
    };
    await company.save();
  }

  res
    .status(200)
    .json({ success: true, message: "Logo deleted successfully." });
};

export const deleteCompanyCover = async (req, res, next) => {
  if (req.userExist.role !== "admin") {
    return next(
      Error("Unauthorized: Only admins can delete company covers.", {
        cause: 403,
      })
    );
  }

  const { companyId } = req.params;
  const company = await Company.findById(companyId);
  if (!company) return next(Error("Company not found.", { cause: 404 }));

  if (company.coverPic?.public_id) {
    await cloudinary.uploader.destroy(company.coverPic.public_id);
    company.coverPic = {
      secure_url: SECURE_URL.defaultCompanyCover,
      public_id: PUBLIC_ID.defaultCompanyCover,
    };
    await company.save();
  }

  res
    .status(200)
    .json({ success: true, message: "Cover picture deleted successfully." });
};
