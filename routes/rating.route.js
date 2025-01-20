import express from "express";
import { ratinguser } from "../controllers/rating.controller.js";

const router=express.Router();

router.post("/ratinguser",ratinguser)

export default router;