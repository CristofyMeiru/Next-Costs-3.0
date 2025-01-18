import mongoose from "mongoose";
require("dotenv").config();

async function ConnectToDB() {
  const db_url = String(process.env.DB_URL);

  await mongoose
    .connect(db_url)
    .then(() => {
      console.log("Success mongoose connection...");
    })
    .catch((err) => {
      console.log(err);
    });
}
export default ConnectToDB