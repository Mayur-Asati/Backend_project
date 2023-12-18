import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "../src/app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`app is listening on ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error: ", error);
  });

/*
import express from "express";
const app = express()(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (err) => console.log("Error: ", err));
    app.listen(process.env.PORT, () => {
      console.log(`server is running on ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
})();
*/
