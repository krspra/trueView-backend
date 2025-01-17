import express from "express";
import {createuser,checkuser,checkusernameavailibilty,getUserInfo} from "../controllers/user.controller.js"

const router=express.Router();

router.post("/createuser",createuser);
router.post("/checkuser",checkuser);
router.post("/checkusernameavailibilty",checkusernameavailibilty);
router.post("/getUserInfo",getUserInfo);

export default router;