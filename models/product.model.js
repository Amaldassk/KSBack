import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true,
    },
    size:{
        type:String,
        required:true,
    },
    gauge:{
        type:Number,
        required:true,
    },
    color:{
        type:String,
        enum:["red","white","olive green","purple","blue","black"],
        default:"olive green",
        required:true,
    },
    images:{
        type:Array,
    },
    material:{
        type: String,
        enum:["plywood","steel","metal"],
        default:"",
        required:true,
    },
    powderCoated:{
        type: Boolean,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    }
},{
    timestamps:true,
});

export default mongoose.model('products',productSchema);