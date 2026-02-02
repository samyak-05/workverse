import uploadToCloudinary from "../utils/cloudinary.js";
import Post from "../models/post.js";
import {io} from "../index.js";
import Notification from "../models/notification.js";

//Create Post
export const createPost = async (req, res) => {
    try {
        let { content } = req.body;
        let newPost;

        if (req.file) {
            let image = await uploadToCloudinary(req.file.path);
            newPost = await Post.create({
                author: req.userId,
                content,
                image
            });
        }
        else {
            newPost = await Post.create({
                author: req.userId,
                content
            });
        }

        return res.status(200).json(newPost);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

//Get Posts

export const getPost = async (req, res) => {
    try {
        let post = await Post.find()
            .populate("author", "firstName lastName profilePic headline username")
            // ADDED: Deep populate for comments
            .populate({
                path: "comments.author",
                select: "firstName lastName profilePic headline"
            })
            .sort({ createdAt: -1 });
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: "get post error" });
    }
}

//Like Posts

export const likePost = async (req, res) => {
    try {
        let postId = req.params.id;
        let userId = req.userId;
        let post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({ message: "Post does not exisit" });
        }

        if (post.like.includes(userId)) {
            post.like = post.like.filter((id) => id != userId);
        }

        else {
            post.like.push(userId);
            if(post.author!=userId){
                await Notification.create({
                receiver: post.author,
                type: "comment",
                relatedUser: userId,
                relatedPost: postId
                });
            }
        }

        await post.save();
        io.emit("likeUpdated", { postId, likes: post.like });

        return res.status(200).json(post);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: `Error ${err}` })
    }
}

//Comment on Post

export const comment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        // Fetch post first
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Push comment and populate comments.author
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { $push: { comments: { content, author: userId } } },
            { new: true }
        ).populate({
            path: 'comments.author',
            select: 'firstName lastName profilePic headline'
        });

        if(post.author!=userId){
            await Notification.create({
            receiver: post.author,
            type: "comment",
            relatedUser: userId,
            relatedPost: id
        });
        }
        

        // Emit socket update
        io.emit("commentUpdated", { postId: id, comments: updatedPost.comments });

        return res.status(200).json(updatedPost);
    } catch (err) {
        console.log(err); // log for debugging
        return res.status(500).json({ message: err.message });
    }
}
