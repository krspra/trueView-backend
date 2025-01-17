import {model,Schema} from "mongoose";

const ratingSchema=new Schema({

});

const ratingModel=model("ratings",ratingSchema);

export default ratingModel;