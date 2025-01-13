import userModel from "../models/user.model.js";

const createuser = async function (req, res) {
  let { username, email, photoURL } = req.body;
  try {
    await userModel.create({ username, email, photoURL });
    return res
      .status(200)
      .json({ message: "user created successfully", success: true });
  } catch (err) {
    //this will be mainly for backend side api testing and on frontend it is gernerally managed by RHF(react-hook-form)
    if (err.name === "ValidationError") {
      const result = {};
      for (let key in err.errors) {
        result[key] = err.errors[key].message;
      }
      return res.status(400).json({
        message: result,
        success: false,
      });
    } else if (err.name === "MongooseError") {
      return res.status(400).json({
        message: err.message,
        success: false,
      });
    }
    return res.status(500).json({
      message: "An unexpected error occurred",
      success: false,
    });
  }
};

const checkuser = async function (req, res) {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return res.status(200).json({
      message: "user exists",
      success: true,
      username: user.username,
    });
  }
  return res.status(200).json({
    message: "user not exist",
    success: false,
  });
};
const checkusernameavailibilty = async function (req, res) {
  let { username } = req.body;
  username = username.toUpperCase();
  const checkusername = await userModel.findOne({ username });
  if (checkusername) {
    return res.status(200).json({
      message: "username already taken",
      success: false,
    });
  }
  return res.status(200).json({
    message: "username not taken",
    success: true,
  });
};

const removeAccessToken = function (req, res) {
  // const {accessToken}=req.cookies;
  return res
    .clearCookie("accessToken")
    .status(200)
    .json({ message: "removed accessToken successfully", success: true });
};
export { createuser, checkuser, checkusernameavailibilty, removeAccessToken };
