export const globalError = (error, req, res, next) => {
  res.status(error.cause || 500).json({
    success: false,
    message: error.message, 
  });
};
