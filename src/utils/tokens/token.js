import jwt from "jsonwebtoken";

export const generateToken = ({
  payload,
  options = {},
  signature = process.env.JWT_SECRET,
}) => {
  return jwt.sign(payload, signature, options);
};

export const verifyToken = ({ token, signature = process.env.JWT_SECRET }) => {
  try {
    return jwt.verify(token, signature);
  } catch (error) {
    return { error };
  }
};
