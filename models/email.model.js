import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    messageId:{
        type:String,
        required:true,
    }
},{
    timestamps: true, 
});

export default mongoose.model('email', emailSchema);
