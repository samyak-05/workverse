import User from "../models/user.js";
import uploadToCloudinary  from "../utils/cloudinary.js";


//Get Current User Controller

export const getCurrUser = async(req,res) =>{
    try{
        const user = await User.findById(req.userId).select("-password -__v -createdAt -updatedAt");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        return res.status(200).json(user);
    } catch(err){
        console.log("Error in getCurrUser controller:", err);
        return res.status(500).json({message:"Internal Server Error", error: err.message});
    }
}

//Updating Profile Controller

export const updateProfile = async(req,res) =>{
    try{
        let {firstName, lastName, headline, location, gender} = req.body;
        let skills = req.body.skills ? JSON.parse(req.body.skills) : [];
        let education = req.body.education ? JSON.parse(req.body.education) : [];
        let experience = req.body.experience ? JSON.parse(req.body.experience) : [];
    let profilePic;
    let coverPic;

    if(req.files.profilePic){
        profilePic = await uploadToCloudinary(req.files.profilePic[0].path);
    }
    if(req.files.coverPic){
        coverPic = await uploadToCloudinary(req.files.coverPic[0].path);
    }

    let user = await User.findByIdAndUpdate(req.userId,{
        firstName,
        lastName,
        headline,
        location,
        gender,
        skills,
        education,
        experience,
        profilePic,
        coverPic
    },{new: true}).select("-password -__v -createdAt -updatedAt");

    return res.status(200).json(user);
    } catch (err){
        console.log("Error in updateProfile controller:", err);
        return res.status(500).json({message:"Profile Update Error", error: err.message});
    }
}