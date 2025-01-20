import ratingModel from "../models/rating.model.js";

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

      return res.status(200).json({message:"rating updated",success:true})
    } else {
      const newRating = await ratingModel.create({
        ratedUser,
        givenBy,
        ratings,
      });
      return res.status(200).json({message:"rating added",success:true});
    }
  } catch (error) {
    return res.status(400).json({message:"error occurred",error})
  }
};

export { ratinguser };
