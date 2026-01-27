import express from "express";
import { getCurrUser, getProfile, updateProfile, search } from "../controllers/userController.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

let Router = express.Router();

//Get Current User Route
Router.get("/currentuser", isAuth, getCurrUser);
Router.put("/updateProfile",isAuth, upload.fields([
    {name : "profilePic", maxCount: 1},
    {name : "coverPic", maxCount: 1}
]), updateProfile);
Router.get("/profile/:username", isAuth, getProfile)
Router.get("/search", isAuth, search);

export default Router;