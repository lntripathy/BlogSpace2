import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";


export const register = async (req, res) => {
    try {
        const { firstName, lastName, email,  password } = req.body;
        if (!firstName || !lastName || !email ||  !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const existingUserByEmail = await User.findOne({ email: email });

        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // const existingUserByUsername = await User.findOne({ userName: userName });

        // if (existingUserByUsername) {
        //     return res.status(400).json({ success: false, message: "Username already exists" });
        // }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            success: true,
            message: "Account Created Successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        })

    }
}

export const login = async(req, res) => {
    try {
        const {email,  password } = req.body;
        if (!email && !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password"
            })
        }
       
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Credentials" 
            })
        }
        
        const token = await jwt.sign({userId:user._id}, process.env.SECRET_KEY, { expiresIn: '1d' })
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: "strict" }).json({
            success:true,
            message:`Welcome back ${user.firstName}`,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to Login",           
        })
    }
  
}

export const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// export const updateProfile = async(req, res) => {
//     try {
//         const userId= req.id
//         const {firstName, lastName, occupation, bio, instagram, facebook, linkedin, github} = req.body;
//         const file = req.file;

//         const fileUri = getDataUri(file)
//         let cloudResponse = await cloudinary.uploader.upload(fileUri)

//         const user = await User.findById(userId).select("-password")
        
//         if(!user){
//             return res.status(404).json({
//                 message:"User not found",
//                 success:false
//             })
//         }

//         // updating data
//         if(firstName) user.firstName = firstName
//         if(lastName) user.lastName = lastName
//         if(occupation) user.occupation = occupation
//         if(instagram) user.instagram = instagram
//         if(facebook) user.facebook = facebook
//         if(linkedin) user.linkedin = linkedin
//         if(github) user.github = github
//         if(bio) user.bio = bio
//         if(file) user.photoUrl = cloudResponse.secure_url

//         await user.save()
//         return res.status(200).json({
//             message:"profile updated successfully",
//             success:true,
//             user
//         })
        
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to update profile"
//         })
//     }
// }

export const updateProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const updateData = {};

    // basic fields
    if (req.body.firstName !== undefined) updateData.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) updateData.lastName = req.body.lastName;
    if (req.body.bio !== undefined) updateData.bio = req.body.bio;
    if (req.body.occupation !== undefined) updateData.occupation = req.body.occupation;

    // 🔥 SOCIAL LINKS (THIS WAS THE BUG)
    if (req.body.facebook?.trim()) updateData.facebook = req.body.facebook;
    if (req.body.linkedin?.trim()) updateData.linkedin = req.body.linkedin;
    if (req.body.github?.trim()) updateData.github = req.body.github;
    if (req.body.instagram?.trim()) updateData.instagram = req.body.instagram;

    // image upload
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloud = await cloudinary.uploader.upload(fileUri, {
        folder: "profile_images",
      });
      updateData.photoUrl = cloud.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};



export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password'); // exclude password field
      res.status(200).json({
        success: true,
        message: "User list fetched successfully",
        total: users.length,
        users
      });
    } catch (error) {
      console.error("Error fetching user list:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users"
      });
    }
  };