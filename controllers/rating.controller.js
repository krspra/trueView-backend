import ratingModel from "../models/rating.model.js";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";

const incrementNumOfRatingsGiven = async (userId) => {
  try {
    await userModel.findByIdAndUpdate(userId, {
      $inc: { numOfRatingsGiven: 1 },
    });
  } catch (error) {
    console.error("Error updating numOfRatingsGiven:", error.message);
  }
};

const incrementNumOfRatingsReceived = async (ratedUserId) => {
  try {
    await userModel.findByIdAndUpdate(ratedUserId, {
      $inc: { numOfRatingsReceived: 1 },
    });
  } catch (error) {
    console.error("Error updating numOfRatingsReceived:", error.message);
  }
};

const calculateFinalAverageRating = async (userId) => {
  try {
    const objectId = new mongoose.Types.ObjectId(userId); // To Convert userId to ObjectId
    const result = await ratingModel.aggregate([
      { $match: { ratedUser: objectId } },
      {
        $addFields: {
          totalRating: {
            $add: [
              "$ratings.Appearance",
              "$ratings.Intelligence",
              "$ratings.Humour",
              "$ratings.ContributionToSociety",
              "$ratings.Ambitious",
              "$ratings.Sporty",
              "$ratings.Helpfulness",
              "$ratings.CommunicationSkills",
              "$ratings.Hardworking",
              "$ratings.Creative",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$ratedUser",
          totalSum: { $sum: "$totalRating" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalSum: 1,
          finalAverageRating: { $divide: ["$totalSum", { $multiply: ["$count", 10] }] },
        },
      },
    ]);

    if (result.length > 0) {
      const { totalSum, finalAverageRating } = result[0];
      const roundedoff=finalAverageRating.toFixed(2);
      await userModel.findByIdAndUpdate(userId, {
        $set: {
          overallRating: roundedoff,
          ratingCount: totalSum,
        },
      });
      return {
        overallRating: finalAverageRating,
        ratingCount: totalSum,
      };
    } else {
      console.log("No ratings found for this user");
    }
    return null;
  } catch (error) {
    console.error("Error calculating final average rating:", error.message);
    throw error;
  }
};

const ratinguser = async (req, res) => {
  const { ratedUser, ratings } = req.body;
  const email=req.email;
  
  try {
    const loggedInUser=await userModel.findOne({email},{_id:1}).lean();
    const givenBy=loggedInUser._id;
    if(ratedUser==givenBy){
      return res.status(400).json({message:"you can't rate yourself",success:false})
    }
    for(let key in ratings){
      if(ratings[key] < 0 || ratings[key] > 10){
        return res.status(400).json({message:"invalid ratings",success:false})
      }
    }
    const existingRating = await ratingModel.findOne({
      ratedUser,
      givenBy,
    });

    if (existingRating) {
      existingRating.ratings = ratings;
      await existingRating.save();
      await calculateFinalAverageRating(ratedUser);

      return res.status(200).json({ message: "rating updated", success: true });
    } else {
      await ratingModel.create({
        ratedUser,
        givenBy,
        ratings,
      });

      await incrementNumOfRatingsGiven(givenBy);
      await incrementNumOfRatingsReceived(ratedUser);
      await calculateFinalAverageRating(ratedUser);

      return res.status(200).json({ message: "rating added", success: true });
    }
  } catch (error) {
    return res.status(400).json({ message: "error occurred", error });
  }
};

const getRatings = async (req, res) => {
  const { ratedUser } = req.body;
  const email=req.email;
  try {
    const loggedInUser=await userModel.findOne({email},{_id:1}).lean();
    const givenBy=loggedInUser._id;
    const ratingData = await ratingModel.findOne({ ratedUser, givenBy },{ratings:1,_id:0});
    if (ratingData) {
      return res.status(200).json({ ratingData, success: true });
    }
    return res.status(200).json({ message: "no rating data found", success: false });
  } catch (error) {
    return res.status(400).json({ message: "error fetching rating data", success: false });
  }
};

export { ratinguser, getRatings };
