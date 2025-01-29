import userModel from "../models/user.model.js";

const createuser = async function (req, res) {
  let { username, email, photoURL, bio } = req.body;
  try {
    await userModel.create({ username, email, photoURL, bio });
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
  const userExists = await userModel.exists({ email });
  if (userExists) {
    return res.status(200).json({
      message: "user exists",
      success: true,
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

const getUserInfo = async function (req, res) {
  const { email, username } = req.body;
  if (email) {
    const user = await userModel.findOne({ email }, { _id: 0, email: 0 });
    if (user) {
      return res.status(200).json({ user, success: true });
    } else {
      return res
        .status(400)
        .json({ message: "user not found", success: false });
    }
  }

  if (username) {
    const userNAME = username.toUpperCase();
    const user = await userModel.findOne({ username: userNAME }, { email: 0 });
    if (user) {
      return res.status(200).json({ user, success: true });
    } else {
      return res
        .status(400)
        .json({ message: "user not found", success: false });
    }
  }
};

const getUserList = async function (req, res) {
  const { currentPage } = req.body;
  const limit = 10;

  try {
    const users = await userModel
      .find({}, { username: 1, photoURL: 1, _id: 0 })
      .skip((currentPage - 1) * limit)
      .limit(limit);

    const totalUsers = await userModel.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      totalPages,
      currentPage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

const updateUserInfo = async function (req, res) {
  const { username, bio, photoURL } = req.body;
  const email = req.email;
  try {
    const loggedInUser = await userModel.findOne({ email }).lean();
    const userId = loggedInUser._id;
    await userModel.findByIdAndUpdate(userId, { username, bio, photoURL });
    return res.status(200).json({message:"profile updated successfully",success:true})
  } catch (error) {
    return res.status(400).json({message:"Cannot update user info",success:"false"});
  }
};
export {
  createuser,
  checkuser,
  checkusernameavailibilty,
  getUserInfo,
  getUserList,
  updateUserInfo
};
