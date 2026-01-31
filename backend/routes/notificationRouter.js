import express from "express"
import { deleteAllNotifications, deleteNotification, getNotifications } from "../controllers/notificationController.js";
import isAuth from '../middlewares/isAuth.js';

const Router = express.Router();

Router.get("/", isAuth , getNotifications);
Router.delete("/", isAuth, deleteAllNotifications);
Router.delete("/delete/:id", isAuth, deleteNotification);

export default Router;