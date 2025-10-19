import express, { json } from "express";
import cors from "cors";

const app = express();

app.listen(8080, () => {
  console.log("serecer is running at port 8080");
});
