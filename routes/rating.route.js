import express from "express";
import { ratinguser,getRatings } from "../controllers/rating.controller.js";

const router=express.Router();

router.post("/ratinguser",ratinguser)
router.post("/getratings",getRatings)

export default router;