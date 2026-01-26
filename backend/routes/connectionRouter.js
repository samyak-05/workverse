import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { sendRequest , acceptRequest, rejectRequest, getConnectionStatus, removeConnection, getConnectionRequests, getUserConnections } from '../controllers/connectionController.js';

const Router = express.Router();

Router.get('/', isAuth, getUserConnections);
Router.get('/requests', isAuth, getConnectionRequests);
Router.post('/send/:id', isAuth, sendRequest);
Router.put('/accept/:connectionId', isAuth, acceptRequest);
Router.put('/reject/:connectionId', isAuth, rejectRequest);
Router.get('/getStatus/:userId', isAuth, getConnectionStatus);
Router.delete('/remove/:userId', isAuth, removeConnection);
export default Router;