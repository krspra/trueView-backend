import express from "express";
import {createuser,checkuser,checkusernameavailibilty,getUserInfo,getUserList,updateUserInfo} from "../controllers/user.controller.js"

const router=express.Router();

router.post("/createuser",createuser);
router.post("/checkuser",checkuser);
router.post("/checkusernameavailibilty",checkusernameavailibilty);
router.post("/getUserInfo",getUserInfo);
router.post("/getuserlist",getUserList);
router.post("/updateuserinfo",updateUserInfo);

export default router;