export const isValidation = (schema) => {
  return async (req, res, next) => {
    let data = { ...req.body, ...req.params, ...req.query };
    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return res.status(400).json({ success: false, errors: errorMessages });
    }
    next();
  };
};
