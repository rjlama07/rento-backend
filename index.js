import express, { json } from "express";
import cors from "cors";
import { dbConnection } from "./db/dbconnection.js";
import router from "./routes/routes.js";
import dotenv from "dotenv"; // if using ESM
import { getDatabaseInfo } from "./utils/environmentVariables.js";

dotenv.config(); // Load .env file into process.env

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

const { dbName, dbUser, dbPassword } = getDatabaseInfo();

dbConnection(dbName, dbUser, dbPassword);
app.listen(8080, () => {
  console.log("serecer is running at port 8080");
});
