import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { sendRequest , acceptRequest, rejectRequest, getConnectionStatus, removeConnection, getConnectionRequests, getUserConnections } from '../controllers/connectionController.js';

const Router = express.Router();

Router.get('/', isAuth, getUserConnections);
Router.get('/requests', isAuth, getConnectionRequests);
Router.get('/send/:id', isAuth, sendRequest);
Router.get('/accept/:connectionId', isAuth, acceptRequest);
Router.get('/reject/:connectionId', isAuth, rejectRequest);
Router.get('/getStatus/:userId', isAuth, getConnectionStatus);
Router.get('/remove/:userId', isAuth, removeConnection);
export default Router;