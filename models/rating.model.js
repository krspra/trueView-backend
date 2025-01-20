import {model,Schema} from "mongoose";

const ratingSchema=new Schema({
    ratedUser:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true,
    },
    givenBy:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true,
    },
    ratings: {
        Appearance: { type: Number, default: 0 },
        Intelligence: { type: Number, default: 0 },
        Humour: { type: Number, default: 0 },
        ContributionToSociety: { type: Number, default: 0 },
        Ambitious: { type: Number, default: 0 },
        Sporty: { type: Number, default: 0 },
        Helpfulness: { type: Number, default: 0 },
        CommunicationSkills: { type: Number, default: 0 },
        Hardworking: { type: Number, default: 0 },
        Creative: { type: Number, default: 0 },
    }    
});

const ratingModel=model("ratings",ratingSchema);

export default ratingModel;