import express from "express";
import authRouter from "./auth.route";
import refreshRouter from "./refreshToken.route";
import userRouter from "./user.route";
// import productRoutes from "./routes/products";

const rootRouter = express.Router();

//Health Check
rootRouter.get("/", (req, res) => {
  res.send("API Health Check is running...");
  console.log("API Health Check is running...");
});

//authentication routes
rootRouter.use(authRouter);

//refresh token routes
rootRouter.use(refreshRouter);

//user routes
rootRouter.use(userRouter);




export default rootRouter;