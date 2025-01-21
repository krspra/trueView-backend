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
              "$ratings.Creative"
            ]
          }
        }
      },
      {
        $group: {
          _id: "$ratedUser",
          totalSum: { $sum: "$totalRating" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          finalAverageRating: { $divide: ["$totalSum", { $multiply: ["$count", 10] }] }
        }
      }
    ]);

    if (result.length > 0) {
      const user = await userModel.findById(userId);

      if (user) {
        user.overallRating = result[0].finalAverageRating;
        await user.save();
        return user;
      } else {
        console.log('User not found');
      }
    } else {
      console.log('No ratings found for this user');
    }
    return null;
  } catch (error) {
    console.error("Error calculating final average rating:", error.message);
    throw error;
  }
};

const ratinguser = async (req, res) => {
  const { ratedUser, givenBy, ratings } = req.body;
  try {
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
  const { ratedUser, givenBy } = req.body;
  try {
    const ratingData = await ratingModel.findOne({ ratedUser, givenBy });
    if (ratingData) {
      return res.status(200).json({ ratingData, success: true });
    }
    return res.status(400).json({ message: "no rating data found", success: false });
  } catch (error) {
    return res.status(400).json({ message: "error fetching rating data", success: false });
  }
};

export { ratinguser, getRatings };
