import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String
    },
    username : {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type : String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    profilePic : {
        type: String,
        default: ""
    },
    coverPic : {
        type: String,
        default: ""
    },
    headline : {
        type: String,
        default: ""
    },
    skills : [
        {type: String}
    ],
    education : [
        {
            collegeName: {type: String},
            degree: {type: String},
            fieldOfStudy: {type: String},
            startYear: {type: Number},
            endYear: {type: Number}
        }
    ],
    location : {
        type: String,
        default: "India"
    },
    gender : {
        type: String,
        enum: ["Male", "Female", "Other"]
    },
    experience : [
        {
            companyName: {type: String},    
            position: {type: String},
        }
    ],
    connections : [
        {type : mongoose.Schema.Types.ObjectId, ref : "User" }
    ]
}, {timestamps: true})

const User = mongoose.model("User", userSchema);
export default User;