// import User from "../model/auth.model.js"
// import mongoose from "mongoose"
// import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"
// export const registerUser =async(req,res)=>{
//     try {
//         const {name,email,password,domain,skills}=req.body
//         if(!name || !email || !password)
//         {
//            return res.status(400).json({
//             message:"Please fill all fields",
//             success:false
//            })
            
//         }
//         if(password.length <8 )
//         {
//              return res.status(400).json({
//             message:"Password should be greater than 8",
//             success:false
//            })
//         }
//         const existingUser=await User.findOne({email})
//         if(existingUser)
//         {
//             return res.status(400).json({
//                 message:"User already exists",
//                 success:false
//             })
//         }
//         const hashedpassword=await bcrypt.hash(password,10)
//         const user =await User.create({
//             name,
//             password:hashedpassword,
//             email,
//             domain,
//             skills
//         })
//         return res.status(201).json({
//             message:"User Created successfully !",
//             success:true,
//             user
//         })
//     } catch (error) {
//        console.log(error.message);
       
//         return res.status(500).json({
//             message:"Internal Server Error ",
//             success:false,
            
//         })
//     }

// }
// export const loginuser=async(req,res)=>{
// try {
//     const {email,password}=req.body;
//     const user=await User.findOne({email}).select('+password')
//     if(!user)
//     {
//         return res.status(400).json({
//             message:"Invalid email or password  ",
//             success:false,
            
//         })
//     }
//     const isMatch=await bcrypt.compare(password,user.password)
//     if(isMatch){
//         return res.status(400).json({
//             message:"Invalid Password",
//             success:false,
            
//         })
//     }
//     const token=jwt.sign({userId:user._id},process.env.JWT_SECRET)
//     return res.status(200).json({
//         message:"Login Successfully",
//         success:true,
//         user,
//         token
//     })
// } catch (error) {
//     console.log(error.message);
//     return res.status(500).json({
//         message:"Internal Server Error",
//         success:false,
       
//     })
// }
// }
import User from "../model/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ==============================
// REGISTER USER
// ==============================
export const registerUser = async (req, res) => {
    try {
        console.log("REGISTER API CALLED");
        console.log("BODY:", req.body);

        const { name, email, password, domain, skills } = req.body;

        // 1. Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        // 2. Check password length
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password should be at least 8 characters"
            });
        }

        // 3. Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create user
        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            domain: domain,
            skills: skills
        });

        console.log("USER CREATED:", user._id);

        // 6. Remove password before sending response
        const userData = user.toObject();
        delete userData.password;

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: userData
        });

    } catch (error) {

        console.error("REGISTER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==============================
// LOGIN USER
// ==============================
export const loginuser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // 1. Check fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // 2. Find user
        const user = await User
            .findOne({ email })
            .select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        // IMPORTANT
        // isMatch === true means password is correct
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 4. Generate JWT
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // 5. Remove password
        const userData = user.toObject();
        delete userData.password;

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            user: userData,
            token: token
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};