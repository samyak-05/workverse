import uploadToCloudinary from "../utils/cloudinary.js";
import Post from "../models/post.js";

//Create Post
export const createPost = async (req, res) =>{
    try {
        let {content} = req.body;
        let newPost;
        
        if(req.file){
            let image = await uploadToCloudinary(req.file.path);
            newPost = await Post.create({
                author:req.userId,
                content,
                image
            });
        }
        else{
            newPost = await Post.create({
                author:req.userId,
                content
            });
        }

        return res.status(200).json(newPost);
    } catch(err){
        console.log(err);
        return res.status(500).json({message : err.message});
    }
}