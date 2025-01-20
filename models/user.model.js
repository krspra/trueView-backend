import { model, Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    unique: [true, "username unavailable"],
    required: [true, "required"],
  },
  bio: {
    type: String,
    required: [true, "required"],
  },
  email: String,
  photoURL: String,
  numOfRatingsGiven: { type: Number, default: 0 },
  numOfRatingsReceived: { type: Number, default: 0 },
  overallRating: { type: Number, default: 0 },
  ratingCount:{type:Number,default:0},
});

const userModel = model("users", userSchema);

export default userModel;
