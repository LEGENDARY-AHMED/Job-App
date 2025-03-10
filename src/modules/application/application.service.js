import { Application } from "../../db/model/application.model.js";
import { Job } from "../../db/model/job.model.js";
import cloudinary from "../../utils/file upload/cloud-config.js";

export const createApplication = async (req, res, next) => {
  const { jobId } = req.params;

  if (!req.file) {
    return next(new Error("Please upload a CV.", { cause: 400 }));
  }

  const existingApplication = await Application.findOne({
    jobId,
    userId: req.userExist._id,
  });
  if (existingApplication)
    return next(
      new Error("You have already applied to this job.", { cause: 400 })
    );

  const job = await Job.findById(jobId);
  if (!job) return next(new Error("Job not found.", { cause: 404 }));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `Job-App/users/${req.userExist._id}/cv` }
  );
  const newApplication = await Application.create({
    jobId,
    userId: req.userExist._id,
    userCV: {
      secure_url,
      public_id,
    },
  });

  res.status(201).json({ success: true, data: newApplication });
};
export const deleteApplication = async (req, res, next) => {
  const { applicationId } = req.params;

  const application = await Application.findById(applicationId);
  if (!application)
    return next(new Error("Application not found.", { cause: 404 }));

  if (!application.userId.equals(req.userExist._id))
    return next(
      new Error("You are not authorized to delete this application.", {
        cause: 403,
      })
    );

  await cloudinary.uploader.destroy(application.userCV.public_id);
  await Application.findByIdAndDelete(applicationId);
  

  res.status(200).json({
    success: true,
    message: "Application deleted successfully.",
  });
};
