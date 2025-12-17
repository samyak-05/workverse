import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import genToken from "../utils/token.js";

//SignUp Controller

export const signUp = async (req, res) => {
    try {
        let { firstName, lastName, username, email, password } = req.body;

        //Check pre-exsisting user

        let prevUser = await User.findOne({ $or: [{ email: email }, { username: username }] });
        if (prevUser) {
            return res.status(400).json({ message: "User already exists with given email or username" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        let encryptedPass = await bcryptjs.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            username,
            email,
            password: encryptedPass
        });

        const token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({ message: "User created successfully" });
    }

    catch (err) {
        console.log("Error during signup:", err.message);
        return res.status(500).json({
            message: "Error during signup",
            error: err.message
        });
    }

}

//SignIn Controller

export const signIn = async (req, res) => {
    try {
        let { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exists with given email" });
        }

        let isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error in SignIn", error: err.message });
    }
};

//SignOut Controller

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "SignOut Successful" });
    } catch (err) {
        return res.status(500).json({ message: "Error in SignOut", error: err.message });
    }
};