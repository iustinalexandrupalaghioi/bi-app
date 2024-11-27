import express from "express";
import getSalesData from "../controllers/salesDataController.js";
import getSalesAnalysis from "../controllers/salesAnalysisController.js";
import getSalesPerCategory from "../controllers/salesPerCategoryController.js";
import getSalesTrend from "../controllers/getSalesTrend.js";

const SalesRouter = express.Router();

SalesRouter.get("/data", getSalesData);

SalesRouter.get("/analysis", getSalesAnalysis);

SalesRouter.get("/category-series", getSalesPerCategory);

SalesRouter.get("/trend", getSalesTrend);

export default SalesRouter;
