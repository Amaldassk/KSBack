import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    email:{
        type:String,
    },
    context:{
        type:String,
    },
    message:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    level:{
        type:String,
        required:true,
    },
    timeStap:{
        type:Date,
        required:true,
        default:Date.now,
        expires:604800, //1week
    },
});

export default mongoose.model("log",logSchema);