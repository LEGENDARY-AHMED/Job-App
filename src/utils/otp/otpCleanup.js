import cron from "node-cron";
import { User } from "../../db/model/user.model.js";

/** Removes expired OTPs from the database */
const deleteExpiredOTPs = async () => {
  try {
    await User.updateMany({}, { $pull: { OTP: { expiresIn: { $lt: Date.now() } } } });
    console.log("Expired OTPs deleted successfully.");
  } catch (error) {
    console.error("Error deleting expired OTPs:", error);
  }
};

// Runs every 6 hours
cron.schedule("0 */6 * * *", deleteExpiredOTPs);
