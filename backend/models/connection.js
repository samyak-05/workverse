import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
    sender :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reciever :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    status :{
        type : String,
        enum : ["Pending", "Accepted", "Rejected"],
        default : "Pending"
    }

},{timestamps: true});

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;