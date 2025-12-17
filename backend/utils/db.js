import mongoose from "mongoose"

const connectDB = async () =>{
    try{
       await mongoose.connect(process.env.ATLAS_URL)
       console.log("MongoDB connected successfully");
    }
    catch(err){
        console.log("DB Error");
    }
}

export default connectDB;