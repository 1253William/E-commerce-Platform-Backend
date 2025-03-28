import express from "express";
import authRouter from "./auth.route";

const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  res.send("API Health Check is running...");
  console.log("API Health Check is running...");
});

rootRouter.use(authRouter);


export default rootRouter;