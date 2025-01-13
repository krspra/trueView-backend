import{model,Schema} from "mongoose";

const userSchema=new Schema({
    username:{
        type:String,
        unique:[true,"username unavailable"],
        required:[true,"required"],
    },
    email:String,
    photoURL:String,
})

const userModel=model("user",userSchema);

export default userModel;