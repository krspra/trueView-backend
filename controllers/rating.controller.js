import ratingModel from "../models/rating.model.js";

const ratinguser = async (req, res) => {
  const { ratedUser, givenBy, ratings, ratingAverage, ratingSum } = req.body;
  try {
    const existingRating = await ratingModel.findOne({
      ratedUser,
      givenBy,
    });

    if (existingRating) {
      existingRating.ratings = ratings;
      existingRating.ratingAverage = ratingAverage;
      existingRating.ratingSum = ratingSum;
      await existingRating.save();

      return res.status(200).json({ message: "rating updated", success: true });
    } else {
      await ratingModel.create({
        ratedUser,
        givenBy,
        ratings,
        ratingAverage,
        ratingSum,
      });
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
    return res.status(400).json({message:"no rating data found",success:false});
  } catch (error) {
    return res.status(400).json({message:"error fetching rating data",success:false})
  }
};

export { ratinguser,getRatings};
