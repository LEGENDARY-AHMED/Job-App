import { User } from "../../db/model/user.model.js";
import { PUBLIC_ID, SECURE_URL } from "../../utils/constent/index.js";
import { decrypt, encrypt } from "../../utils/encryption/encryption.js";
import cloudinary from "../../utils/file upload/cloud-config.js";

export const updateUser = async (req, res, next) => {
  const { email, mobileNumber } = req.body;

  if (email) {
    const existingUser = await User.findOne({ email });
    if (existingUser && !existingUser._id.equals(req.userExist._id)) {
      return next(new Error("Email is already in use", { cause: 400 }));
    }
  }

  if (mobileNumber) {
    req.body.mobileNumber = encrypt(mobileNumber);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.userExist._id,
    { ...req.body, updatedBy: req.userExist._id },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
};

export const getMyProfile = async (req, res, next) => {
  const userExist = req.userExist;
  const decryptedMobile = userExist.getDecryptedMobile();

  res.status(200).json({
    status: "success",
    data: {
      ...userExist.toObject(),
      mobileNumber: decryptedMobile,
    },
  });
};

export const getProfile = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const decryptedMobile = user.getDecryptedMobile();

  res.status(200).json({
    status: "success",
    data: {
      userName: user.username,
      mobileNumber: decryptedMobile,
      profilePic: user.profilePic,
      coverPic: user.coverPic,
    },
  });
};

export const updatePassword = async (req, res, next) => {
  const user = req.userExist;
  const { oldPassword, newPassword } = req.body;

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    return next(new Error("Old password is incorrect", { cause: 400 }));
  }

  if (oldPassword === newPassword) {
    return next(
      new Error("New password must be different from the old password", {
        cause: 400,
      })
    );
  }

  user.password = newPassword;
  user.changeCredentialTime = Date.now();
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
};

export const uploadProfilePic = async (req, res, next) => {
  if (req.userExist.profilePic.public_id !== PUBLIC_ID.defaultUserProf) {
    await cloudinary.uploader.destroy(req.userExist.profilePic.public_id);
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `Job-App/users/${req.userExist._id}/profile-Pic` }
  );

  const user = await User.findByIdAndUpdate(
    req.userExist._id,
    { profilePic: { secure_url, public_id } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: user.profilePic,
  });
};

export const uploadCoverPic = async (req, res, next) => {
  if (req.userExist.coverPic.public_id !== PUBLIC_ID.defaultUserCover) {
    await cloudinary.uploader.destroy(req.userExist.coverPic.public_id);
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `Job-App/users/${req.userExist._id}/cover-Pic` }
  );

  const user = await User.findByIdAndUpdate(
    req.userExist._id,
    { coverPic: { secure_url, public_id } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: user.coverPic,
  });
};

export const deleteProfilePic = async (req, res, next) => {
  await cloudinary.uploader.destroy(req.userExist.profilePic.public_id);

   await User.findByIdAndUpdate(
    req.userExist._id,
    {
      profilePic: {
        secure_url: SECURE_URL.defaultUserProf,
        public_id: PUBLIC_ID.defaultUserProf,
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "profilePic deleted successfully.",
  });
};

export const deleteCoverPic = async (req, res, next) => {
  await cloudinary.uploader.destroy(req.userExist.coverPic.public_id);

  await User.findByIdAndUpdate(
    req.userExist._id,
    {
      coverPic: {
        secure_url: SECURE_URL.defaultUserCover,
        public_id: PUBLIC_ID.defaultUserCover,
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Cover picture deleted successfully.",
  });
};

export const deleteAccount = async (req, res, next) => {
  const { confirm } = req.body;

  if (confirm !== "DELETE") {
    return next(
      new Error("You must type 'DELETE' to confirm account deletion", {
        cause: 400,
      })
    );
  }

  await User.findByIdAndUpdate(req.userExist._id, {
    deletedAt: Date.now(),
  });

  res.status(200).json({
    status: "success",
    message: "Account deleted successfully",
  });
};
