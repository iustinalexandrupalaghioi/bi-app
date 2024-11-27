import express from "express";
import cors from "cors";
import "dotenv/config";
import SalesRouter from "./routes/salesRoutes.js";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use workout routes
app.use("/api/sales", SalesRouter);

// Listen on the port defined in the .env file
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
