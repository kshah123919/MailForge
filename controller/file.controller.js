import cloudinary from "../config/cloud.config.js"
import File from "../model/file.model.js"
import User from "../model/auth.model.js"
export const uploadFile=async(req,res)=>{
    try {
        if(!req.file)
        {
            return res.status(400).json({
                message:"File is required..",
                success:false
            })
        }
        const {fileName}=req.body
        if(!fileName){
            return res.status(400).json({
                message:"FileName is required..",
                success:false
            })
        }
        const result=await new Promise((resolve,rejected)=>{
            const stream=cloudinary.uploader.upload_stream(
                {
                    folder:"files",
                resource_type:"auto"
                },
                (error,result)=>{
                    if(error)
                    {
                        return rejected(error)
                    }else{
                        return resolve(result)
                    }
                }
               
            )
            stream.end(req.file.buffer)
        })
        const file=await File.create({
            fileName,
            fileURL:result.secure_url,
            CreatedBy:req.user._id
        })
        await User.findByIdAndUpdate(req.user._id,{
            $push:{
                files:file._id
            }
        })
        return res.status(201).json({
            success:true,
            message:"File uploaded Succesfully ",
            file
        })
    } catch (error) {
        console.log("File Uplod Error :" ,error.message);

         return res.status(500).json({
            success:false,
            message:"Internal Server Error ",
            
        })
    }
}