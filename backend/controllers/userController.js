import User from "../models/user.js";

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