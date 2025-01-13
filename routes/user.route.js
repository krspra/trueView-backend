import express from "express";
import {createuser,checkuser,checkusernameavailibilty,removeAccessToken} from "../controllers/user.controller.js"

const router=express.Router();

router.post("/createuser",createuser);
router.post("/checkuser",checkuser);
router.post("/checkusernameavailibilty",checkusernameavailibilty);
router.post("/removeAccessToken",removeAccessToken);

export default router;