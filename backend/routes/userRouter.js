import express from "express";
import { getCurrUser, updateProfile } from "../controllers/userController.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

let Router = express.Router();

//Get Current User Route
Router.get("/currentuser", isAuth, getCurrUser);
Router.put("/updateProfile",isAuth, upload.fields([
    {name : "profilePic", maxCount: 1},
    {name : "coverPic", maxCount: 1}
]), updateProfile);

export default Router;