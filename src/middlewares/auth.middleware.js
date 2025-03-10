import { User } from "../db/model/user.model.js";
import { asyncHandler } from "../utils/error/async-handler.js";
import { verifyToken } from "../utils/tokens/token.js";

export const IsAuthenticate = asyncHandler(async (req, res, next) => {
  const { autherization } = req.headers;
  if (!autherization?.startsWith("3zooz"))
    return next(new Error("No token provided", { case: 401 }));

  const token = autherization.split(" ")[1];
  const payload = verifyToken({ token });
  if (payload.error) return next(payload.error);
  const userExist = await User.findOne({ email: payload.email });
  if (!userExist) return next(new Error("Unauthorized", { case: 401 }));
  if (userExist.deletedAt?.getTime() > payload.iat * 1000)
    return next(new Error("Invalid token", { case: 401 }));
  
  req.userExist = userExist;
  return next();
});
