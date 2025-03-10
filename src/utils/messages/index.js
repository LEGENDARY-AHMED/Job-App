const generateMessage = (entaity) => {
  return {
    notFound: `${entaity} not found`,
    alreadyExists: `${entaity} already exists`,
    createdSuccess: `${entaity} created successfully`,
    updatedSuccess: `${entaity} updated successfully`,
    deletedSuccess: `${entaity} deleted successfully`,
  };
};

export const messages = {
  AUTH: {
    loginSuccess: "Logged in successfully",
    logoutSuccess: "Logged out successfully",
    registerSuccess: "Registered successfully",
    passwordChanged: "Password changed successfully",
    passwordReset: "Password reset successfully",
    passwordResetLink: "Password reset link sent successfully",
    passwordResetTokenInvalid: "Password reset token is invalid or has expired",
    passwordResetTokenValid: "Password reset token is valid",
    passwordResetTokenNotFound: "Password reset token not found",
    passwordResetTokenUsed: "Password reset token is already used",
    passwordResetTokenExpired: "Password reset token is expired",
    passwordResetTokenInvalid: "Password reset token is invalid",
    otpSent: "OTP sent successfully",
  },
  USER: {
    ...generateMessage("User"),
    activateAccount: "Account activated successfully",
  },
};
