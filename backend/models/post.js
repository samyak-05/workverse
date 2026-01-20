import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const postSchema = new mongoose.Schema({
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    content : {
        type : String,
        default : ""
    },
    image : {
        type : String,
    },
    like : [
        {type: mongoose.Schema.Types.ObjectId, ref : "User" }
    ],
    comments : [commentSchema]
}, {timestamps: true});

const Post = mongoose.model("Post", postSchema);
export default Post;