import express from "express";
import { getCurrUser } from "../controllers/userController.js";
import isAuth from "../middlewares/isAuth.js";

let Router = express.Router();

//Get Current User Route
Router.get("/currentuser", isAuth, getCurrUser);

export default Router;