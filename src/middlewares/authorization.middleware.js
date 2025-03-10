export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userExist.role)) {
      return next(new Error("You are not authorized to access this route"));
    }
    return next();
  };
};
