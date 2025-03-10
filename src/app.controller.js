import connectDB from "./db/cinnection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import companyRouter from "./modules/company/company.controller.js";
import jobRouter from "./modules/job/job.controller.js";
import applicationRouter from "./modules/application/application.controller.js";
import { globalError } from "./utils/error/global-error.js";
import { notFound } from "./utils/error/not-found.js";

const bootstrap = async (app, express) => {
  app.use(express.json());

  app.use("/uploads", express.static("uploads"));

  await connectDB();

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/company", companyRouter);
  app.use("/job", jobRouter);
  app.use("/application", applicationRouter);

  app.all("*", notFound);
  app.use(globalError);
};
export default bootstrap;
