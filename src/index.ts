import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import  rootRouter  from "./routes/index.route";
dotenv.config();
// import productRoutes from "./routes/products";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use("/api/", rootRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

