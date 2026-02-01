import express from "express";
import { signUp, signIn, signOut } from "../controllers/authControllers.js";
let Router = express.Router();

//SignUp Route
Router.post("/signup", signUp);
Router.post("/signin", signIn);
Router.post("/signout", signOut);

export default Router;