import mongoose from "mongoose";

async function connectDB() {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log(err.message);
    });
}
export default connectDB;
 