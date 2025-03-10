import { Job } from "../../db/model/job.model.js";
import { Application } from "../../db/model/application.model.js";
import { User } from "../../db/model/user.model.js";

export const addJob = async (req, res, next) => {
  const newJob = await Job.create({ ...req.body, addedBy: req.userExist._id });
  res.status(201).json({ success: true, job: newJob });
};

export const updateJob = async (req, res, next) => {
  const { jobId } = req.params;
  const job = await Job.findById(jobId);

  if (!job) return next({ message: "Job not found", cause: 404 });

  if (job.addedBy.toString() !== req.userExist._id.toString())
    return next({ message: "Unauthorized", cause: 403 });

  const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
    new: true,
  });
  res.status(200).json({ success: true, job: updatedJob });
};

export const deleteJob = async (req, res, next) => {
  const { jobId } = req.params;
  const job = await Job.findById(jobId);
  if (!job) return next(new Error("Job not found", { cause: 404 }));

  if (job.addedBy.toString() !== req.userExist._id.toString())
    return next(new Error("Unauthorized", { cause: 403 }));

  await job.deleteOne();
  res.status(200).json({ success: true, message: "Job deleted successfully." });
};

export const getJobs = async (req, res, next) => {
  const {
    companyId,
    search,
    skip = 0,
    limit = 10,
    sort = "createdAt",
  } = req.query;
  const filter = {};
  if (companyId) filter.companyId = companyId;
  if (search) filter.jobTitle = new RegExp(search, "i");

  const jobs = await Job.find(filter)
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ [sort]: 1 });
  const totalCount = await Job.countDocuments(filter);

  res.status(200).json({ success: true, jobs, totalCount });
};

export const getJobApplications = async (req, res, next) => {
  const { jobId } = req.params;
  const applications = await Application.find({ jobId }).populate(
    "userId",
    "firstName lastName email"
  );
  res.status(200).json({ success: true, applications });
};

// export const applyJob = async (req, res, next) => {
//  };

// export const updateApplicationStatus = async (req, res, next) => {
// };
