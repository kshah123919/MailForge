import mongoose from "mongoose"
const extractionSchema = new mongoose.Schema({
    data:{
        type:mongoose.Schema.Types.Mixed ,
        required:true,
    },
    rawContent:{
        type:String,
         required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }
},{timestamps:true})
const Extraction=mongoose.model("Extraction",extractionSchema);
export default Extraction